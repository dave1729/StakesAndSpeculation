var currentPlayer = Player(null, null);
var bettingButtonsCreated = false;
var myTotalBet = 0;
var moneyAtStartOfBetting = -1;
var bettingLocationsCount = 0;

function GetGamesAsClient() {
    GetJson("Games", UpdatePlayerOnBackend);
}

function JoinGameMenu() {
    document.getElementById("body-span").innerHTML = '' +
    '<label id="game-id-input-label">Join Game with ID: </label><input type="text" id="game-id-input" >' +
    '<label id="player-id-input-label"> Using Player Name: </label><input type="text" id="player-id-input" >' +
    '<button type="button" id="submit-input-button" onclick="SendInput()" >Join Game</button>';

    GetGamesAsClient();
}

function SendInput() {
    var gameId = document.getElementById("game-id-input").value.toUpperCase();
    var playerName = document.getElementById("player-id-input").value;

    //set the right game
    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id === gameId) {
            currentPlayer = new Player(playerName);
            games[i].players.push(currentPlayer);
            currentGame = games[i];

            SaveGames(ShowAnswerButton);
            return;
        }
    }
    alert("Couldn't find you're game, check the ID and try again.");
}

function ShowAnswerButton() {
    var displayText = '' +
            '<label id="answer-input-label">Answer: </label><input id="answer-input" type="text">' +
            '<button type="button" color="' + currentPlayer.color + '" id="answer-input-button" onclick="SendAnswer()">Submit</button>';

    updateMoney();
    updateElementWithNewHtml("body-span", displayText, null);
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
    logDetailed("AnswerValue: " + answerValue);

    var answerAfterReplace = answerValue.replace(/[^0-9.]+/g, '');
    logDetailed("AnswerAfterReplace: " + answerAfterReplace);

    var answerAsFloat = parseFloat(answerAfterReplace);
    logDetailed("AnswerAsFloat: " + answerAsFloat);

    if(answerAsFloat == null) {
        document.getElementById("secondary-display-text-label").innerHTML = answerValue + "... what is wrong with you?";
    }

    for(var i = 0; i < currentGame.questionIndex+1; i++) {
        if(i == currentGame.questionIndex) {
            currentPlayer.answers[i] = answerAsFloat;
        }
    }

    document.getElementById("secondary-display-text-label").innerHTML = "Answer Sent";
    SaveCurrentPlayer();
    SaveGames();
}

function UpdatePlayerOnBackend() {
    var waitingOnStage = currentGame == null ? "":currentGame.waitingOn;
    log("Updating Current Game from Server. CurrentGame is waiting on " + waitingOnStage);
    currentGame = GetCurrentGame();
    if (MyPlayerIsMissing()){
        logDetailed("Player is missing, Adding Player.");
        SaveCurrentPlayer();
        SaveGames();
    }
    else if (currentPlayer.color == null) {
        logDetailed("Waiting for player color to be assigned.");
        currentPlayer = GetCurrentPlayer();
    }
    else if(currentGame.waitingOn == "bets") {
        myTotalBet = 0;
        bettingLocationsCount = 0;
        moneyAtStartOfBetting = parseInt(currentPlayer.money) + parseInt(currentGame.winnings[currentPlayer.color]);
        currentPlayer.money = moneyAtStartOfBetting;
        CreateBettingButtonsAndLabels();
    }
    else if(currentGame.waitingOn == "answers") {
        ShowAnswerButton();
    }
    else {
        logDetailed("Updating game, not overwriting player.");
        SaveCurrentPlayer();
    }

    var playerFromServer = GetCurrentPlayer();
    var updatedPlayerError = firstPlayerUpToDateWithSecondPlayer(playerFromServer,currentPlayer);
    if(updatedPlayerError != null) {
        log("Player found not fully updated, updating. " + updatedPlayerError);
        SaveCurrentPlayer();
        SaveGames();
    }

    setTimeout(GetGamesAsClient, 3000);
}

function CreateBettingButtonsAndLabels() {
    var bettingButtonsHtml = "<br>";

    currentGame.players.sort(
        function(player1, player2){
            return player1.answers[currentGame.questionIndex] - player2.answers[currentGame.questionIndex];
        }
    );

    for(var i = 0; i < currentGame.players.length; i++) {
        var player = currentGame.players[i];
        bettingButtonsHtml += '<label id="' + player.color + '-label" style="color: ' + player.color + '" size="4">0</label>';
        bettingButtonsHtml += '<button type="button" id="' + player.color +
            '-button" background.color="' + player.color +
            '" onclick="BetOnPlayer(' + i +
            ')">' + player.color + '</button>';
    }

    bettingButtonsHtml += '<br><button id="clear-bets-button" type="button" onclick="ClearBets()">Clear Bets</button>';
    bettingButtonsHtml += '<button id="send-bets-button" type="button" onclick="SendBets()">Send Bets</button>';

    updateMoney();
    updateElementWithNewHtml("body-span", bettingButtonsHtml, 54);
}

function BetOnPlayer(i) {
    logDetailed("i: " + i);
    currentGame.players.sort(
        function(player1, player2){
            return player1.answers[currentGame.questionIndex] - player2.answers[currentGame.questionIndex];
        }
    );

    var player = currentGame.players[i];

    logDetailed("player name from i: " + player.name);
    var currentValue = document.getElementById(player.color + "-label").innerHTML;
    logDetailed("currentValue: " + currentValue);
    var parsed = parseIntOrDefault(currentValue, 0);
    logDetailed("parsedValue: " + parsed);

    var newValue = parsed;
    if(!(parsed == 0 && bettingLocationsCount >= 2)) {

        if(myTotalBet < 2) {
            logDetailed("free bet");
            newValue = parsed + 1;
            myTotalBet += 1;

            if(parsed == 0) {
                bettingLocationsCount++;
            }
        }
        else if(currentPlayer.money > 0) {
            logDetailed("paid bet");
            newValue = parsed + 1;
            currentPlayer.money -= 1;
            myTotalBet += 1;

            if(parsed == 0) {
                bettingLocationsCount++;
            }
        }
    }

    updateMoney();
    logDetailed("newValue: " + newValue);
    document.getElementById(player.color + "-label").innerHTML = newValue;
}

function updateMoney() {
    var money = currentPlayer == null ? "0" :
        currentPlayer.money == null ? "0" :
        isNaN(currentPlayer.money) ? "0" :
        currentPlayer.money;
    updateElementWithNewHtml("primary-display-text-label", "Money: " + money, null);
}

function ClearBets() {
    for(var i = 0; i < currentGame.players.length; i++) {
        var player = currentGame.players[i];
        document.getElementById(player.color + "-label").innerHTML = 0;
    }
    currentPlayer.money = moneyAtStartOfBetting;
    myTotalBet = 0;
    bettingLocationsCount = 0;
}

function parseIntOrDefault(numberToParse, defaultValue) {
    var parsed = parseInt(numberToParse);
    if (isNaN(parsed)) {
        parsed = defaultValue;
    }

    return parsed;
}

function SendBets() {
    for(var i = 0; i <= currentGame.questionIndex; i++) {
        if(currentPlayer.bets[i] == null) {
            currentPlayer.bets[i] = [];
        }
    }

    var betLocationsCount = 0;
    for(var i = 0; i < currentGame.players.length; i++) {
        if(betLocationsCount < 2) {
            var player = currentGame.players[i];
            var betAsString = document.getElementById(player.color + "-label").innerHTML;
            var bet = parseIntOrDefault(betAsString, 0);
            if(bet > 0) {
                currentPlayer.bets[currentGame.questionIndex].push(new Bet(player.color, bet));
                betLocationsCount++;
            }
        }
    }

    document.getElementById("clear-bets-button").style.visibility = 'hidden';
    SaveCurrentPlayer();
    SaveGames();
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