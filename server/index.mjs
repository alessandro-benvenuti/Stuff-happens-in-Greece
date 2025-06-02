// imports
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import dayjs from 'dayjs';
import {
  getUserById,
  getAllCards, 
  getCardById,
  createMatch,
  getMatchById,
  drawCard
} from './dao.mjs';

// init express
const app = new express();
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
};

app.use(cors(corsOptions));

// middleware
app.use(express.json());
app.use(morgan('dev'));

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
    console.log(card);
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

app.post('/api/matches', async (req, res) => {
  const { uid } = req.body;
  const cards = [];

  // Validate UID
  /*
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
    */
  
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

app.put('/api/matches/:id', async (req, res) => {
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
    const drawnCard = await drawCard(matchId, randoomCard.CID);
    if (drawnCard.error) {
      return res.status(400).send(drawnCard.error);
    }
    res.status(200).json(drawnCard);
  } catch (error) {
    console.error('Error drawing card:', error);
    res.status(500).send('Error drawing card');
  }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});