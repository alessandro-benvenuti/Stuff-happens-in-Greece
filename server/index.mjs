// imports
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

import dayjs from 'dayjs';
import {
  getUser,
  getUserById,
  getAllCards, 
  getCardById,
  createMatch,
  getMatchById,
  drawCard,
  getCurrentMatchByUserId,
  removeC4,
  removeC5,
  removeC6,
  removeC7,
  removeC8,
  updateMatchWin,
  formatMatch,
  updateRoundWin
} from './dao.mjs';

// init express
const app = new express();
const port = 3001;

// static files
app.use('/images', express.static('public/images'));


const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
};

app.use(cors(corsOptions));

// middleware
app.use(express.json());
app.use(morgan('dev'));

// login
app.use(session({
  secret: "this_is_a_secret_key",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));
// app.use(passport.initialize());
// app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  done(null, user);
});

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
  return cb(null, user);
}));

// protection middleware
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

// login routes
app.post('/api/sessions', passport.authenticate('local'), function(req, res) {
  return res.status(201).json(req.user);
});

app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// logout route
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// app routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/cards', async (req, res) => {
  const card = await getAllCards();
  res.json(card);
});

app.get('/api/cards/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const card = await getCardById(id);
    if (card) {
      res.json(card);
    } else {
      res.status(404).send('Card not found');
    }
  } catch (error) {
    console.error('Errore getCardById:', error);
    res.status(500).send('Error retrieving card');
  }
});

/*
app.post('/api/matches', isLoggedIn, async (req, res) => {
  const { uid } = req.user.id;
  const cards = [];

  // Validate UID
  if (!uid || typeof uid !== 'string') {
    return res.status(400).send('Invalid UID');
  }
  try {
    const user = await getUserById(uid);
    if (!user) {
      return res.status(404).send('User not found');
    }
  }
  catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).send('Error retrieving user');
  }
  
  // timestamp
  const timestamp = dayjs().toISOString();

  // get 3 random cards from the database
  try {
    const allCards = await getAllCards();
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * allCards.length);
      if (cards.includes(allCards[randomIndex])) {
        i--; // If the card is already selected, decrement i to try again
        continue;
      }
      cards.push(allCards[randomIndex]);
    }
  } catch (error) {
    console.error('Error retrieving cards:', error);
    return res.status(500).send('Error retrieving cards');
  }


  try {
    const match = await createMatch(uid, timestamp, cards[0].CID, cards[1].CID, cards[2].CID);
    res.status(201).json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).send('Error creating match');
  }
});
*/

// API to draw a new card for the match
app.put('/api/matches/:id', isLoggedIn, async (req, res) => {
  const matchId = req.params.id;

  const match = await getMatchById(matchId);
  if (!match) {
    return res.status(404).send('Match not found');
  }
  const cards = [
    match.C1,
    match.C2,
    match.C3,
    match.C4,
    match.C5,
    match.C6,
    match.C7,
    match.C8
  ].filter(card => card !== null && card !== undefined);

  const allCards = await getAllCards();
  const availableCards = allCards.filter(card => !cards.includes(card.CID));

  const randoomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
  if (!randoomCard) {
    return res.status(404).send('No available cards to draw');
  }

  try{
    const match = await drawCard(matchId, randoomCard.CID);
    if (match.error) {
      return res.status(400).send(match.error);
    }
    res.status(200).json(match);
  } catch (error) {
    console.error('Error drawing card:', error);
    res.status(500).send('Error drawing card');
  }
});

// API to retrieve the last current match or create a new one
// Searches if there is a current match for the user, otherwise it creates a new one
app.get('/api/matches/current', isLoggedIn, async (req, res) => {
  try {
    // req.user.id contains the ID of the authenticated user
    const userId = req.user.id;
    // Retrieve the current match for the user
    const match = await getCurrentMatchByUserId(userId);
    if (!match || match == null) {
      // if no match is found, create a new one
      const cards = [];


      // Validate UID
      if (!userId) {
        return res.status(400).send('Invalid userId');
      }
      try {
        const user = await getUserById(userId);
        if (!user) {
          return res.status(404).send('User not found');
        }
      }
      catch (error) {
        console.error('Error retrieving user:', error);
        return res.status(500).send('Error retrieving user');
      }

      
      // timestamp
      const timestamp = dayjs().toISOString();



      // get 3 random cards from the database
      try {
        const allCards = await getAllCards();
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * allCards.length);
          if (cards.includes(allCards[randomIndex])) {
            i--; // If the card is already selected, decrement i to try again
            continue;
          }
          cards.push(allCards[randomIndex]);
        }
      } catch (error) {
        console.error('Error retrieving cards:', error);
        return res.status(500).send('Error retrieving cards');
      }

      try {
        const match = await createMatch(userId, timestamp, cards[0].CID, cards[1].CID, cards[2].CID);
        res.status(201).json(await formatMatch(match));
      } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).send('Error creating match');
      }
    
    }
    else{
      // if a match is found, return it after making sure everything is ok
      // chech that if as card exists than its rund is either won or lost
      if(match.C4 != null && match.W4 == null){
        // we need to remove the card from the match
        await removeC4(match.MID);
      }
      if(match.C5 != null && match.W5 == null){
        // we need to remove the card from the match
        await removeC5(match.MID);
      }
      if(match.C6 != null && match.W6 == null){
        // we need to remove the card from the match
        await removeC6(match.MID);
      }
      if(match.C7 != null && match.W7 == null){
        // we need to remove the card from the match
        await removeC7(match.MID);
      }
      if(match.C8 != null && match.W8 == null){
        // we need to remove the card from the match
        await removeC8(match.MID);
      }
      res.json(await formatMatch(match));
    }
  } catch (error) {
    console.error('Error retrieving current match:', error);
    res.status(500).json({ error: 'Error retrieving current match' });
  }
});


// API to check if the round is won or lost
app.post('/api/matches/:id/', isLoggedIn, async (req, res) => {
  const matchId = req.params.id;
  const { lower, upper } = req.body;

  try{
    // retrieve the last drawn card of the match
    const match = await getMatchById(matchId);

    const cards = [
      match.C1,
      match.C2,
      match.C3,
      match.C4,
      match.C5,
      match.C6,
      match.C7,
      match.C8
    ].filter(card => card !== null && card !== undefined);

    const lastCard = await getCardById(cards[cards.length - 1]);

    const lastRound = cards.length; // the first 3 cards are the initial ones

    if (!lastCard) {
      return res.status(404).send('Last card not found');
    }

    if( lastCard.Value >= lower && lastCard.Value <= upper) {
      // the round is won
      await updateRoundWin(matchId, lastRound, 1);
      return res.status(200).json({
        message: 'Round won',
        card: lastCard
      });
    }
    else{
      // the round is lost
      await updateRoundWin(matchId, lastRound, 0);
      return res.status(200).json({
        message: 'Round lost',
        card: lastCard
      });
    }


  } catch(error) {
    console.error('Error checking round:', error);
    return res.status(500).send('Error checking round');
  }
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});