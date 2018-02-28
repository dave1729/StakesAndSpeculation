function Player(playerName, playerColor) {
  this.name = playerName;
  this.color = null;
  this.answers = [];
  this.bets = [];
  this.money = 0;
}

function firstPlayerUpToDateWithSecondPlayer(somePlayer, localCopyOfPlayer) {
    if(localCopyOfPlayer == null || localCopyOfPlayer.color == null) {
        true;
    }

    if(localCopyOfPlayer.answers.length > somePlayer.answers.length) {
        return false;
    }

    for(var i = 0; i < somePlayer.answers.length; i++) {
        if(localCopyOfPlayer.answers[i] != somePlayer.answers[i]) {
            return false;
        }
    }


    if(localCopyOfPlayer.bets.length > somePlayer.bets.length) {
        return false;
    }

    for(var i = 0; i < somePlayer.bets.length; i++) {
        if(localCopyOfPlayer.bets[i] != somePlayer.bets[i]) {
            return false;
        }
    }

    return true;
}