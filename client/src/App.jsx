import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navhead from './components/navhead'
import Homepage from './components/Homepage'
import Cardpage from './components/cardpage'
import MatchPage from './components/matchPage';
import { LoginForm } from './components/authComponents'
import { useEffect } from 'react';
import API from "./API/API.mjs";
import { use } from 'react';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  const [cards, setCards] = useState([]);
  const [match, setMatch] = useState(null);

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

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const match = await API.getCurrentMatch();
        setMatch(match);
      } catch (error) {
        console.error('Error fetching current match:', error);
      }
    };
    fetchMatch();
  }, []);

  // login
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  // User state. Is he logged in?
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        setLoggedIn(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // logout
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
  };


  return (
    <>
      <Navhead loggedIn={loggedIn} handleLogout={handleLogout} user={user} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/cards" element={<Cardpage cards={cards} />} />
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginForm handleLogin={handleLogin} />} />
        <Route path="/match/current" element={loggedIn ? <MatchPage cards={cards} /> : <Navigate replace to='/' />} />
      </Routes>
      
    </>
  )
}

export default App
