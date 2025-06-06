import dayjs from "dayjs";

function Card(CID, Name, Picture, Value){
    this.CID = CID;
    this.Name = Name;
    this.Picture = Picture;
    this.Value = Value;

    this.toString = function() {
        return `Card ID: ${this.CID}, Name: ${this.Name}, Picture: ${this.Picture}, Value: ${this.Value}`;
    };
}

function User(UID, Username) {
    this.UID = UID;
    this.Name = Name;

    this.toString = function() {
        return `User ID: ${this.UID}, Name: ${this.Name}`;
    };
}

function Match(MID, UID, Timestamp, cards) {
    this.MID = MID;
    this.UID = UID;
    this.Timestamp = Timestamp;
    this.cards = cards;

    this.toString = function() {
        return `Match ID: ${this.MID}, User ID: ${this.UID}, Timestamp: ${this.Timestamp}`;
    };
}

function Round(Message, Cards, Card, Round, Match) {
    this.Message = Message;
    this.Cards = Cards;
    this.Card = Card;
    this.Round = Round;
    this.Match = Match;

    this.toString = function() {
        return `Round: ${this.Roun}, Message: ${this.Message}, Card: ${this.Card.toString()}, Match: ${this.Match.toString()}`;
    };
}


export { Card, User, Match, Round };

