var currentPlayer = Player(null);
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

    var waitingOnChanged = gameStateChanged();
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
    else {
        handleBetsAndAnswerStates(waitingOnChanged);
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

function handleBetsAndAnswerStates(waitingOnChanged) {
    if(currentGame.waitingOn == "bets") {
        if(waitingOnChanged) {
            myTotalBet = 0;
            bettingLocationsCount = 0;
            moneyAtStartOfBetting = getCurrentBalance();
            currentPlayer.money[currentGame.questionIndex] = moneyAtStartOfBetting;
            CreateBettingButtonsAndLabels();
        }
    }
    else if(currentGame.waitingOn == "answers") {
        if(waitingOnChanged) {

        }

        ShowAnswerButton();
    }
}

function gameStateChanged() {
    var currentGameFromServer = GetCurrentGame();
    if (currentGame != null &&
        currentGameFromServer != null &&
        currentGame.waitingOn != currentGameFromServer.waitingOn) {
        return true;
    }

    return false;
}

function getCurrentBalance() {
    var money = 0;
    var riddleIndex = currentGame.questionIndex;
    for (var i = 0; i <= riddleIndex; i++) {
        var moneyToAdd = parseInt(currentPlayer.money[riddleIndex]);
        if(!isNaN(moneyToAdd)) money += moneyToAdd;

        var bet = currentPlayer.bets[i];
        if(bet != null) {
            for (var j = 0; j < bet.length; j++) {
                var moneyToSubtract = parseInt(bet[j]);
                if(!isNaN(moneyToSubtract)) money -= moneyToSubtract;
            }
        }

        var myColorsWinnings = currentGame.winnings[currentPlayer.color];
        if(myColorsWinnings != null)
        {
            var winningsToAdd = parseInt(myColorsWinnings[riddleIndex]);
            if(!isNaN(winningsToAdd)) money += winningsToAdd;
        }
    }
    return money;
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
    log(" ");
    log("Betting on i: " + i);
    currentGame.players.sort(
        function(player1, player2){
            return player1.answers[currentGame.questionIndex] - player2.answers[currentGame.questionIndex];
        }
    );

    var player = currentGame.players[i];

    log("player name from i: " + player.name);
    var currentValue = document.getElementById(player.color + "-label").innerHTML;
    log("currentValue: " + currentValue);
    var parsed = parseIntOrDefault(currentValue, 0);
    log("parsedValue: " + parsed);

    var newValue = parsed;
    var isNotFirstBetForThisPlayerThisTurn = !(parsed == 0);
    var haventBetOnMaxPlayerNumber = bettingLocationsCount < 2;
    var stillMoneyToBet = currentPlayer.money[currentGame.questionIndex] > 0;
    if(isNotFirstBetForThisPlayerThisTurn || haventBetOnMaxPlayerNumber) {

        if(myTotalBet < 2) {
            log("free bet because myTotalBet (" + myTotalBet + ") < 2");
            newValue = parsed + 1;
            myTotalBet++;
            log("myTotalBet is now: " + myTotalBet);

            if(parsed == 0) {
                bettingLocationsCount++;
            }
        }
        else if(currentPlayer.money[currentGame.questionIndex] > 0) {
            log("free bet because myMoney (" + currentPlayer.money[currentGame.questionIndex] + ") > 0");
            newValue = parsed + 1;
            currentPlayer.money[currentGame.questionIndex] -= 1;
            myTotalBet++;
            log("myTotalBet is now: " + myTotalBet);

            if(parsed == 0) {
                bettingLocationsCount++;
            }
        }
    }

    updateMoney();
    log("newValue: " + newValue);
    document.getElementById(player.color + "-label").innerHTML = newValue;
}

function updateMoney() {
    var money = 0;
    try
    {
        money = parseInt(currentPlayer.money[currentGame.questionIndex]);
    }
    catch (err)
    {
        money = 0;
    }
    updateElementWithNewHtml("primary-display-text-label", "Money: " + money, null);
}

function ClearBets() {
    for(var i = 0; i < currentGame.players.length; i++) {
        var player = currentGame.players[i];
        document.getElementById(player.color + "-label").innerHTML = 0;
    }
    currentPlayer.money[currentGame.questionIndex] = moneyAtStartOfBetting;
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

    SaveCurrentPlayer();
    SaveGames(ClearBetsAndDisplayBetsSent);
}

function ClearBetsAndDisplayBetsSent() {
    ClearBets();
    document.getElementById("secondary-display-text-label").innerHTML = "Answer Sent";
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