function GetCurrentGame() {
     if(currentGame == null) return;

    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id == currentGame.id) {
            currentGame = games[i];
            return;
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
    alert("Couldn't find current game.");
}

function GetCurrentPlayer() {
    for(var i = games.length-1; i >= 0; i--) {
        if(games[i].id == currentGame.id) {
            for(var j = games[i].players.length-1; j >= 0; j--) {
                if(games[i].players[j].name == currentPlayer.name) {
                    currentPlayer = games[i].players[j];
                    return;
                }
            }
            alert("Couldn't find current player.");
        }
    }
    alert("Couldn't find current game.");
}

function SaveCurrentPlayer() {
    if(currentGame == null) return;

    if(currentGame != null) {
        for(var j = currentGame.players.length-1; j >= 0; j--) {
            if(currentGame.players[j].name == currentPlayer.name) {
                currentGame.players[j] = currentPlayer;
            }
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
            alert("couldnt find current player 28454385");
        }
    }
    alert("couldnt find current game 3124312344");
}

function GetRiddles() {
    GetJson("10zvwh", "Riddles");
}

function SaveRiddles() {
    SaveJson("10zvwh", "Riddles");
}

function DisplayRiddles() {
    document.getElementById("display-text-label").innerHTML = JSON.stringify(riddles);
}

function GetGames() {
    GetJson("yymk1", "Games");
}

function SaveGames() {
    SaveJson("yymk1", "Games");
}

function EraseGames() {
    games = [];
    SaveJson("yymk1", "Games");
}

function DisplayGames() {
    document.getElementById("display-text-label").innerHTML = ////JSON.stringify(games) +
        "<br>" + JSON.stringify(currentGame) + "<br>" + JSON.stringify(currentPlayer);
}

function GetJson(myJsonId, objectTypeName, callbackOnSuccess) {

    var isAsync = true;
    var xmlHttp = new XMLHttpRequest();
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

function SaveJson(myJsonId, objectTypeName, callbackOnSuccess) {
    console.log("SAVE GAMES 3");
    var xmlHttp = new XMLHttpRequest();
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