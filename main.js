var riddles = [];

function DisplayInput() {
    document.getElementById('inputText').style.visibility = 'hidden';
    console.log("inputText: " + document.getElementById('inputText').value);
}

function StartNewGame() {
    //document.getElementById('button1').style.visibility = 'hidden';
    //document.getElementById('button2').style.visibility = 'hidden';
    //document.getElementById('button3').style.visibility = 'hidden';
    //document.getElementById('button4').style.visibility = 'hidden';

    //TODO display game board

    //TODO display question

    //TODO poll for changes

    return riddles[0].answer;
}

function JoinGame() {
    //document.getElementById('button1').style.visibility = 'hidden';
    //document.getElementById('button2').style.visibility = 'hidden';
    //document.getElementById('button3').style.visibility = 'hidden';
    //document.getElementById('button4').style.visibility = 'hidden';

    var serverJsonAsText = GetJson();

    riddles = JSON.parse(serverJsonAsText);

    //TODO display current question

    //TODO display testbox for answer

    //TODO send answer

    return riddles[0].question;
}

function GetJson() {
    var xmlHttp = new XMLHttpRequest();
    var theUrl = "https://api.myjson.com/bins/10zvwh";
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            console.log("Post returned 200! " + xmlHttp.responseText);
            riddles = JSON.parse(xmlHttp.responseText);
        }
        else {
        console.log("XML ReadyState: " + xmlHttp.readyState + " Status: " + xmlHttp.status);
        }
    }
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function PutJson() {
    var xmlHttp = new XMLHttpRequest();
    var theUrl = "https://api.myjson.com/bins/10zvwh";
    xmlHttp.open( "PUT", theUrl, false ); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            console.log("Put Success " + xmlHttp.responseText);
        }
        else {
        console.log("XML ReadyState: " + xmlHttp.readyState + " Status: " + xmlHttp.status);
        }
    }

    var json = JSON.stringify(riddles);

    xmlHttp.send( json );
    return xmlHttp.responseText;
}