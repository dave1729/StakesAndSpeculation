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
//    var responseText = httpGet("https://docs.google.com/spreadsheets/d/1GSNfhGn2CeTzpqgQik0LpXdivIy4NDQYye06o3m1eD4/edit?usp=sharing");
//
//    var myRe = /Question/;
//    var start = responseText.search(myRe);
//    var myRe = /endoflistterminator/;
//    var end = responseText.search(myRe);
//    var retVal;
//
//    if(start !== -1) {
//        console.log("Success " + responseText.substring(start, end));
//
//        retVal = responseText.substring(start, end);
//    }
//    else {
//        console.log("Fail " + responseText);
//        retVal = responseText;
//    }

    var response = httpGet("https://sheets.googleapis.com/v4/spreadsheets/1GSNfhGn2CeTzpqgQik0LpXdivIy4NDQYye06o3m1eD4/values/Questions?key=AIzaSyAA_GuyTMBfuNwfVwFFahFiVZql23-xe-Y");
    var myRe = /Question/;
    var start = response.search(myRe);
    var myRe = /endoflistterminator/;
    var end = response.search(myRe);

    if(start !== -1) {
        console.log("Success " + response.substring(start, end));
        retVal = response.substring(start, end);
    }
    else {
        console.log("Fail " + response);
        retVal = response;
    }
	////var number = window.prompt("Number?");
	return retVal;
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