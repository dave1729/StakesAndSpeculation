var DefaultRiddlesPerGame = 14;
var riddles = [];
var games = [];
var currentGame = Game(null);
console.log("Before Initial Games and Riddles");
GetRiddles();
GetGames();
console.log("After Initial Games and Riddles");

function DisplayDebuggingButtons() {
     var buttons = document.getElementsByClassName("debugging-buttons");
     for(var i = 0; i < buttons.length; i++) {
         ToggleVisibleAndHidden(buttons[i]);
     }
}

function ToggleVisibleAndHidden(element) {
    if(element.style.visibility == 'visible') {
        element.style.visibility = 'hidden';
    }
    else {
        element.style.visibility = 'visible';
    }
}

function commonContent() {
var client = new XMLHttpRequest();
    client.open('GET', '/StakesAndSpeculation/commonContent.html');
    client.onreadystatechange = function() {
        document.getElementById('content').innerHTML = client.responseText;
    }
    client.send();
}