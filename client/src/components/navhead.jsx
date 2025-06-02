import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Button, Container, Navbar } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navhead = (props) => {
    const[darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-bs-theme", "light"); // <-- Cambia qui!
        }
    }, [darkMode]);

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">

                    <Link to="/" className="navbar-brand" href="#">
                        <img src="/src/assets/life_in_ancient_greece.png" alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
                        Life in ancient Greece
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="#">Rules</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Leaderboards</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">News</a>
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


                </div>
            </nav>
        </>
    );
};

export default Navhead;