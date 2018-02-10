var DefaultRiddlesPerGame = 14;

var riddles = [];
var games = [];
var currentGame = Game(null);
GetGames();
GetRiddles();

function DisplayDebuggingButtons() {
    ToggleVisibleAndHidden('get-riddles-button');
    ToggleVisibleAndHidden('save-riddles-button');
    ToggleVisibleAndHidden('display-riddles-button');
    ToggleVisibleAndHidden('get-games-button');
    ToggleVisibleAndHidden('save-games-button');
    ToggleVisibleAndHidden('erase-games-button');
    ToggleVisibleAndHidden('display-games-button');
    ToggleVisibleAndHidden('display-test-text-label');
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