function Game(selectedRiddles) {
    this.id = getQueryString("gameId");
    if(!this.id)
    {
        this.id = prompt("Could Not Get Game Id Automatically. Enter desired Game ID:");
    }
    this.date = Date.now();
    this.questionIndex = -1;
    this.waitingOn = "players";
    this.players = [];
    this.winnings = new Object();
    this.riddles = selectedRiddles;
    this.winner = null;
}

Game.prototype.addAnswer = function(currentPlayer, answer) {
    for(var i = 0; i < this.participants.length; i++) {
        var currentParticipant = this.participants[i];
        if(currentParticipant.name === currentPlayer.name) {
            currentPlayer.answers[this.questionIndex] = answer;
            this.participants[i] = currentPlayer
        }
    }
}