var currentPlayer = Player(null, null);

function PollForGameResultsAsClient() {
    GetGamesAsClient();
    setTimeout(PollForGameResultsAsClient, 3000);
}

function JoinGame() {
    GetGames("async");
    document.getElementById('start-new-game-button').style.visibility = 'hidden';
    document.getElementById('join-game-button').style.visibility = 'hidden';
    document.getElementById('get-riddles-button').style.visibility = 'hidden';
    document.getElementById('save-riddles-button').style.visibility = 'hidden';
    document.getElementById('display-riddles-button').style.visibility = 'hidden';
    document.getElementById('get-games-button').style.visibility = 'hidden';
    document.getElementById('save-games-button').style.visibility = 'hidden';
    document.getElementById('erase-games-button').style.visibility = 'hidden';
    document.getElementById('display-games-button').style.visibility = 'hidden';
    document.getElementById("body-span").innerHTML = '' +
    '<label id="game-id-input-label">Join Game with ID: </label><input type="text" id="game-id-input" >' +
    '<label id="player-id-input-label"> Using Player Name: </label><input type="text" id="player-id-input" >' +
    '<button type="button" id="submit-input-button" onclick="SendInput()" >Join Game</button>';

    setTimeout(PollForGameResultsAsClient, 5000);
}

function SendInput() {
    var gameId = document.getElementById("game-id-input").value.toUpperCase();
    var playerName = document.getElementById("player-id-input").value;

    //set the right game
    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id === gameId) {
            currentPlayer = new Player(playerName, "blue");
            games[i].players.push(currentPlayer);
            currentGame = games[i];

            SaveGames();
            setTimeout(ShowAnswerButtonWithTimeout, 500);
            return;
        }
    }
    alert("Couldn't find you're game, check the ID and try again.");
    GetGamesAsClient();
}

function ShowAnswerButtonWithTimeout() {
    document.getElementById("body-span").innerHTML = '' +
            '<label id="answer-input-label">Answer: </label><input type="text" id="answer-input" >' +
            '<button type="button" color="' + currentPlayer.color + '" id="answer-input-button" onclick="SendAnswer()" >Submit</button>';
    GetGamesAsClient();
}

function SendAnswer() {
    if(currentPlayer.answers == null) {
        currentPlayer.answers = [];
    }

    if (currentPlayer.answers.length < currentGame.questionIndex + 1) {
        var voidAnswersToInsert = (currentGame.questionIndex + 1) - currentPlayer.answers.length;
        for(var i = 0; i < voidAnswersToInsert; i++) {
            currentPlayer.answers.push(' ');
        }
    }

    var answerValue = document.getElementById("answer-input").value;
    console.log("answerValue: " + answerValue);

    var answerAfterReplace = answerValue.replace(/[^0-9.]+/g, '');
    console.log("answerAfterReplace: " + answerAfterReplace);

    var answerAsFloat = parseFloat(answerAfterReplace);
    console.log("answerAsFloat: " + answerAsFloat);

    if(answerAsFloat == null) {
        document.getElementById("display-text-label").innerHTML = answerValue + "... what is wrong with you?";
    }

    for(var i = 0; i < currentGame.questionIndex+1; i++) {
        if(i == currentGame.questionIndex) {
            currentPlayer.answers[i] = answerAsFloat;
        }
    }

    SaveCurrentPlayer();
    SaveGames();
}

function GetGamesAsClient() {
    GetJson("yymk1", "Games", UpdatePlayerOnBackend);
}

function UpdatePlayerOnBackend() {
    console.log("Updating Player From Poll");
    if (MyPlayerIsMissing()){
        console.log("Player is missing, Adding Player.");
        GetCurrentGame();
        SaveCurrentPlayer();
        SaveGames();
    }
    else if (currentPlayer.color == null) {
        console.log("Waiting for player color.");
        GetCurrentGame();
        GetCurrentPlayer();
    }
    else {
        console.log("Updating game, not overwriting player.");
        GetCurrentPlayer();
        SaveCurrentPlayer();
    }
}

function MyPlayerIsMissing() {
    if(currentGame != null) {
        for(var j = currentGame.players.length-1; j >= 0; j--) {
            if(currentGame.players[j].name == currentPlayer.name) {
                return false;
            }
        }
    }
    return true;
}