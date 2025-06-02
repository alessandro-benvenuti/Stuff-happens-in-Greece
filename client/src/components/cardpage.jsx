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
                    <div key={card.CID} className="card">
                        <img src={card.Picture} alt={card.Name} />
                        <h2>{card.Name}</h2>
                        <p>Value: {card.Value}</p>
                    </div>
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

export default Cardpage
