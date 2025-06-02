import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navhead from './components/navhead'
import Homepage from './components/Homepage'
import Cardpage from './components/cardpage'
import { useEffect } from 'react';
import API from "./API/API.mjs";


function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const allCards = await API.getAllCards();
        setCards(allCards);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);


  return (
    <>
      <Navhead />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/cards" element={<Cardpage cards={cards} />} />
      </Routes>
      
    </>
  )
}

export default App
