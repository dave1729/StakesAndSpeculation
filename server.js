var currentQuestionIndex = -1;
var nullGamesError = 0;
//enum: players,answers,bets

function waitForGamesAndRiddles() {
    log("Waiting for games and riddles... ");
    if(!riddles || !games) {
        nullGamesError++;

        log("Waiting (riddles == null|games == null): " + "(" + (!riddles) + "|" + (!games) + ")");
        setTimeout(waitForGamesAndRiddles, 300);

        log("No Games Found From Server. Occurances: " + nullGamesError);
        if(nullGamesError > 5) {
            log("No Games Found. Saving Empty Games List To Server.");
            games = [];
            SaveGames();
        }
    }
    else {
        var gameId = getQueryString("gameId");
        currentGame = GetCurrentGame(gameId);
        log("Using the querystring found game: " + currentGame);
        if(currentGame != null) {
            log("Starting Existing Game using Game ID. gameId: " + currentGame.id);
            SaveCurrentGame();
            useGameThatAlreadyExist();
        }
        else {
            log("Making a new Game using Game ID. gameId: " + gameId);
            createNewGame();
        }
    }
}

function useGameThatAlreadyExist() {
    document.getElementById("primary-display-text-label").innerHTML = "Game ID: " + currentGame.id;
    SaveGames();
    setTimeout(PollForGameResultsAsServer, 3000);
}

function createNewGame() {
    shuffle(riddles);
    var selectedRiddles = selectRandomElements(riddles, DefaultRiddlesPerGame);

    log("Initialize CurrentGame.");
    currentGame = new Game(selectedRiddles);
    games.push(currentGame);
    SaveGames();

    document.getElementById("primary-display-text-label").innerHTML = "Game ID: " + currentGame.id;
    setTimeout(PollForGameResultsAsServer, 3000);
}

function HandleEndOfTurn() {
    log("Handling End of Turn. CurrentGame is waiting on " + currentGame.waitingOn);
    if(currentGame.waitingOn == "players") {
        log("Assigning Colors");
        AssignColorsToPlayers();
        document.getElementById('next-turn-button').innerHTML = "Turn Is Complete";
        currentGame.waitingOn = "answers";
        log("question index: " + currentGame.questionIndex);
        currentGame.questionIndex++;
        log("question index: " + currentGame.questionIndex);
        DisplayNextQuestion();
    }
    else if(currentGame.waitingOn == "answers") {
        log("Answers are in. Display Answers and move onto betting!");
        DisplayPlayersWithAnswers();
        setTimeout(DisplayAnswersForVoting, 5000);
        currentGame.waitingOn = "bets";
    }
    else if(currentGame.waitingOn == "bets") {
        log("End Of Turn After Bets Is Not Complete!");
        DisplayAnswersForVoting();
        setTimeout(CalculateResults, 2000);
    }

    logDetailed("Saving Current Game");
    SaveCurrentGame();
    SaveGames();
}

function getWinningMultiplierArray(answersCount) {
    if(answersCount < 1) {
        return new Array(0);
    }

    var middleValue = answersCount % 2 === 0 ? 3 : 2;
    var multiplierArray = new Array(answersCount);

    multiplier = middleValue;
    for (var i = Math.floor(answersCount/2); i < answersCount; i++) {
        multiplierArray[i] = multiplier++;
    }

    var multiplier = middleValue;
    for (var i = Math.floor((answersCount-1)/2); i >= 0; i--) {
        multiplierArray[i] = multiplier++;
    }

    return multiplierArray;
}

function CalculateResults() {
    var correctColor = null;
    var correctAnswer = parseInt(currentGame.riddles[currentGame.questionIndex].answer);
    log(`answer as string ${currentGame.riddles[currentGame.questionIndex].answer} and as int ${correctAnswer}`);
    if(isNaN(correctAnswer)) alert("The Answer to this Question is not a number... Sorry.");

    currentGame.players.sort(
        function(player1, player2){
            return player1.answers[currentGame.questionIndex] - player2.answers[currentGame.questionIndex];
        }
    );

    var winningIndex = -1;
    for(var i = 0; i < currentGame.players.length; i++) {
        try {
            var thisAnswer = parseInt(currentGame.players[i].answers[currentGame.questionIndex]);
            if(thisAnswer <= correctAnswer) {
                correctColor = currentGame.players[i].color;
                winningIndex = i;
            }
        }
        catch (err) {
        }
    }

    var winningMultipliers = getWinningMultiplierArray(currentGame.players.length);
    log("Winning Multipliers: " + winningMultipliers);
    var winningMultiplier = parseInt(winningMultipliers[winningIndex]);
    log("Winning Multiplier: " + winningMultiplier);
    log("correctColor: " + correctColor);
    DisplayGames();
    var qi = currentGame.questionIndex;

    for( var i = 0; i < currentGame.players.length; i++) {
        log("Name: " + currentGame.players[i].name);
        log("Color: " + currentGame.players[i].color);
        log("BetCount: " + currentGame.players[i].bets.length);
        log("BetCount: " + currentGame.players[i].bets.length);
        var myWinnings = 0;
        for (var k = 0; k < currentGame.players[i].bets[qi].length; k++) {
            log("Checking if " + currentGame.players[i].bets[qi][k].playerColor + " == " + correctColor);
            if(!currentGame.players[i].bets[qi]) {
                currentGame.players[i].bets[qi] = [];
            }

            if(currentGame.players[i].bets[qi][k].playerColor == correctColor) {
                var bet = parseInt(currentGame.players[i].bets[qi][k].amount);
                myWinnings = bet * winningMultiplier;
            }
            else {
                log("They arn't equal.");
            }
        }
        log(`winnings for ${currentGame.players[i].color} are ${myWinnings} = ${bet} * ${winningMultiplier}`);
        currentGame.winnings[currentGame.players[i].color][qi] = myWinnings;
    }


    currentGame.questionIndex++;
    currentGame.waitingOn = "answers";
    DisplayNextQuestion();
    SaveCurrentGame();
    SaveGames();
}

function DisplayNextQuestion() {
    var currentRiddle = currentGame.riddles[currentGame.questionIndex];
    log("Current Riddle: " + currentRiddle.question.toString());
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

    var longest = 0;
    for(var i = 0; i < players.length; i++) {
        var playerAnswer = players[i].answers[currentGame.questionIndex];
        if(playerAnswer || playerAnswer === 0) {
            var length = playerAnswer.toString().length;
            longest = Math.max(longest, length);
        }
    }
    longest += 2;


    for(var i = 0; i < players.length; i++) {
        var player = players[i];
        var answer = padEnd(player.answers[currentGame.questionIndex],longest);
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
                displayText += '<span style="color: ' + thatPlayer.color + '">' + padEnd(theBet.amount,longest) + "   " + '</span>';
            } else {
                displayText += '<span style="color: dark grey">' + padEnd("0",longest) + '</span>';
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
    var colors = [ "blue", "red", "fuchsia", "lime", "aqua", "blueviolet", "chocolate", "crimson", "coral", "indigo", "lawngreen", "orchid", "tomato" ]
    shuffle(colors);
    for(var i = 0; i < currentGame.players.length; i++) {
        currentGame.players[i].color = colors[i];
    }

    if(!currentGame.winnings) {
        currentGame.winnings = new Object();
    }

    for(var i = 0; i < currentGame.players.length; i++) {
        currentGame.winnings[currentGame.players[i].color] = [];
    }
}

function PollForGameResultsAsServer() {
    GetGamesAsServer();
    setTimeout(PollForGameResultsAsServer, 2000);
}

function GetGamesAsServer() {
    logDetailed("Saving question index");
    currentQuestionIndex = currentGame.questionIndex;

    GetJson("Games", UpdateServerWithNewGames);
}

function UpdateServerWithNewGames() {
    currentGame = GetCurrentGame();

    logDetailed("Restoring question index");
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
    log("Update Board. CurrentGame is waiting on " + currentGame.waitingOn);
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
    log("printing players so far. GameId: " + currentGame.id);
    var displayText = "Game ID: " + currentGame.id + "        Players: ";
    for(var i = 0; i < currentGame.players.length; i++) {
        displayText += currentGame.players[i].name + ",   ";
    }

    if(currentGame.players.length > 0) displayText = displayText.substring(0, displayText.length - 4);

    updateElementWithNewHtml('primary-display-text-label', displayText, null);
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

    updateElementWithNewHtml('primary-display-text-label', displayText, null);
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

                logDetailed("Turn not over, player " + currentPlayer.name + " answer is '" +
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

log("server.js loaded");