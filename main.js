var riddles = [];
var games = [];
var currentGame = Game(null);
var currentPlayer = Player(null, null);
GetGames("async");
GetRiddles("async");

//"display-text-label"
//"text" id="input-text-label"
//"submit-input-button" onclick="DisplayInput()" hidden="hidden"
//"start-new-game-button" onclick="StartNewGame()"
//"display-debugging-buttons" onclick="DisplayDebuggingButtons()"
//"join-game-button" onclick="JoinGame()"
//"get-riddles-button" onclick="GetRiddles()"
//"save-riddles-button" onclick="SaveRiddles()"
//"display-riddles-button" onclick="DisplayRiddles()"

function DisplayDebuggingButtons() {
    ToggleVisibleAndHidden('get-riddles-button');
    ToggleVisibleAndHidden('save-riddles-button');
    ToggleVisibleAndHidden('display-riddles-button');
    ToggleVisibleAndHidden('get-games-button');
    ToggleVisibleAndHidden('save-games-button');
    ToggleVisibleAndHidden('erase-games-button');
    ToggleVisibleAndHidden('display-games-button');
}

function ToggleVisibleAndHidden(elementId) {
    var element = document.getElementById(elementId);

    if(element.style.visibility === 'visible' || element.style.visibility === '') {
        element.style.visibility = 'hidden';
    }
    else {
        element.style.visibility = 'visible';
    }
}

function DisplayInput() {
    console.log("inputText: " + document.getElementById('inputText').value);
}

function StartNewGame() {
    document.getElementById('start-new-game-button').style.visibility = 'hidden';
    document.getElementById('join-game-button').style.visibility = 'hidden';
    document.getElementById('get-riddles-button').style.visibility = 'hidden';
    document.getElementById('save-riddles-button').style.visibility = 'hidden';
    document.getElementById('display-riddles-button').style.visibility = 'hidden';
    document.getElementById('get-games-button').style.visibility = 'hidden';
    document.getElementById('save-games-button').style.visibility = 'hidden';
    document.getElementById('erase-games-button').style.visibility = 'hidden';
    document.getElementById('display-games-button').style.visibility = 'hidden';
    document.getElementById("body-span").innerHTML = '<button type="button" id="start-game-input-button" onclick="StartGame()" >All Players Are In!</button>' +
        '<image id="game-board-image" src="game-board.png" alt="Game board with several horizontal segments." width="500" height="350"></image>';

    shuffle(riddles);
    var selectedRiddles = selectRiddles(riddles);

    currentGame = new Game(selectedRiddles);
    games.push(currentGame);
    console.log("SAVE GAMES 1");
    SaveGames();
    console.log(currentGame.id);
    document.getElementById("display-text-label").innerHTML = "Game ID: " + currentGame.id;

    setTimeout(PollForGameResultsAsServer, 3000);

    //TODO display game board

    //TODO display question

    //TODO poll for changes
}

function selectRiddles(riddles) {
    if(riddles == null || riddles == "undefined") {
        alert("No Riddles Found For Game!");
    }

    if(riddles.length < 15) {
        return riddles;
    }

    var selectedRiddles = [];
    for (i = 0; i < 14; i++) {
    	selectedRiddles.push(riddles[i]);
    }

    return selectedRiddles;
}

function shuffle(list) {
	// random index, scanning value, i
    var randIdx, scanValue, i;
    for (i = list.length-1; i > 0 ; i--) {
    	// find some random index
        randIdx = Math.floor(Math.random() * i);
        //grab current values, scanning from the end
        scanValue = list[i];
        // switch the random value with the current value
        list[i] = list[randIdx];
        list[randIdx] = scanValue;
    }
}

function StartGame() {
    currentGame.questionIndex++;
    SaveCurrentGame();
    SaveGames();
}

function PollForGameResultsAsServer() {
    document.getElementById("display-text-label").innerHTML = JSON.stringify(currentGame);
    GetGamesAsServer("async");
    setTimeout(PollForGameResultsAsServer, 2000);
}

function PollForGameResultsAsClient() {
    GetGamesAsClient("async");
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
    //TODO display current question

    //TODO display testbox for answer

    //TODO send answer
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

function SaveCurrentPlayer() {
    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id == currentGame.id) {
            for(var j = games[i].players.length-1; j >= 0; j--) {
                if(games[i].players[j].name == currentPlayer.name) {
                    games[i].players[j] = currentPlayer;
                    return;
                }
            }
            alert("couldnt find current player 28454385");
        }
    }
    alert("couldnt find current game 3124312344");
}

function SaveCurrentGame() {
    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id == currentGame.id) {
            games[i] = currentGame;
            return;
        }
    }
    alert("couldnt find current game 469608363");
}

function GetCurrentGame() {
    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id == currentGame.id) {
            currentGame = games[i];
            return;
        }
    }
    alert("couldnt find current game 20047463003");
}

function SendAnswer() {
    console.log("SendAnswer");
    if(currentPlayer.answers == null || currentPlayer.answers == 'undefined') {
        currentPlayer.answers = [];
    }
    console.log("currentPlayer.answers.length: " + currentPlayer.answers.length);

    if (currentPlayer.answers.length < currentGame.questionIndex + 1) {
        var voidAnswersToInsert = (currentGame.questionIndex + 1) - currentPlayer.answers.length;
        console.log("voidAnswersToInsert: " + voidAnswersToInsert);
        for(var i = 0; i < voidAnswersToInsert; i++) {
            currentPlayer.answers.push(' ');
        }
    }

    console.log("currentPlayer.answers.length: " + currentPlayer.answers.length);
    console.log("currentGame.questionIndex: " + currentGame.questionIndex);
    for(var i = 0; i < currentGame.questionIndex+1; i++) {
        console.log("currentPlayer.answers[" + i + "]: " + currentPlayer.answers[i]);
        console.log("i: " + i + "  ==  currentGame.questionIndex: " + currentGame.questionIndex);
        if(i == currentGame.questionIndex) {
            currentPlayer.answers[i] = document.getElementById("answer-input").value;
            console.log("currentPlayer.answers[i]: " + currentPlayer.answers[i]);
        }
    }
    console.log("currentPlayer.answers.length: " + currentPlayer.answers.length);

    SaveCurrentPlayer();
    SaveGames();
}

function DisplayRiddles() {
    document.getElementById("display-text-label").innerHTML = JSON.stringify(riddles);
}

function DisplayGames() {
    document.getElementById("display-text-label").innerHTML = JSON.stringify(games);
}

function GetRiddles(syncOrAsync) {
    GetJson("10zvwh", "Riddles", syncOrAsync);
}

function SaveRiddles() {
    SaveJson("10zvwh", "Riddles");
}

function GetGames(syncOrAsync) {
    GetJson("yymk1", "Games", syncOrAsync);
}

function GetGamesAsClient(syncOrAsync) {
    GetJson("yymk1", "Games", syncOrAsync);
    SaveCurrentPlayer();
    GetCurrentGame();
}

function GetGamesAsServer(syncOrAsync) {
    var currentquestionIndex = currentGame.questionIndex;
    GetJson("yymk1", "Games", syncOrAsync);
    GetCurrentGame();
    currentGame.questionIndex = currentquestionIndex;
}

function SaveGames() {
    SaveJson("yymk1", "Games");
}

function EraseGames() {
    games = [];
    SaveJson("yymk1", "Games");
}

function GetJson(myJsonId, objectTypeName, syncOrAsync) {

    var isSync = true;
    if(syncOrAsync === "sync" || syncOrAsync === "Sync" || syncOrAsync === "SYNC") {
        isSync = false;
    }
    var xmlHttp = new XMLHttpRequest();
    var theUrl = "https://api.myjson.com/bins/" + myJsonId;
    xmlHttp.open( "GET", theUrl, isSync ); // false for synchronous request true for async
    xmlHttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            console.log("Post returned 200! " + xmlHttp.responseText.substr(0,50));
            if(objectTypeName === "Riddles") {
                riddles = JSON.parse(xmlHttp.responseText);
            }
            else if(objectTypeName === "Games") {
                games = JSON.parse(xmlHttp.responseText);
            }
            else {
                console.log("objectTypeName wasn't Riddles or Games! When Getting.");
                alert("Error: objectTypeName wasn't Riddles or Games!");
            }
        }
        else {
            console.log("XML ReadyState: " + xmlHttp.readyState + " Status: " + xmlHttp.status);
        }
    }
    xmlHttp.send( null );
}

function SaveJson(myJsonId, objectTypeName) {
    console.log("SAVE GAMES 3");
    var xmlHttp = new XMLHttpRequest();
    var theUrl = "https://api.myjson.com/bins/" + myJsonId;
    xmlHttp.open( "PUT", theUrl, true ); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            console.log("Put Success " + xmlHttp.responseText.substr(0, 50));
        }
        else {
            console.log("XML ReadyState: " + xmlHttp.readyState + " Status: " + xmlHttp.status);
        }
    }

    console.log("HERE");
    if(objectTypeName === "Riddles") {
        console.log("saving riddles");
        var json = JSON.stringify(riddles);
        xmlHttp.send( json );
    }
    else if(objectTypeName === "Games") {
        console.log("saving games");
        var json = JSON.stringify(games);
        xmlHttp.send( json );
    }
    else {
        console.log("objectTypeName wasn't Riddles or Games! when saving.");
        alert("Error: objectTypeName wasn't Riddles or Games!");
    }
}