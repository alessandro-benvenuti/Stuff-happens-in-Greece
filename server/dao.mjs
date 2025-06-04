import sqlite from 'sqlite3';
import crypto from 'crypto';

// open the database connection
const db = new sqlite.Database('life_in_ancient_greece.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the database.');
    }
}
);

export const getUserById = (uid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USER WHERE UID = ?';
    db.get(sql, [uid], (err, row) => {
      if (err) reject(err);
      else if (!row) resolve(false);
      else resolve({ id: row.UID, username: row.Username });
    });
  });
};

export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM USER WHERE Username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false); 
            } else {
                console.log("User found:", row);
                // Check password
                const user = {id: row.UID, username: row.Username};
                crypto.scrypt(password, row.Salt, 32, function(err, hashedPassword) {
                if (err) reject(err);
                if(!crypto.timingSafeEqual(Buffer.from(row.Password, 'hex'), hashedPassword))
                    resolve(false);
                else
                    resolve(user);
                });
            }
        });
    });
}

export async function getAllCards() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM CARD', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export const getCardById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM CARD WHERE CID = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({error: "Card not available, check the inserted id."});
            } else {
                resolve(row);
            }
        });
    });
}

export const createMatch = (uid, timestamp, card1, card2, card3) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO MATCH (UID, Timestamp, C1, C2, C3) VALUES (?, ?, ?, ?, ?)';
        const matchId = crypto.randomUUID();
        db.run(sql, [uid, timestamp, card1, card2, card3], function(err) {
            if (err) {
                reject(err);
            } else {
                // retrieve the match just created
                const selectSql = 'SELECT * FROM MATCH WHERE MID = ?';
                db.get(selectSql, [this.lastID], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            }
        });
    });
}

export const getMatchById = (mid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM MATCH WHERE MID = ?';
        db.get(sql, [mid], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({error: "Match not available, check the inserted id."});
            } else {
                resolve(row);
            }
        });
    });
}

export const formatMatch = async (match) => {
    // the match returned to the server should have the following properties:
    /*
    {
        MID,
        UID,
        Timestamp,
        cards:
        [
            {
                C1.name = C1.name,
                C1.picture = C1.picture,
                C1.value = C1.value,
            },  
            ...,
            {
                Cn.name = Cn.name,
                Cn.picture = Cn.picture
                Cn.value = ???
            }   
        ]
    }
    */
    const cardIds = [match.C1, match.C2, match.C3, match.C4, match.C5, match.C6, match.C7, match.C8];

    // Retriueve all the cards from the DB
    const cards = await Promise.all(cardIds.map(cid => getCardById(cid)));

    // Costruisci l'oggetto JSON finale
    const formatted = {
        MID: match.MID,
        UID: match.UID,
        Timestamp: match.Timestamp,
        cards: cards.map(card => ({
            name: card.Name,
            picture: card.Picture,
            value: card.Value,
            won: 0 // Default value for won, will be updated later
        }))
    };

    if (formatted.cards[0]) formatted.cards[0].won = 1;
    if (formatted.cards[1]) formatted.cards[1].won = 1;
    if (formatted.cards[2]) formatted.cards[2].won = 1;
    if (formatted.cards[3]) formatted.cards[3].won = match.W4;
    if (formatted.cards[4]) formatted.cards[4].won = match.W5;
    if (formatted.cards[5]) formatted.cards[5].won = match.W6;
    if (formatted.cards[6]) formatted.cards[6].won = match.W7;
    if (formatted.cards[7]) formatted.cards[7].won = match.W8;

    // The server does not send the value of the last card if the round is incomplete, so we set it to -1
    // This way the user cannot cheat to look it up and the client will not display it
    if (match.W4 == null) {
        formatted.cards[3].value = -1;
    }
    else if (match.W5 == null) {
        formatted.cards[4].value = -1;
    }
    else if (match.W6 == null) {
        formatted.cards[5].value = -1;
    }
    else if (match.W7 == null) {
        formatted.cards[6].value = -1;
    }
    else if (match.W8 == null) {
        formatted.cards[7].value = -1;
    }

    return formatted;
}

export const drawCard = (mid, cardId) => {
    return new Promise((resolve, reject) => {
        const sql1 = "SELECT * FROM MATCH WHERE MID = ?";
        let sql2 = "";
        db.get(sql1, [mid], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({error: "Match not available, check the inserted id."});
            } else {
                if (row.C4 == null){
                    sql2 = "UPDATE MATCH SET C4 = ? WHERE MID = ?";
                }
                else if (row.C5 == null){
                    sql2 = "UPDATE MATCH SET C5 = ? WHERE MID = ?";
                }
                else if (row.C6 == null){
                    sql2 = "UPDATE MATCH SET C6 = ? WHERE MID = ?";
                }
                else if (row.C7 == null){
                    sql2 = "UPDATE MATCH SET C7 = ? WHERE MID = ?";
                }
                else if (row.C8 == null){
                    sql2 = "UPDATE MATCH SET C8 = ? WHERE MID = ?";
                }
                else {
                    resolve({error: "All cards have been drawn."});
                }
                db.run(sql2, [cardId, mid], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        // After updating the match, retrieve the updated row
                        db.get(sql1, [mid], async (err, updatedRow) => {
                            if (err) reject(err);
                            else {
                                const formatted = await formatMatch(updatedRow);
                                resolve(formatted);
                            }
                        });
                    }
                });

            }
        });
        
    });
}

export const getCurrentMatchByUserId = (uid) => {
  return new Promise((resolve, reject) => {
    // Retrieve the current match for the user
    const sql = 'SELECT * FROM MATCH WHERE UID = ? AND Win IS NULL ORDER BY Timestamp DESC LIMIT 1';
    db.get(sql, [uid], (err, row) => {
        if (err) {
        reject(err);
      } else if (!row) {
        resolve(null);
      } else {
        resolve(row);
      }
    });
  });
};

export const removeC4 = (mid) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE MATCH SET C4 = NULL WHERE MID = ?';
    db.run(sql, [mid], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "Card C4 removed successfully", changes: this.changes });
      }
    });
  });
}

export const removeC5 = (mid) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE MATCH SET C5 = NULL WHERE MID = ?';
    db.run(sql, [mid], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "Card C5 removed successfully", changes: this.changes });
      }
    });
  });
}

export const removeC6 = (mid) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE MATCH SET C6 = NULL WHERE MID = ?';
    db.run(sql, [mid], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "Card C6 removed successfully", changes: this.changes });
      }
    });
  });
}

export const removeC7 = (mid) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE MATCH SET C7 = NULL WHERE MID = ?';
    db.run(sql, [mid], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "Card C7 removed successfully", changes: this.changes });
      }
    });
  });
}

export const removeC8 = (mid) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE MATCH SET C8 = NULL WHERE MID = ?';
    db.run(sql, [mid], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "Card C8 removed successfully", changes: this.changes });
      }
    });
  });
}

export const updateRoundWin = (mid, cardIndex, win) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE MATCH SET W${cardIndex} = ? WHERE MID = ?`;
    db.run(sql, [win, mid], async function(err) {
      if (err) {
        reject(err);
      } else {
        try {
          // retrieve the match just updated
          const updatedMatch = await getMatchById(mid);
          const formatted = await formatMatch(updatedMatch);
          resolve(formatted);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
};

export const updateMatchWin = (mid, win) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE MATCH SET Win = ? WHERE MID = ?';
    db.run(sql, [win, mid], async function(err) {
      if (err) {
        reject(err);
      } else {
        try {
          // retrieve the match just updated
          const updatedMatch = await getMatchById(mid);
          const formatted = await formatMatch(updatedMatch);
          resolve(formatted);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
};