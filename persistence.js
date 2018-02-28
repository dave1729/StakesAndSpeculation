function GetCurrentGame() {
     if(currentGame == null) return;

    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id == currentGame.id) {
            return games[i];
        }
    }
}

function SaveCurrentGame() {
    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id == currentGame.id) {
            games[i] = currentGame;
            return;
        }
    }
}

function GetCurrentPlayer() {
    if(currentGame == null) return;

    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id == currentGame.id) {
            for(var j = games[i].players.length-1; j >= 0; j--) {
                if(games[i].players[j].name == currentPlayer.name) {
                    return games[i].players[j];
                }
            }
        }
    }
}

function SaveCurrentPlayer() {
    if(currentGame == null) return;

    for(var j = currentGame.players.length-1; j >= 0; j--) {
        if(currentGame.players[j].name == currentPlayer.name) {
            currentGame.players[j] = currentPlayer;
        }
    }

    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id == currentGame.id) {
            for(var j = games[i].players.length-1; j >= 0; j--) {
                if(games[i].players[j].name == currentPlayer.name) {
                    games[i].players[j] = currentPlayer;
                    return;
                }
            }
        }
    }
}

function GetRiddles(callbackOnSuccess) {
    console.log("GetRiddles()");
    GetJson("Riddles", callbackOnSuccess);
}

function SaveRiddles(callbackOnSuccess) {
    console.log("SaveRiddles()");
    SaveJson("Riddles", callbackOnSuccess);
}

function ClearSecondaryDisplay() {
    console.log("ClearSecondaryDisplay()");
    var element = document.getElementById("display-test-text-label");
    element.innerHTML = "";
}

function DisplayRiddles() {
    console.log("DisplayRiddles()");
    var element = document.getElementById("display-test-text-label");
    element.innerHTML = JSON.stringify(riddles);
}

function GetGames(callbackOnSuccess) {
    console.log("GetGames()");
    GetJson("Games", callbackOnSuccess);
}

function SaveGames(callbackOnSuccess) {
    console.log("SaveGames()");
    SaveJson("Games", callbackOnSuccess);
}

function EraseGames(callbackOnSuccess) {
    console.log("EraseGames()");
    games = [];
    SaveJson("Games", callbackOnSuccess);
}

function DisplayGames() {
    console.log("DisplayGames()");
    var element = document.getElementById("display-test-text-label");
    element.innerHTML = "";
    for(var i = games.length-1; i >= 0; i--) {
        element.innerHTML += JSON.stringify(games[i]) + "<br><br>";
    }
}

function GetJson(objectTypeName, callbackOnSuccess) {

    var isAsync = true;
    var xmlHttp = new XMLHttpRequest();
    var myJsonId = getMyJsonId(objectTypeName);
    var theUrl = "https://api.myjson.com/bins/" + myJsonId;
    xmlHttp.open( "GET", theUrl, isAsync ); // false for synchronous request true for async
    xmlHttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            console.log("Get returned DONE 200! " + xmlHttp.responseText.substr(0,50));
            if(objectTypeName === "Riddles") {
                riddles = JSON.parse(xmlHttp.responseText);
                if(callbackOnSuccess != null) callbackOnSuccess();
            }
            else if(objectTypeName === "Games") {
                games = JSON.parse(xmlHttp.responseText);
                if(callbackOnSuccess != null) callbackOnSuccess();
            }
            else {
                alert("Error: objectTypeName wasn't Riddles or Games when retrieving!");
            }
        }
        else {
            console.log("XML ReadyState: " + xmlHttp.readyState + " Status: " + xmlHttp.status);
        }
    }
    xmlHttp.send( null );
}

function SaveJson(objectTypeName, callbackOnSuccess) {
    var xmlHttp = new XMLHttpRequest();
    var myJsonId = getMyJsonId(objectTypeName);
    var theUrl = "https://api.myjson.com/bins/" + myJsonId;
    xmlHttp.open( "PUT", theUrl, true ); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            console.log("Put Success " + xmlHttp.responseText.substr(0, 50));
            if(callbackOnSuccess != null) callbackOnSuccess();
        }
        else {
            console.log("XML ReadyState: " + xmlHttp.readyState + " Status: " + xmlHttp.status);
        }
    }

    if(objectTypeName === "Riddles") {
        console.log("Saving riddles");
        var json = JSON.stringify(riddles);
        xmlHttp.send( json );
    }
    else if(objectTypeName === "Games") {
        console.log("Saving games");
        var json = JSON.stringify(games);
        xmlHttp.send( json );
    }
    else {
        alert("Error: objectTypeName wasn't Riddles or Games!");
    }
}

function getMyJsonId(objectTypeName) {
    if(objectTypeName.toUpperCase() == "RIDDLES") {
        return "10zvwh";
    }
    else if(objectTypeName.toUpperCase() == "GAMES") {
        return "yymk1";
    }
    else {
        alert("Error: " + objectTypeName + " wasn't 'Riddles' or 'Games' when retrieving!");
    }
}