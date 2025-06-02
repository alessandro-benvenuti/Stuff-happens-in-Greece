import { Button, Container, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router';

const Homepage = () => {
  return (
    <div>
      <h1>Benvenuto nel Gioco della Sfortuna</h1>
      <p>In questo gioco, dovrai affrontare una serie di sfide. Sei pronto?</p>
      <Link to="/match/current" variant="primary">Play</Link>
    </div>
  )
}

export default Homepage
