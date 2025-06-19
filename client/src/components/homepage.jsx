import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './style/homepage.css';

const Homepage = (props) => {
  const { darkMode } = props;


  const bgImage = darkMode ? "/src/assets/night.jpeg" : "/src/assets/day.jpeg";

  return (
    <div
      className="homepage-bg"
      style={{
        backgroundImage: `url(${bgImage})`
      }}
    >
      <div className={darkMode ? "homepage-overlay-dark" : "homepage-overlay-light"} />
      <div className={`homepage-content${darkMode ? " dark" : ""}`}>
        <h1 className={`homepage-title${darkMode ? " dark" : ""}`}>
          Step Into the Chaos:<br />Can You Master Misfortune?
        </h1>
        <p className={`homepage-desc${darkMode ? " dark" : ""}`}>
          Face hilarious disasters and build your ultimate deck of calamities.
        </p>
        <Link to="/match/current">
          <Button
            variant="danger"
            size="lg"
            className="homepage-btn"
          >
            PLAY NOW
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;