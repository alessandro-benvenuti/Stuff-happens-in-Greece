import {Card, User, Match} from '../models/AGmodels.mjs';

const SERVER_URL = 'http://localhost:3001';

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
        return new Match(data.MID, data.UID, data.Timestamp, data.C1, data.C2, data.C3, data.C4, data.C5, data.C6, data.C7, data.C8, data.W4, data.W5, data.W6, data.W7, data.W8);
    } catch (error) {
        console.error('Error fetching current match:', error);
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
    throw user;
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
    getCurrentMatch
};
export default API;