var currentPlayer = Player(null, null);
var bettingButtonsCreated = false;
var myTotalBet = 0;
var moneyAtStartOfBetting = -1;
var bettingLocationsCount = 0;

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
    console.log("AnswerValue: " + answerValue);

    var answerAfterReplace = answerValue.replace(/[^0-9.]+/g, '');
    console.log("AnswerAfterReplace: " + answerAfterReplace);

    var answerAsFloat = parseFloat(answerAfterReplace);
    console.log("AnswerAsFloat: " + answerAsFloat);

    if(answerAsFloat == null) {
        document.getElementById("second-display-text-label").innerHTML = answerValue + "... what is wrong with you?";
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
    console.log("Updating Current Game from Server.");
    GetCurrentGame();
    if (MyPlayerIsMissing()){
        console.log("Player is missing, Adding Player.");
        SaveCurrentPlayer();
        SaveGames();
    }
    else if (currentPlayer.color == null) {
        console.log("Waiting for player color to be assigned.");
        GetCurrentPlayer();
    }
    else if(currentGame.waitingOn == "bets") {
        if(!bettingButtonsCreated) {
            console.log("before labels and buttons");
            CreateBettingButtonsAndLabels();
            console.log("after labels and buttons");
            bettingButtonsCreated = true;
            myTotalBet = 0;
            bettingLocationsCount = 0;
            moneyAtStartOfBetting = currentPlayer.money;
        }
        else {

        }
    }
    else {
        console.log("Updating game, not overwriting player.");
        SaveCurrentPlayer();
    }
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
            ')" >' + player.color + '</button>';
    }

    bettingButtonsHtml += '<br><button type="button" id="clear-bets-button" onclick="ClearBets()" >Clear Bets</button>';
    bettingButtonsHtml += '<button type="button" id="send-bets-button" onclick="SendBets()" >Send Bets</button>';

    document.getElementById("body-span").innerHTML += bettingButtonsHtml;
    console.log(document.getElementById("body-span").innerHTML);
}

function BetOnPlayer(i) {
    console.log("i: " + i);
    currentGame.players.sort(
        function(player1, player2){
            return player1.answers[currentGame.questionIndex] - player2.answers[currentGame.questionIndex];
        }
    );

    var player = currentGame.players[i];

    console.log("player name from i: " + player.name);
    var currentValue = document.getElementById(player.color + "-label").innerHTML;
    console.log("currentValue: " + currentValue);
    var parsed = parseInt(currentValue);
    if (isNaN(parsed)) {
        parsed = 0;
    }
    console.log("parsedValue: " + parsed);

    var newValue = parsed;

    if(!(parsed == 0 && bettingLocationsCount >= 2)) {

        if(myTotalBet < 2) {
            console.log("free bet");
            newValue = parsed + 1;
            myTotalBet += 1;

            if(parsed == 0) {
                bettingLocationsCount++;
            }
        }
        else if(currentPlayer.money > 0) {
            console.log("paid bet");
            newValue = parsed + 1;
            currentPlayer.money -= 1;
            myTotalBet += 1;

            if(parsed == 0) {
                bettingLocationsCount++;
            }
        }
    }

    console.log("newValue: " + newValue);
    document.getElementById(player.color + "-label").innerHTML = newValue;
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

function SendBets() {
    console.log("Sending Bets Is Not Complete!");
    currentPlayer.money = 10;
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