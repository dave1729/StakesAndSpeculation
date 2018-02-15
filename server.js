var currentQuestionIndex = -1;
//enum: players,answers,bets

function UseThisScreenAsGameBoard() {
    HideUnusedButtons();
    document.getElementById("body-span").innerHTML = '<br><button type="button" id="next-turn-button" onclick="HandleEndOfTurn()" >All Players Are In!</button>' +
        '<image id="game-board-image" src="game-board.png" alt="Game board with several horizontal segments." width="500" height="350"></image>';

    shuffle(riddles);
    var selectedRiddles = selectRandomElements(riddles, DefaultRiddlesPerGame);

    currentGame = new Game(selectedRiddles);
    games.push(currentGame);
    SaveGames();
    document.getElementById("primary-display-text-label").innerHTML = "Game ID: " + currentGame.id;

    setTimeout(PollForGameResultsAsServer, 3000);
}

function HideUnusedButtons() {
    document.getElementById('start-new-game-button').style.visibility = 'hidden';
    document.getElementById('join-game-button').style.visibility = 'hidden';
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
        ////currentGame.waitingOn = "answers";
        ////currentGame.questionIndex++;
    }

    console.log("Saving Current Game");
    SaveCurrentGame();
    SaveGames();
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
    displayText += '</code>';

    if(document.getElementById('primary-display-text-label').innerHTML != displayText) {
        document.getElementById('primary-display-text-label').innerHTML = displayText;
    }
}

function AssignColorsToPlayers() {
    var colors = [ "blue", "red", "fuchsia", "lime", "aqua" ]
    shuffle(colors);
    for(var i = 0; i < currentGame.players.length; i++) {
        currentGame.players[i].color = colors[i];
    }
}

function PollForGameResultsAsServer() {
    document.getElementById("display-test-text-label").innerHTML = JSON.stringify(currentGame);
    GetGamesAsServer();
    setTimeout(PollForGameResultsAsServer, 2000);
}

function GetGamesAsServer() {
    console.log("Saving question index");
    currentQuestionIndex = currentGame.questionIndex;

    GetJson("yymk1", "Games", UpdateServerWithNewGames);
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
        var allPlayersHaveAnswered = true;
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

    }
    else {
        alert("waitingOn something other than players, answers, or bets...");
    }
}