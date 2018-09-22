var DefaultRiddlesPerGame = 7;
var riddles = null;
var games = null;
var currentGame = null;
logDetailed("Before Initial Games and Riddles");
GetRiddles();
GetGames();
logDetailed("After Initial Games and Riddles");

function notNullOrWhitespace(string) {
    return string && string.trim().length > 0;
}

function padEnd(initialString,targetLength,padString) {
    targetLength = targetLength>>0; //floor if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if(!initialString) {
        return padString.repeat(targetLength);
    }

    if (initialString.length > targetLength) {
        return String(initialString);
    }
    else {
        targetLength = targetLength-initialString.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
        }
        return String(initialString) + padString.slice(0,targetLength);
    }
}

function getQueryString(field) {
    var queryStrings = window.location.href.split('?')[1];
    if(queryStrings) {
        var pairsAsArray = queryStrings.split("&");
        if(pairsAsArray) {
            for(var i = 0; i < pairsAsArray.length; i++) {
                var pair = pairsAsArray[i].split("=");
                if(pair && pair[0].toUpperCase() === field.toUpperCase()) {
                    return pair[1];
                }
            }
        }
    }
    return null;
}

function GoToServerPage() {
    var gameId = Math.random().toString(36).replace(/[^a-z]+/g, '').toUpperCase().substr(0, 5);
    window.location = `server.html?gameId=${gameId}`;
}

function GetGamesThenGoToClientPage() {
    logDetailed("Getting Games");
    GetJson('Games', toClientPage);
}

function toClientPage() {
    logDetailed("Getting ready to go to client page.");
    gameId = document.getElementById('game-id-input').value;
    var gameExists = doesGameExist(gameId);
    name = document.getElementById('player-name-input').value;
    document.getElementById('primary-display-text-label').innerHTML = "Test Text Should See...";
    logDetailed("name " + name);
    if(name && gameExists)
    {
        window.location = `client.html?playerName=${name}&gameId=${gameId}`;
    }
    else
    {
        var displayText = document.getElementById('primary-display-text-label');
        displayText.innerHTML = "";
        if(!name)
        {
            displayText.innerHTML += "You need like, a name dude... ";
        }
        if(!gameExists)
        {
            displayText.innerHTML += "That game doesn't exist.";
        }
    }
}

function doesGameExist(gameId)
{
     for(var i = 0; i < games.length; i++) {
         logDetailed("gameId: " + games[i].id);
         if(games[i].id === gameId) {
             return true;
         }
     }
     return false;
}

function displayDebuggingButtons(className) {
     var buttons = document.getElementsByClassName(className);
     for(var i = 0; i < buttons.length; i++) {
         toggleVisibleAndHidden(buttons[i]);
     }
}

function toggleVisibleAndHidden(element) {
    if(element.style.visibility == 'visible') {
        element.style.visibility = 'hidden';
    }
    else {
        element.style.visibility = 'visible';
    }
}

function toggleHtmlDisplayAttributes(className) {
     var buttons = document.getElementsByClassName(className);
     logDetailed("Changing displays: " + buttons.length);
     logDetailed("does this even show up!?!?!?!?!?!?!?!??!?!?!?!");
     for(var i = 0; i < buttons.length; i++) {
         toggleHtmlDisplayAttribute(buttons[i]);
     }
}

function toggleHtmlDisplayAttribute(element) {
    if(element.style.display == 'inline') {
        logDetailed("switching " + element.innerHTML + " to " + "none");
        element.style.display = 'none';
    }
    else {
        logDetailed("switching " + element.innerHTML + " to " + "inline");
        element.style.display = 'inline';
    }
}

function changeHtmlDisplayAttributes(className, displaySetting) {
     var buttons = document.getElementsByClassName(className);
     logDetailed("buttons: " + buttons.length);
     logDetailed("random2");
     logDetailed("Changing '" + className + "' displays: " + buttons.length);
     for(var i = 0; i < buttons.length; i++) {

         logDetailed("  setting '" + buttons[i].id + "' to " + displaySetting);
         buttons[i].style.display = displaySetting;
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
        logDetailed("Changing Body Span: " + currentInnerHtml.substring(0, matchLength));
        logDetailed("Changing Body Span: " + innerHtml.substring(0, matchLength));
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

logDetailed("main.js loaded");