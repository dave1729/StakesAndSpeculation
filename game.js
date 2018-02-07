function Game(selectedRiddles) {
    this.id = Math.random().toString(36).replace(/[^a-z]+/g, '').toUpperCase().substr(0, 5);
    this.players = [];
    this.date = Date.now();
    this.questionIndex = -1;
    this.riddles = selectedRiddles;
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