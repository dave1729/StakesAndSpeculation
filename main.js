var riddles = [];
var games = [];
GetGames("async");

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
    ToggleVisibleAndHidden('start-new-game-button');
    ToggleVisibleAndHidden('join-game-button');
    ToggleVisibleAndHidden('get-riddles-button');
    ToggleVisibleAndHidden('save-riddles-button');
    ToggleVisibleAndHidden('display-riddles-button');
    ToggleVisibleAndHidden('get-games-button');
    ToggleVisibleAndHidden('save-games-button');
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
    document.getElementById('display-games-button').style.visibility = 'hidden';
    document.getElementById('toggle-debugging-buttons').style.visibility = 'hidden';

    var newGame = new Object();
    newGame.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    newGame.participants = [];
    newGame.date = Date.now();
    games.push(newGame);
    console.log("SAVE GAMES 1");
    SaveGames();
    console.log(newGame.id);
    document.getElementById("display-text-label").innerHTML = "Game ID: " + newGame.id;

    //TODO display game board

    //TODO display question

    //TODO poll for changes
}

function JoinGame() {

    var serverJsonAsText = GetRiddles();

    riddles = JSON.parse(serverJsonAsText);

    //TODO display current question

    //TODO display testbox for answer

    //TODO send answer

    return riddles[0].question;
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
    console.log("SAVE GAMES 2");
    GetJson("yymk1", "Games", syncOrAsync);
}

function SaveGames() {
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
            console.log("Post returned 200! " + xmlHttp.responseText);
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
            document.getElementById("display-text-label").innerHTML = objectTypeName + " Retrieved.";
        }
        else {
            console.log("XML ReadyState: " + xmlHttp.readyState + " Status: " + xmlHttp.status);
            document.getElementById("display-text-label").innerHTML = "Error Getting " + objectTypeName + ".";
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
            console.log("Put Success " + xmlHttp.responseText);
            document.getElementById("display-text-label").innerHTML = objectTypeName + " Saved.";
        }
        else {
            console.log("XML ReadyState: " + xmlHttp.readyState + " Status: " + xmlHttp.status);
            document.getElementById("display-text-label").innerHTML = "Error Saving " + objectTypeName + ".";
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