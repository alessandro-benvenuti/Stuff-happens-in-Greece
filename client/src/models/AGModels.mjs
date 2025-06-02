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

function Match(MID, UID, Timestamp, C1, C2, C3, C4, C5, C6, C7, C8, W4, W5, W6, W7, W8) {
    this.MID = MID;
    this.UID = UID;
    this.Timestamp = Timestamp;
    this.C1 = C1;
    this.C2 = C2;
    this.C3 = C3;
    this.C4 = C4;
    this.C5 = C5;
    this.C6 = C6;
    this.C7 = C7;
    this.C8 = C8;
    this.W4 = W4;
    this.W5 = W5;
    this.W6 = W6;
    this.W7 = W7;
    this.W8 = W8;

    this.toString = function() {
        return `Match ID: ${this.MID}, User ID: ${this.UID}, Timestamp: ${this.Timestamp}`;
    };
}


export { Card, User, Match };

