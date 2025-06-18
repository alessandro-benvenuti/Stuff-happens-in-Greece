import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Button, Container, Navbar } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LogoutButton } from './authComponents.jsx';

const Navhead = (props) => {
    const[darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-bs-theme", "light"); 
        }
    }, [darkMode]);

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">

                    <Link to="/" className="navbar-brand" href="#">
                        <img src="/src/assets/life_in_ancient_greece.png" alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
                        Stuff Happens in Greece
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/rules" className="nav-link" href="#">
                                    Rules
                                </Link>
                            </li>
                            {/*
                            <li className="nav-item">
                                <Link to="/" className="nav-link disabled" href="#">
                                    Leaderboards
                                </Link>
                            </li>
                            */}
                            {props.loggedIn &&
                                <li className="nav-item">
                                    <Link to="/profile" className="nav-link" href="#">
                                        Your profile
                                    </Link>
                                </li>
                            }
                            <li className="nav-item">
                                <Link to="/" className="nav-link disabled" href="#">
                                    News
                                </Link>
                            </li>
                            <li>
                                <Button onClick={() => setDarkMode(oldMode => !oldMode)}>
                                    { darkMode ? 
                                        <i className="bi bi-brightness-high-fill" /> : 
                                        <i className="bi bi-moon-stars-fill" />
                                    }
                                </Button>
                            </li>
                        </ul>
                    </div>

                    {props.loggedIn ? 
                        <>
                            <span className="navbar-text me-2">
                                Hi {props.user.username}!
                            </span>
                            <LogoutButton logout={props.handleLogout} darkMode={darkMode} /> 
                        </>
                    :
                        <Link to='/login' className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}>
                            Login
                        </Link>
                    }


                </div>
            </nav>
        </>
    );
};

export default Navhead;