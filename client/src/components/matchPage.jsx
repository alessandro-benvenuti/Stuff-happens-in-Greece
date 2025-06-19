import React, { useRef, useEffect, useState } from 'react';
import API from '../API/API.mjs';
import { SERVER_URL } from '../API/API.mjs';
import { Button } from 'react-bootstrap';
import { useActionState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/matchPage.css';

const MatchPage = (props) => {
  // into the props we have loggedIn which tells if the user is logged in or not
  // we need to differentiate between the logged in user and the guest user
  const { loggedIn, darkMode } = props;

  const [match, setMatch] = useState(null);

  // we need to keep track of the playing state
  const [isPlaying, setIsPlaying] = useState(false);

  // we need to keep track of the timer
  const [timeLeft, setTimeLeft] = useState(30);

  // we need to keep track of the selected card index
  const [selectedIdx, setSelectedIdx] = useState(-1);

  // we need to keep track of the previous round
  const [previousRound, setPreviousRound] = useState(null);

  // we need to keep track if the player wins the game
  const [showWinModal, setShowWinModal] = useState(null);
  const [wonCards, setWonCards] = useState([]);

  useEffect(() => {     // the component is mounted with the page
    const fetchMatch = async () => {
      try {
        if(loggedIn) {
            // if the user is logged in, we fetch the current match 
            const m = await API.getCurrentMatch();
            setMatch(m);
        }
        else{
          // if the user is a guest, we get the match for the guest
          const m = await API.getMatchGuest();
          setMatch(m);
        }
      } catch (error) {
        setMatch(null);
      }
    };
    fetchMatch();
  }, []);

  // Function to draw a new card
  const handleDrawCard = async () => {
    try {
      if(loggedIn){
        const updatedMatch = await API.drawCard(match.MID);
        setMatch(updatedMatch);
        setIsPlaying(true);
      } else {
        const updatedMatch = await API.drawCardGuest(match.cards[0].cid, match.cards[1].cid, match.cards[2].cid);
        setMatch(updatedMatch);
        setIsPlaying(true);
      }
    } catch (error) {
      setMatch(null);
    }
  };

  // Function to handle the timer
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft === 0) return;

    // wait one seconda and then update the time left
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);    // eaxch time the state changes, we check if we need to update the timer

  return (
    <div className='container pt-5 pb-5'>
      <WinModal
        showWinModal={showWinModal}
        wonCards={wonCards}
        setMatch={setMatch}
        setShowWinModal={setShowWinModal}
        loggedIn={loggedIn}
        theme={darkMode ? "dark" : "light"} // Pass the theme based on darkMode prop
      />
      {match && <DisplayMatch 
        match={match}
        setMatch={setMatch}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        handleDrawCard={handleDrawCard} 
        selectedIdx={selectedIdx}
        setSelectedIdx={setSelectedIdx}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        previousRound={previousRound}
        setPreviousRound={setPreviousRound}
        showWinModal={showWinModal}
        setShowWinModal={setShowWinModal}
        shownCards={wonCards}
        setWonCards={setWonCards}
        loggedIn={loggedIn}
        theme={darkMode ? "dark" : "light"} // Pass the theme based on darkMode prop
      />}
    </div>
  );
};

function DisplayMatch({ match,
   setMatch, 
   isPlaying, 
   setIsPlaying, 
   handleDrawCard, 
   selectedIdx, 
   setSelectedIdx, 
   timeLeft, 
   setTimeLeft, 
   previousRound, 
   setPreviousRound, 
   showWinModal, 
   setShowWinModal, 
   shownCards, 
   setWonCards,
   loggedIn,
   theme = "light" // default theme is light
}) {
  const deckCards = match.cards
    .filter(card => card !== undefined)
    .filter(card => card.value !== -1 && card.won == 1)
    .sort((a, b) => a.value - b.value);

    const valid_cards = match.cards
    .filter(card => card.name !== undefined)


    const last_card = valid_cards[valid_cards.length - 1];

  // we have to display at the top the last card drawn and then the other cards
  return (
    <div className="container">
      <div className="row align-items-start">
        <div className="col-5 p-0 m-0"/>
        <div className="col-3">
          {isPlaying ? displayCard(last_card, theme) : displayCoveredCard(theme)}
        </div>
        <div className="col-4 border p-3">
          {loggedIn && displayPastRounds(match.cards) /*show the previous rounds only if the user is logged in*/}
          {isPlaying ? (
            <>
              <div className="row justify-content-between">
                <div className="col-4">
                  Time left:
                </div>
                <div className="col-4">
                  {timeLeft}s
                </div>
              </div>
              <div className="progress mt-1 mb-3 progress-rtl" role="progressbar" aria-valuenow={timeLeft}>
                  <div className={"progress-bar " +
                    (timeLeft > 10
                      ? "bg-success"
                      : timeLeft > 3
                      ? "bg-warning"
                      : "bg-danger")
                  } style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
              </div>
              <SendSelectedForm 
                selectedIdx={selectedIdx} 
                setSelectedIdx={setSelectedIdx}
                deckCards={deckCards} 
                timeLeft={timeLeft} 
                setIsPlaying={setIsPlaying}
                matchId={match.MID}
                setPreviousRound={setPreviousRound}
                setMatch={setMatch}
                setShowWinModal={setShowWinModal}
                setWonCards={setWonCards}
                loggedIn={loggedIn}
                allCards={match.cards}
              />
            </>
          ) : (
            <>
              {previousRound === null
                ? <h4>Are you ready?</h4>
                : previousRound === 1
                  ? <h4 className="text-success">You got it right!</h4>
                  : <h4 className="text-danger">You got it wrong! Better luck next time.</h4>
              }
              <Button variant="primary" onClick={() => { 
                  setIsPlaying(true);
                  setSelectedIdx(-1);
                  setTimeLeft(30);
                  handleDrawCard(); 
              }}>
                Show new card
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="container-fluid mt-5 mb-5">
        <h4>Your Deck:</h4>
        {displayDeckCards(deckCards, selectedIdx, setSelectedIdx, isPlaying, theme)}
      </div>


    </div>
  )
}

function displayPastRounds(cards){
  const selectedCards = cards.slice(3, 8); // from index 3 to 7 inclusive
  return (
    <div className="row justify-content-center">
      <h4>Previous rounds:</h4>
      {selectedCards.map((card, idx) => (
        <React.Fragment key={idx}>
          {
            card.won === 1 ? (
              <div className="col-2 text-success">
                <h1>
                  <i className="bi bi-check-square"></i>
                </h1>
              </div>
            ) : card.won === 0 ? (
              <div className="col-2 text-danger">
                <h1>
                  <i className="bi bi-x-square"></i>
                </h1>
              </div>
            ) : (
              <div className="col-2">
                <h1>
                  <i className="bi bi-square"></i>
                </h1>
              </div>
            )
          }
        </React.Fragment>
      ))}
    </div>
  );
}

function displayDeckCards(deckCards, selectedIdx, setSelectedIdx, isPlaying, theme) {
  return (
    <div className="row align-items-center justify-content-center">
      {/* Prima colonna vuota */}
      <div className="col-1">
        <EmptyColButton idx={0} selectedIdx={selectedIdx} isPlaying={isPlaying} setSelectedIdx={setSelectedIdx} />
      </div>
      {deckCards
        .map((card, idx) => (
          <React.Fragment key={idx + 1}>
            <div className="col-3">
              {displayCard(card, theme)}
            </div>
            <div className="col-1">
              <EmptyColButton idx={idx + 1} selectedIdx={selectedIdx} isPlaying={isPlaying} setSelectedIdx={setSelectedIdx} />
            </div>
          </React.Fragment>
        ))}
    </div>
  );
}

function EmptyColButton({ idx, selectedIdx, setSelectedIdx, isPlaying }) {
  if (isPlaying)
    return (
      <>
        {selectedIdx === idx ? (
          <button className="btn btn-outline btn-sm text-primary" onClick={() => setSelectedIdx(-1)}>
            <h1>
              <i className="bi bi-check2-circle"></i>
            </h1>
          </button>
        ) : (
          <button className="btn btn-outline btn-sm" onClick={() => setSelectedIdx(idx)}>
            <h1>
              <i className="bi bi-plus-circle-fill"></i>
            </h1>
          </button>
        )}
      </>
    );
  else
    return (
      <></>
    );
}

function displayCard(card, theme = "light") {
  // theme: "light" or "dark"
  const cardTheme = theme === "dark" ? "my-card-dark" : "my-card-light";
  return (
    <div className={`my-card ${cardTheme}`} key={card.CID}>
      <img src={`${SERVER_URL}/images/${card.picture}`} className="my-card-img" alt={card.name} />
      <div className="my-card-title">{card.name}</div>
      <div className="my-card-index">
        <svg width="80" height="40" viewBox="0 0 80 40">
          <path
            d="M10,35 A30,30 0 0,1 70,35"
            fill="none"
            stroke={theme === "dark" ? "#fff" : "#1976d2"}
            strokeWidth="6"
          />
          <path
            d="M10,35 A30,30 0 0,1 70,35"
            fill="none"
            stroke={theme === "dark" ? "#7a00cc" : "#222"}
            strokeWidth="6"
            strokeDasharray={`${(card.value / 100) * 94},94`}
          />
        </svg>
        <div className="my-card-value">{card.value !== -1 ? card.value : "???"}</div>
        <div className="my-card-label">MISFORTUNE INDEX</div>
      </div>
    </div>
  );
}

function displayCoveredCard(theme = "light") {
  const cardTheme = theme === "dark" ? "my-card-dark" : "my-card-light";
  return (
    <div className={`my-card ${cardTheme}`} key={'covered'}>
      <img
        src='/src/assets/life_in_ancient_greece.png'
        className="my-card-img"
        alt="covered card"
        style={{ width: "100%", height: "180px", objectFit: "contain" }}
      />
    </div>
  );
}

async function sendChoiceToServer(prevState, formData) {
  const selectedIdx = parseInt(formData.get('selectedIdx'), 10);
  const matchId = parseInt(formData.get('matchId'), 10);
  const loggedIn = formData.get('loggedIn') === 'true'; // Convert to boolean

  let lower = -1;
  let upper = -1;


  if(selectedIdx !== null && selectedIdx !== undefined && selectedIdx !== -1) {
    const deckCardsJson = formData.get('deckCards');
    const deckCards = JSON.parse(deckCardsJson);

    lower = 0;
    upper = 100;

    if(selectedIdx == 0){
      upper = deckCards[0].value;
    }
    else if(selectedIdx == deckCards.length){
      lower = deckCards[deckCards.length - 1].value;
    }
    else {
      lower = deckCards[selectedIdx - 1].value;
      upper = deckCards[selectedIdx].value;
    }
    
  }

  let result = {};

  if (loggedIn) {
    result = await API.sendRoundChoice(matchId, lower, upper);
  }
  else {
    const allCardsJson = formData.get('allCards');
    const allCards = JSON.parse(allCardsJson);
    result = await API.sendRoundChoiceGuest(lower, upper, allCards[3].cid);
  }

  return {success: true, round: result.Round, match: result.Match, cards: result.Cards}; // Return success state
}

function SendSelectedForm({ selectedIdx, setSelectedIdx, deckCards, timeLeft, setIsPlaying, matchId, setPreviousRound, setMatch, setShowWinModal, setWonCards, loggedIn, allCards }) {
  // Funzione che invia selectedIdx al server
  const [timeExpired, setTimeExpired] = useState(false);
  const [state, submit, isPending] = useActionState(
    async (prevState, formData) => sendChoiceToServer(prevState, formData),
    {success: false}
  );
  const formRef = useRef();

  useEffect(() => {
    if (state.success) {
      setIsPlaying(false); // Reset isPlaying state when the form is successfully submitted
    }
  }, [state.success, setIsPlaying]);

  useEffect(() => {
    if(timeLeft === 0) {      // when the time expires we handle the case
      setSelectedIdx(-1);     // set selectedIdx to -1, so the round is now lost
      setTimeExpired(true);   // set timeExpired to true, so the form will be submitted
    }
  }, [timeLeft, setSelectedIdx]);

  useEffect(() => {
    if(timeExpired && formRef.current) {
      formRef.current.requestSubmit();  // Submit the form when time expires
      setTimeExpired(false);            // Reset timeExpired to false to avoid multiple submissions
    }
  }, [timeExpired]);

  useEffect(() => {
    if (state.success) {
      setIsPlaying(false);
      // Update previousRound
      if (state.round && state.round === 'won') {
        setPreviousRound(1);
      } else {
        setPreviousRound(0);
      }
      // Update the match
      if(state.match == "won") {
        setPreviousRound(null);
        setWonCards(state.cards.filter(card => card && card.won === 1));
        setShowWinModal("won");
      }
      else if(state.match == "lost") {
        setPreviousRound(null);
        setWonCards(state.cards.filter(card => card && card.won === 1));
        setShowWinModal("lost");
      }
      else {
        (async () => {
          let m;
          if (loggedIn) {
            m = await API.getCurrentMatch();
          } else {
            m = await API.getMatchGuest();
          }
          setMatch(m);
        })();
      }
    }
  }, [state.success, state.round, state.match, state.cards, setIsPlaying, setPreviousRound, setMatch]);

  return (
    <form action={submit} ref={formRef}>
      <input type="hidden" name="selectedIdx" value={selectedIdx} />
      <input type="hidden" name="matchId" value={matchId} />
      <input type="hidden" name="loggedIn" value={loggedIn} />
      <input type="hidden" name="deckCards" value={JSON.stringify(deckCards)} />
      <input type="hidden" name="allCards" value={JSON.stringify(allCards)} />
      <button type="submit" className="btn btn-primary" disabled={isPending || selectedIdx === -1}>
        Confirm
      </button>
    </form>
  );
}

function WinModal({ showWinModal, wonCards, setMatch, setShowWinModal, loggedIn, theme = "light" }) {
  if (!showWinModal) return null;

  const navigate = useNavigate();

  const handleClose = () => {
    setShowWinModal(false);
    (async () => {
      let m;
      if (loggedIn) {
        m = await API.getCurrentMatch();
      } else {
        m = await API.getMatchGuest();
      }
      setMatch(m);
    })();
  };

  const handleGoHome = () => {
    setShowWinModal(false);
    setTimeout(() => navigate('/'), 0);
  };

  if (loggedIn) {
    return (
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className={"modal-title" + (showWinModal === "won" ? " text-success" : " text-danger")}>
                {showWinModal === "won" ? "You won the game!" : "You lost the game!"}
              </h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <h6>Your cards:</h6>
              <div className="row">
                {wonCards.map((card, idx) => (
                  <div className="col-4 mb-3" key={idx}>
                    {displayCard(card, theme)}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleGoHome}>
                Go Home
              </button>
              <button type="button" className="btn btn-primary" onClick={handleClose}>
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  else{
    return <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className={"modal-title" + (showWinModal === "won" ? " text-success" : " text-danger")}>
                {showWinModal === "won" ? "You won the game!" : "You lost the game!"}
              </h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <h6>The gameplay demo ends here!</h6>
              <p>To continue playing, please log in to your account, otherwise you can still play this demo</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleGoHome}>
                Go Home
              </button>
              <button type="button" className="btn btn-primary" onClick={handleClose}>
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>
  }
}

export default MatchPage;