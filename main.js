
function SecretSantaInterface() {

	//alert("function SecretSantaInterface()");
	this.canvas = document.getElementById("InteractiveCanvas");
	//set canvas dimensions
	this.canvas.width = window.innerWidth - 50;
	this.canvas.height = window.innerHeight - 150;

	//create context and empty entity list (everything is an entity except the background)
	this.ctx = this.canvas.getContext('2d');

	//Start
	this.drawAll();
}

SecretSantaInterface.prototype.drawAll = function() {
	var self = this;

	//request next frame, with callback to this function
	window.requestAnimationFrame(this.drawAll.bind(this));
}

function StartNewGame() {
    document.getElementById('button1').style.visibility = 'hidden';
    document.getElementById('button2').style.visibility = 'hidden';
    document.getElementById('button4').style.visibility = 'hidden';
    //role = "server";
    currentGameRiddles = getRiddlesFromServer();
    httpPost();
}

function JoinGame() {
    document.getElementById('button1').style.visibility = 'hidden';
    document.getElementById('button2').style.visibility = 'hidden';
    document.getElementById('button3').style.visibility = 'hidden';
    //role = "client";
}

function displayCurrentGame() {
    var games = getGamesFromServer();

    var retVal = "";

    for(var i = 0; i < games.length; i++) {
        var game = games[i];
        retVal +=
            game.Id + ": " + "____" +
            game.gameId + "<br>";
    }

    return retVal;
}

function displayRiddles()
{
    var riddles = getRiddlesFromServer();

    return riddlesAsString(riddles);
}

function getGamesFromServer()
{
    var response = httpGet("https://sheets.googleapis.com/v4/spreadsheets/1GSNfhGn2CeTzpqgQik0LpXdivIy4NDQYye06o3m1eD4/values/Games?key=AIzaSyAA_GuyTMBfuNwfVwFFahFiVZql23-xe-Y&majorDimension=ROWS");

    return gameListFromResponse(response);
}

function postGameToServer()
{
    var response = httpGet("https://sheets.googleapis.com/v4/spreadsheets/1GSNfhGn2CeTzpqgQik0LpXdivIy4NDQYye06o3m1eD4/values/Games?key=AIzaSyAA_GuyTMBfuNwfVwFFahFiVZql23-xe-Y&majorDimension=ROWS");

    return gameListFromResponse(response);
}

function gameListFromResponse(httpResponse)
{
    var arrayOfArrays = JSON.parse(httpResponse);
    var games = [];

    for(var i = 0; i < arrayOfArrays.values.length; i++) {
        var game = new Object();
        var array = arrayOfArrays.values[i];
        game.id = i + 1;
        game.gameId = array[0];
        games.push(game);
    }

	return games;
}

function getRiddlesFromServer()
{
    var response = httpGet("https://sheets.googleapis.com/v4/spreadsheets/1GSNfhGn2CeTzpqgQik0LpXdivIy4NDQYye06o3m1eD4/values/Riddles?key=AIzaSyAA_GuyTMBfuNwfVwFFahFiVZql23-xe-Y&majorDimension=ROWS");

    return riddleListFromResponse(response);
}

function riddlesAsString(riddles) {
    var retVal = "";

    for(var i = 0; i < riddles.length; i++) {
        var riddle = riddles[i];
        retVal +=
            "Riddle " + i + ": " + "____" +
            riddle.question + "____" +
            riddle.answer + "    " +
            riddle.units + "<br>";
    }

    return retVal;
}

function riddleListFromResponse(httpResponse)
{
    var arrayOfArrays = JSON.parse(httpResponse);
    var riddles = [];

    for(var i = 0; i < arrayOfArrays.values.length; i++) {
        var riddle = new Object();
        var array = arrayOfArrays.values[i];
        riddle.id = i + 1;
        riddle.question = array[0];
        riddle.answer = array[1];
        riddle.units = array[2];
        riddle.funfact = array[3];
        riddle.sourcename = array[4];
        riddle.source = array[5];
        riddle.sourcetype = array[6];
        riddle.sourceyear = array[7];
        riddle.creationdate = array[8];
        riddle.createdby = array[9];
        riddle.lastuseddate = array[10];
        riddles.push(riddle);
    }

    console.log("Retrieved Riddles:");
    console.log(riddlesAsString(riddles));

	return riddles;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//this function doesn't work
function httpPost() {
    var http = new XMLHttpRequest();
    var url = "https://sheets.googleapis.com/v4/spreadsheets/1GSNfhGn2CeTzpqgQik0LpXdivIy4NDQYye06o3m1eD4/values/Games!A1:append?key=AIzaSyAA_GuyTMBfuNwfVwFFahFiVZql23-xe-Y&majorDimension=ROWS?Game=9999";
    var body = '{' +
                  '"range": "Games",' +
                  '"majorDimension": "ROWS",' +
                  '"values": [[' +
                  '"1",' +
                  '"2",' +
                  '"3",' +
                  '"4"' +
                  ']],' +
                '}';

    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Access-Control-Allow-Origin", "*");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(body);
    console.log("response " + http.response);
    console.log("responsetext " + http.responseText);
}

var ssInterface = new SecretSantaInterface();
////ssInterface.drawAll();