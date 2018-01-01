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

function getQuestions()
{
    var response = httpGet("https://sheets.googleapis.com/v4/spreadsheets/1GSNfhGn2CeTzpqgQik0LpXdivIy4NDQYye06o3m1eD4/values/Questions?key=AIzaSyAA_GuyTMBfuNwfVwFFahFiVZql23-xe-Y&majorDimension=ROWS");

    var riddles = riddleListFromResponse(response);

    return riddlesAsString(riddles);
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
        console.log(array[0] + " - " + array[1] + " - " + array[2] + " - " + array[3]);
        riddles.push(riddle);
    }

    console.log("Retrieved Riddles:");

    for(var i = 0; i < riddles.length; i++) {
        var riddle = riddles[i];
        console.log("Riddle " + i + ": " + riddle.question);
    }

	return riddles;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var ssInterface = new SecretSantaInterface();
////ssInterface.drawAll();