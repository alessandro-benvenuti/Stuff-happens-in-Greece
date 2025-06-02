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
                resolve({ matchId: matchId });
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
                        resolve({ message: "Card drawn successfully", changes: this.changes });
                    }
                });

            }
        });
        
    });
}

export const getCurrentMatchByUserId = (uid) => {
  return new Promise((resolve, reject) => {
    // Retrieve the most recent match for the user
    const sql = 'SELECT * FROM MATCH WHERE UID = ? ORDER BY Timestamp DESC LIMIT 1';
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