import {Card, User, Match, Round} from '../models/AGmodels.mjs';

export const SERVER_URL = 'http://localhost:3001';

// Function to get all cards from the server
export const getAllCards = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/api/cards`);
        if (!response.ok) {
            throw new Error('Internal server error');
        }
        const data = await response.json();
        return data.map(card => new Card(card.CID, card.Name, card.Picture, card.Value));
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
};

// Function to get the current or most recent match
export const getCurrentMatch = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/api/matches/current`, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Internal server error');
        }
        const data = await response.json();
        return new Match(data.MID, data.UID, data.Timestamp, data.cards, data.win);
    } catch (error) {
        console.error('Error fetching current match:', error);
        throw error;
    }
};

export const drawCard = async (matchId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/matches/${matchId}`, {
      method: 'PUT',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Internal server error');
    }
    const data = await response.json();
    return new Match(data.MID, data.UID, data.Timestamp, data.cards, data.win);
  } catch (error) {
    console.error('Error drawing card:', error);
    throw error;
  }
}

export const sendRoundChoice = async (matchId, lower, upper) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/matches/${matchId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ lower, upper })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }
    const round = await response.json();
    return new Round(round.message, round.cards, round.card, round.round, round.match);
  } catch (error) {
    console.error('Error sending round choice:', error);
    throw error;
  }
};

export const getMatchGuest = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/matches/guest`, {});
    if (!response.ok) {
      throw new Error('Internal server error');
    }
    const data = await response.json();
    return new Match(data.MID, data.UID, data.Timestamp, data.cards, data.win);
  } catch (error) {
    console.error('Error fetching guest match:', error);
    throw error;
  }
};

export const drawCardGuest = async (c1, c2, c3) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/matches/guest/draw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ c1, c2, c3 })
    });
    if (!response.ok) {
      throw new Error('Internal server error');
    }
    const data = await response.json();
    return new Match(data.MID, data.UID, data.Timestamp, data.cards, data.win);
  } catch (error) {
    console.error('Error drawing card for guest:', error);
    throw error;
  }
};

export const sendRoundChoiceGuest = async (lower, upper, cid) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/matches/guest/round`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lower, upper, cid })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }
    const round = await response.json();
    return new Round(round.message,[], round.card, round.round, round.match);
  } catch (error) {
    console.error('Error sending round choice for guest:', error);
    throw error;
  }
};

// function to get the past maches of the user
export const getPastMatches = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/profile`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Internal server error');
    }
    const data = await response.json();
    return data.map(match => new Match(match.MID, match.UID, match.Timestamp, match.cards, match.win));
  } catch (error) {
    console.error('Error fetching past matches:', error);
    throw error;
  }
};

// login
const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw new Error('Not authenticated');
  }
};

// logout
const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}



const API = { 
    getAllCards,
    logIn,
    getUserInfo,
    logOut,
    getCurrentMatch,
    drawCard,
    sendRoundChoice,
    getMatchGuest,
    drawCardGuest,
    sendRoundChoiceGuest,
    getPastMatches
};
export default API;