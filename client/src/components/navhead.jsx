import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Button, Container, Navbar } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LogoutButton } from './authComponents.jsx';
import '../App.css';

const Navhead = (props) => {

    useEffect(() => {
        if (props.darkMode) {
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-bs-theme", "light"); 
        }
    }, [props.darkMode]);

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
                                <NavLink to="/rules" className="nav-link" href="#">
                                    Rules
                                </NavLink>
                            </li>
                            {props.loggedIn &&
                                <li className="nav-item">
                                    <NavLink to="/profile" className="nav-link" href="#">
                                        Your profile
                                    </NavLink>
                                </li>
                            }
                            <li>
                                <button
                                    className="icon-btn"
                                    onClick={() => props.setDarkMode(oldMode => !oldMode)}
                                    aria-label="Toggle theme"
                                >
                                    {props.darkMode
                                        ? <i className="bi bi-brightness-high-fill" />
                                        : <i className="bi bi-moon-stars-fill" />
                                    }
                                </button>
                            </li>
                        </ul>
                    </div>

                    {props.loggedIn ? 
                        <>
                            <span className="navbar-text me-2">
                                Hi {props.user.username}!
                            </span>
                            <LogoutButton logout={props.handleLogout} darkMode={props.darkMode} /> 
                        </>
                    :
                        <Link to='/login' className={`btn ${props.darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}>
                            Login
                        </Link>
                    }


                </div>
            </nav>
        </>
    );
};

export default Navhead;