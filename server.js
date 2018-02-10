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
    console.log("SAVE GAMES 1");
    SaveGames();
    console.log(currentGame.id);
    document.getElementById("display-text-label").innerHTML = "Game ID: " + currentGame.id;

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
    }
    else if(currentGame.waitingOn == "answers") {
        DisplayPlayersWithAnswers();
        setTimeout(SortAnswersForVoting, 2000);
    }
    else if(currentGame.waitingOn == "bets") {
        console.log("Showing Results of Bets");
        currentGame.waitingOn = "answers";
        currentGame.questionIndex++;
    }

    console.log("Saving Current Game");
    SaveCurrentGame();
    SaveGames();
}

function SortAnswersForVoting() {

    currentGame.waitingOn = "bets";
}

function AssignColorsToPlayers() {
    var colors = [ "blue", "red", "yellow", "fuchsia", "lime", "aqua" ]
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
    console.log("saving index");
    currentQuestionIndex = currentGame.questionIndex;

    GetJson("yymk1", "Games", UpdateServerWithNewGames);
}

function UpdateServerWithNewGames() {
    GetCurrentGame();

    console.log("restoring index");
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
        console.log("Showing Results of Bets");
    }
}

function DisplayPendingPlayerNames() {
    var displayText = "Game ID: " + currentGame.id + "        Players: ";
    for(var i = 0; i < currentGame.players.length; i++) {
        displayText += currentGame.players[i].name + "   ";
    }
    document.getElementById('display-text-label').innerHTML = displayText;
}

function DisplayPlayersWithAnswers() {
    var displayText = '<code contenteditable="true">Answers: ';
    for(var i = 0; i < currentGame.players.length; i++) {
        var player = currentGame.players[i];
        var answerStatus = "-thinking";
        var color = "lightgrey";

        if(player.answers[currentGame.questionIndex] != null && player.answers[currentGame.questionIndex] != " ") {
            answerStatus = "-ready";
            color = player.color;
        }

        displayText += '<span style="color: ' + color + '">' + player.name + answerStatus + "   " + '</span>';
    }
    document.getElementById('display-text-label').innerHTML = displayText + ';</code>';
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