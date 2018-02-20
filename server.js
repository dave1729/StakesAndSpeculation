var currentQuestionIndex = -1;
//enum: players,answers,bets

function waitForGamesAndRiddles() {
    if(riddles == null || games == null) {
        console.log("Waiting (riddles == null|games == null): " + "(" + (riddles == null) + "|" + (games == null) + ")");
        setTimeout(waitForGamesAndRiddles, 100);
    }
    else {
        UseThisScreenAsGameBoard();
    }
}

function UseThisScreenAsGameBoard() {
    shuffle(riddles);
    var selectedRiddles = selectRandomElements(riddles, DefaultRiddlesPerGame);

    currentGame = new Game(selectedRiddles);
    games.push(currentGame);
    SaveGames();
    document.getElementById("primary-display-text-label").innerHTML = "Game ID: " + currentGame.id;

    setTimeout(PollForGameResultsAsServer, 3000);
}

function HandleEndOfTurn() {
    console.log("Handling End of Turn.");
    if(currentGame.waitingOn == "players") {
        console.log("Assigning Colors");
        AssignColorsToPlayers();
        document.getElementById('next-turn-button').innerHTML = "Turn Is Complete";
        currentGame.waitingOn = "answers";
        currentGame.questionIndex++;
        DisplayNextQuestion();
    }
    else if(currentGame.waitingOn == "answers") {
        DisplayPlayersWithAnswers();
        setTimeout(DisplayAnswersForVoting, 2000);
        currentGame.waitingOn = "bets";
    }
    else if(currentGame.waitingOn == "bets") {
        console.log("End Of Turn After Bets Is Not Complete!");
        DisplayAnswersForVoting();
        setTimeout(CalculateResults, 2000);
        currentGame.waitingOn = "answers";
        currentGame.questionIndex++;
    }

    console.log("Saving Current Game");
    SaveCurrentGame();
    SaveGames();
}

function CalculateResults() {
    var correctColor = null;
    var winningMultiplier = 3;
    var correctAnswer = currentGame.riddles[currentGame.questionIndex];

    currentGame.players.sort(
        function(player1, player2){
            return player1.answers[currentGame.questionIndex] - player2.answers[currentGame.questionIndex];
        }
    );

    for(var i = currentGame.players.length - 1; i >= 0; i--) {
        var thisAnswer = currentGame.players[i].answers[currentGame.questionIndex];
        if(thisAnswer < correctAnswer) {
            correctColor = currentGame.players[i].color;
        }
    }

    for( var i = 0; i < currentGame.players.length; i++) {
        for (var j = 0; j < currentGame.players[i].bets.length; j++) {
            if(currentGame.players[i].bets[j].color == correctColor) {
                currentGame.winnings[currentGame.players[i].color] = parseInt(currentGame.players[i].bets[j].amount) * winningMultiplier;
            }
        }
    }
}

function DisplayNextQuestion() {
    var currentRiddle = currentGame.riddles[currentGame.questionIndex];
    document.getElementById("secondary-display-text-label").innerHTML = "Question: " + currentRiddle.question + "(source: " + currentRiddle.sourceName + " as of " + currentRiddle.sourceYear + ")";
}

function DisplayAnswersForVoting() {
    var displayText = '<code contenteditable="true">Answers: ';
    var players = currentGame.players;

    players.sort(
        function(player1, player2){
            return player1.answers[currentGame.questionIndex] - player2.answers[currentGame.questionIndex];
        }
    );

    for(var i = 0; i < players.length; i++) {
        var player = players[i];
        var answer = player.answers[currentGame.questionIndex];
        displayText += '<span style="color: ' + player.color + '">' + answer + "   " + '</span>';
    }

    for(var i = 0; i < players.length; i++) {
        var thisPlayer = players[i];
        displayText += '<br>';
        displayText += '<span style="color: ' + thisPlayer.color + '">' + thisPlayer.color + "'s bets: </span>";
        for(var j = 0; j < players.length; j++) {
            var thatPlayer = players[j];
            var theBet = betFromPlayerOnThisTurn(thisPlayer, thatPlayer, currentGame.questionIndex);
            if(theBet != null) {
                displayText += '<span style="color: ' + thatPlayer.color + '">' + theBet.amount + "   " + '</span>';
            } else {
                displayText += '<span style="color: dark grey">' + "0   " + '</span>';
            }
            var answer = player.answers[currentGame.questionIndex];

        }
    }
    displayText += '</code>';

    if(document.getElementById('primary-display-text-label').innerHTML != displayText) {
        document.getElementById('primary-display-text-label').innerHTML = displayText;
    }
}

function betFromPlayerOnThisTurn(thisPlayer, thatPlayer, questionIndex) {
    var betsOnThisTurn = thisPlayer.bets[questionIndex];
    if(betsOnThisTurn == null) {
        return null;
    }

    for(var i = 0; i < betsOnThisTurn.length; i++) {
        var bet = betsOnThisTurn[i];
        if(bet.playerColor == thatPlayer.color) {
            return bet;
        }
    }

    return null;
}

function AssignColorsToPlayers() {
    var colors = [ "blue", "red", "fuchsia", "lime", "aqua" ]
    shuffle(colors);
    for(var i = 0; i < currentGame.players.length; i++) {
        currentGame.players[i].color = colors[i];
    }
}

function PollForGameResultsAsServer() {
    GetGamesAsServer();
    setTimeout(PollForGameResultsAsServer, 2000);
}

function GetGamesAsServer() {
    console.log("Saving question index");
    currentQuestionIndex = currentGame.questionIndex;

    GetJson("Games", UpdateServerWithNewGames);
}

function UpdateServerWithNewGames() {
    GetCurrentGame();

    console.log("Restoring question index");
    currentGame.questionIndex = currentQuestionIndex;

    var isEndOfTurn = IsEndOfTurn();
    if(isEndOfTurn) {
        HandleEndOfTurn();
    }
    else {
        UpdateBoard();
        SaveCurrentGame();
    }
}

function UpdateBoard() {
    if(currentGame.waitingOn == "players") {
        DisplayPendingPlayerNames();
    }
    else if(currentGame.waitingOn == "answers") {
        DisplayPlayersWithAnswers();
    }
    else if(currentGame.waitingOn == "bets") {
        DisplayAnswersForVoting();
    }
}

function DisplayPendingPlayerNames() {
    var displayText = "Game ID: " + currentGame.id + "        Players: ";
    for(var i = 0; i < currentGame.players.length; i++) {
        displayText += currentGame.players[i].name + "   ";
    }

    if(document.getElementById('primary-display-text-label').innerHTML != displayText) {
        document.getElementById('primary-display-text-label').innerHTML = displayText;
    }
}

function DisplayPlayersWithAnswers() {
    var displayText = '<code contenteditable="true">Players: ';
    for(var i = 0; i < currentGame.players.length; i++) {
        var player = currentGame.players[i];
        var answerStatus = "-thinking";
        var color = "grey";

        if(player.answers[currentGame.questionIndex] != null && player.answers[currentGame.questionIndex] != " ") {
            answerStatus = "-ready";
            color = player.color;
        }

        displayText += '<span style="color: ' + color + '">' + player.name + answerStatus + "   " + '</span>';
    }
    displayText += '</code>';

    if(document.getElementById('primary-display-text-label').innerHTML != displayText) {
        document.getElementById('primary-display-text-label').innerHTML = displayText;
    }
}

function IsEndOfTurn() {
    if(currentGame.waitingOn == "players") {
        return false;
    }
    else if(currentGame.waitingOn == "answers") {
        for(var i = 0; i < currentGame.players.length; i++) {
            var currentPlayer = currentGame.players[i];
            var currentPlayerAnswer = currentPlayer.answers[currentGame.questionIndex];
            if((currentPlayerAnswer == null) ||
               (currentPlayerAnswer == " ")||
               (currentPlayerAnswer == 0)) {

                console.log("Turn not over, player " + currentPlayer.name + " answer is '" +
                currentPlayerAnswer + "'");
                return false;
            }
        }

        return true;
    }
    else if(currentGame.waitingOn == "bets") {
        for(var i = 0; i < currentGame.players.length; i++) {
            var currentPlayer = currentGame.players[i];
            var currentPlayerBets = currentPlayer.bets[currentGame.questionIndex];
            if((currentPlayerBets == null) ||
               !(currentPlayerBets.length >= 1)) {
                return false;
            }
        }
        return true;
    }
    else {
        alert("waitingOn something other than players, answers, or bets...");
    }
}