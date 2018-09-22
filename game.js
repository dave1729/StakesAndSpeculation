function Game(options) {
    logDetailed("Making New Game. options.id: " + options.id + " and queryString: " + getQueryString("gameId"));
    this.id = options.id || getQueryString("gameId");
    if(!this.id)
    {
        this.id = prompt("Could Not Get Game Id Automatically. Enter desired Game ID:");
    }
    logDetailed("Decided ID is " + this.id);

    this.date = options.date || Date.now();

    this.questionIndex = options.questionIndex;
    logDetailed("options.questionIndex " + options.questionIndex);
    if(this.questionIndex == null || this.questionIndex == undefined) this.questionIndex = -1;

    this.waitingOn = options.waitingOn || "players";

    var thePlayers = [];

    if(options.players && options.players.length > 0) {
        options.players.forEach(function(p){
            thePlayers.push(new Player(p));
        });
    }

    this.players = thePlayers;

    this.winnings = options.winnings || new Object();

    var riddlesFromOptions = [];
    if(options.riddles && options.riddles.length > 0) {
        options.riddles.forEach(function(r){
            riddlesFromOptions.push(new Riddle(r));
        });
    }
    this.riddles = riddlesFromOptions;

    this.winner = options.winner || null;
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

Game.prototype.anyPlayers = function(func) {
    if(!func) {
        return this.players && this.players.length > 0;
    }

    return this.players.some(func);
}

Game.prototype.getPlayerNamed = function(playerName) {
    for(var i = 0; i < this.players.length; i++) {
        if(this.players[i].name === playerName) {
            return this.players[i];
        }
    }
}

Game.prototype.displayGameId = function(number) {
    return this.id.substring(number);
}