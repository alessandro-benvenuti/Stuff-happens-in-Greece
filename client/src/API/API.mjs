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

const API = { 
    getAllCards,
};
export default API;