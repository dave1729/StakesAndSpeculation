var DefaultRiddlesPerGame = 7;
var riddles = [];
var games = [];
var currentGame = Game(null);
logDetailed("Before Initial Games and Riddles");
GetRiddles();
GetGames();
logDetailed("After Initial Games and Riddles");

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

function updateElementWithNewHtml(elementName, innerHtml, matchLength) {
    var currentInnerHtml = document.getElementById(elementName).innerHTML;
    matchLength = matchLength != null ? parseInt(matchLength) : innerHtml.length;
    if(currentInnerHtml.substring(0, matchLength) != innerHtml.substring(0, matchLength)) {
        log("Changing Body Span: " + currentInnerHtml.substring(0, matchLength));
        log("Changing Body Span: " + innerHtml.substring(0, matchLength));
        document.getElementById(elementName).innerHTML = innerHtml;
    }
}

function stringArraySizeMatch(stringArray) {
    var longest = 0;
    for(var i = 0; i < stringArray.length; i++) {
        if(stringArray[i].length > longest) longest = stringArray[i].length;
    }

    for(var i = 0; i < stringArray.length; i++) {
        if (stringArray[i].length < longest) {
            var neededChars = longest - stringArray[i].length;
            var prefix = Math.floor(neededChars / 2);
            stringArray[i] = (" ".repeat(prefix)) + stringArray[i] + (" ".repeat((neededChars - prefix)));
        }
        else if (stringArray[i].length > longest) {
            stringArray[i] = stringArray[i].substring(0, longest);
        }
    };
}