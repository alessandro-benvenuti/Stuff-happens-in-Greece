import { Button, Container, Navbar } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Cardpage = (props) => {
  const { cards } = props;

  return (
    <div>
      {
        cards?
            <div>
                <h1>Cards</h1>
                <div className="card-container">
                    {cards.map((card) => (
                        displayCard(card)
                    ))}
                </div>
            </div>
        :
            <div>
                <h1>No cards available</h1>
            </div>
      }
    </div>
  )
}

function displayCard(card) {
    return (
        <div className="card" style={{ width: '18rem' }} key={card.CID}>
            <img src={card.Picture} className="card-img-top" />
            <div className="card-body">
                <h5 className="card-title">{card.Name}</h5>
                <p className="card-text">Value: {card.Value}</p>
            </div>
        </div>
    );
}

export default Cardpage
