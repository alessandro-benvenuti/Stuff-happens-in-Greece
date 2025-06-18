import React, { useEffect, useState } from 'react';
import API from '../API/API.mjs';

const Profilepage = (props) => {
    const { user } = props;
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await API.getPastMatches();
                setHistory(response);
            } catch (error) {
                console.error("Error fetching match history:", error);
            }
        };
        fetchHistory();
    }, []);

    const displayMatch = (match, index) => {
        const date = new Date(match.Timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return (
            <div key={index} className="card m-3">
                <div className={"card-header" + (match.win === 1 ? " text-success" : " text-danger")}>
                    <h4>
                        {match.win === 1 ? "Victory" : "Defeat"}
                    </h4>
                    <h6>{formattedDate}, {formattedTime}</h6>
                    <div>
                        <ul className="list-group">
                            {match.cards && match.cards.length > 0 ? (
                                match.cards.map((card, idx) => {
                                    let round = null;
                                    let result = null;
                                    if (idx < 3) {
                                        round = "";
                                        result = null;
                                    } else {
                                        round = `Round ${idx - 2}`;
                                        result = card.won==1 ? "Won" : card.won==0 ? "Lost" : null;
                                    }
                                    if(result === null && idx >= 3) {
                                        // If result is null, skip rendering this card
                                        return null;
                                    }
                                    return (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className='me-2'>
                                                {round && <span className="ms-2 badge bg-secondary">{round}</span>}
                                            </span>
                                            <span className='me-2'>
                                                <strong> {card.name}</strong>
                                            </span>
                                            {result ? (
                                                <span className={`badge ${result === "Won" ? "bg-success" : "bg-danger"}`}>
                                                    {result}
                                                </span>
                                            ) : (
                                                <span className="badge bg-primary">
                                                    Initial
                                                </span>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="list-group-item">No cards available.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-4 pt-3">
                    <h3>Your stats: </h3>
                </div>
                <div className="col-8 pt-3">
                    <h3>Your past games: </h3>
                    {history.length > 0 ? (
                        <div className="container pt-3">
                            {history.map(displayMatch)}
                        </div>
                    ) : (
                        <p>No match history available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profilepage;