import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navhead from './components/navhead'
import Homepage from './components/Homepage'
import RulePage from './components/rulePage'
import Cardpage from './components/cardpage'
import MatchPage from './components/matchPage';
import NotFoundPage from './components/NotFoundPage';
import { LoginForm } from './components/authComponents'
import { useEffect } from 'react';
import API from "./API/API.mjs";
import { use } from 'react';
import Profilepage from './components/profilePage';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();


  // login
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
      throw err;    // rethrow the error so that the authComponents can handle it
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
    navigate('/');
  };


  return (
    <>
      <Navhead loggedIn={loggedIn} handleLogout={handleLogout} user={user} darkMode={darkMode} setDarkMode={setDarkMode}/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/rules" element={<RulePage darkMode={darkMode} />} />
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginForm handleLogin={handleLogin} />} />
        <Route path="/match/current" element={<MatchPage loggedIn={loggedIn} darkMode={darkMode}/>} />
        <Route path="/profile" element={loggedIn ? <Profilepage user={user} /> : <Navigate replace to='/login' />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
    </>
  )
}

export default App
