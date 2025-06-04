import React, { useRef, useEffect, useState } from 'react';
import API from '../API/API.mjs';
import { SERVER_URL } from '../API/API.mjs';
import { Button } from 'react-bootstrap';
import { useActionState } from 'react';

const MatchPage = (props) => {
  const [match, setMatch] = useState(null);

  // we need to keep track of the playing state
  const [isPlaying, setIsPlaying] = useState(false);

  // we need to keep track of the timer
  const [timeLeft, setTimeLeft] = useState(30);

  // we need to keep track of the selected card index
  const [selectedIdx, setSelectedIdx] = useState(-1);

  useEffect(() => {     // the component is mounted with the page
    const fetchMatch = async () => {
      try {
        const m = await API.getCurrentMatch();
        setMatch(m);
      } catch (error) {
        setMatch(null);
      }
    };
    fetchMatch();
  }, []);

  // Function to draw a new card
  const handleDrawCard = async () => {
    try {
      const updatedMatch = await API.drawCard(match.MID);
      setMatch(updatedMatch);
      setIsPlaying(true);
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
    <div>
      <h1>{match ? `Match ID: ${match.MID}` : 'No current match'}</h1>
      <h2>{match ? `User ID: ${match.UID}` : ''}</h2>
      <h3>{match ? `Timestamp: ${new Date(match.Timestamp).toLocaleString()}` : ''}</h3>
      {match && <DisplayMatch 
        match={match}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        handleDrawCard={handleDrawCard} 
        selectedIdx={selectedIdx}
        setSelectedIdx={setSelectedIdx}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
      />}
    </div>
  );
};

function DisplayMatch({ match, isPlaying, setIsPlaying, handleDrawCard, selectedIdx, setSelectedIdx, timeLeft, setTimeLeft }) {
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
        <div className="col-2">
          {isPlaying ? displayCard(last_card) : displayCoveredCard()}
        </div>
        <div className="col-4 border p-3">
          <h4>Current state of the match</h4>
          {displayPastRounds(match.cards)}
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
              <div className="progress mt-1 mb-3" role="progressbar" aria-valuenow={timeLeft}>
                  <div className={"progress-bar " +
                    (timeLeft > 10
                      ? "bg-success"
                      : timeLeft > 3
                      ? "bg-warning"
                      : "bg-danger")
                  } style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}></div>
              </div>
              <SendSelectedForm 
                selectedIdx={selectedIdx} 
                deckCards={deckCards} 
                timeLeft={timeLeft} 
                setIsPlaying={setIsPlaying}
                matchId={match.MID}
              />
            </>
          ) : (
            <Button variant="primary" onClick={() => { 
                setIsPlaying(true);
                setSelectedIdx(-1);
                setTimeLeft(30);
                handleDrawCard(); 
            }}>
              Show new card
            </Button>
          )}
        </div>
      </div>

      <div className="container-fluid mt-5 mb-5">
        <h4>Your Deck:</h4>
        {displayDeckCards(deckCards, selectedIdx, setSelectedIdx, isPlaying)}
      </div>


    </div>
  )
}

function displayPastRounds(cards){
  const selectedCards = cards.slice(3, 8); // from index 3 to 7 inclusive
  return (
    <div className="row justify-content-center">
      <h4>Previous rounds:</h4>
      {selectedCards.map((card) => (
        <>
          {
            card.won === 1 ? (
              <div className="col-2">
                <h1>
                  <i class="bi bi-check-square"></i>
                </h1>
              </div>
            ) : card.won === 0 ? (
              <div className="col-2">
                <h1>
                  <i class="bi bi-x-square"></i>
                </h1>
              </div>
            ) : (
              <div className="col-2">
                <h1>
                  <i class="bi bi-square"></i>
                </h1>
              </div>
            )
          }
        </>
      ))}
    </div>
  );
}

function displayDeckCards(deckCards, selectedIdx, setSelectedIdx, isPlaying) {
  return (
    <div className="row align-items-center justify-content-center">
      {/* Prima colonna vuota */}
      <div className="col-1">
        <EmptyColButton idx={0} selectedIdx={selectedIdx} isPlaying={isPlaying} setSelectedIdx={setSelectedIdx} />
      </div>
      {deckCards
        .map((card, idx) => (
          <React.Fragment key={idx + 1}>
            <div className="col-2">
              {displayCard(card)}
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
              <i class="bi bi-check2-circle"></i>
            </h1>
          </button>
        ) : (
          <button className="btn btn-outline btn-sm" onClick={() => setSelectedIdx(idx)}>
            <h1>
              <i class="bi bi-plus-circle-fill"></i>
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

function displayCard(card) {
  return (
    <div className="card p-0" key={card.CID}>
      <img src={`${SERVER_URL}/images/${card.picture}`} className="card-img-top" alt={card.Name} />
      <div className="card-body">
        <h5 className="card-title">{card.name}</h5>
        <p className="card-text">{card.value !== -1 ? `Value: ${card.value}` : 'Value: ???'}</p>
      </div>
    </div>
  )
}

function displayCoveredCard() {
  return (
    <div className="card" key={'covered'}>
      <img src='/src/assets/life_in_ancient_greece.png' className="card-img-top" alt={"covered card"} />
    </div>
  )
}

async function sendChoiceToServer(prevState, formData) {
  const selectedIdx = parseInt(formData.get('selectedIdx'), 10);
  const matchId = parseInt(formData.get('matchId'), 10);

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

    // API call to send the selected indexes
    console.log(`Sending choice: lower=${lower}, upper=${upper}`);
    const result = await API.sendRoundChoice(matchId, lower, upper);
    console.log('Choice sent successfully:', result);
    
  }

  return {success: true}; // Return success state
}

function SendSelectedForm({ selectedIdx, deckCards, timeLeft, setIsPlaying, matchId }) {
  // Funzione che invia selectedIdx al server
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
    if(timeLeft === 0 && formRef.current) {
      formRef.current.requestSubmit();
    }
  }, [timeLeft]);

  return (
    <form action={submit} ref={formRef}>
      <input type="hidden" name="selectedIdx" value={selectedIdx} />
      <input type="hidden" name="matchId" value={matchId} />
      <input type="hidden" name="deckCards" value={JSON.stringify(deckCards)} />
      <button type="submit" className="btn btn-primary" disabled={isPending || selectedIdx === -1}>
        Confirm
      </button>
    </form>
  );
}

export default MatchPage;