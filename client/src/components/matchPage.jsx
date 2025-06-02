import { useEffect, useState } from 'react';
import API from '../API/API.mjs';

const MatchPage = () => {
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const m = await API.getCurrentMatch();
        setMatch(m);
      } catch (error) {
        setMatch(null);
      }
    };
    fetchMatch();
  }, []);

  return (
    <div>
      <h1>{match ? `Match ID: ${match.MID}` : 'No current match'}</h1>
      <h2>{match ? `User ID: ${match.UID}` : ''}</h2>
      <h3>{match ? `Timestamp: ${new Date(match.Timestamp).toLocaleString()}` : ''}</h3>
    </div>
  );
};

export default MatchPage;