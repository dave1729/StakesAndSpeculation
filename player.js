function Player(playerName) {
  this.name = playerName;
  this.color = null;
  this.answers = [];
  this.bets = [];
  this.money = 0;
}

function firstPlayerUpToDateWithSecondPlayer(somePlayer, localCopyOfPlayer) {
    if(localCopyOfPlayer == null || localCopyOfPlayer.color == null) {
        return null;
    }

    if(localCopyOfPlayer.answers.length > somePlayer.answers.length) {
        return "localCopyOfPlayer.answers.length " + localCopyOfPlayer.answers.length +
         " > somePlayer.answers.length " + somePlayer.answers.length;
    }

    for(var i = 0; i < somePlayer.answers.length; i++) {
        if(localCopyOfPlayer.answers[i] != somePlayer.answers[i]) {
            return "localCopyOfPlayer.answers[i] " + localCopyOfPlayer.answers[i] +
                     " != somePlayer.answers[i] " + somePlayer.answers[i];
        }
    }


    if(localCopyOfPlayer.bets.length > somePlayer.bets.length) {
            return "localCopyOfPlayer.bets.length " + localCopyOfPlayer.bets.length +
                     " > somePlayer.bets.length " + somePlayer.bets.length;
    }

    for(var i = 0; i < somePlayer.bets.length; i++) {
        if(localCopyOfPlayer.bets[i] != somePlayer.bets[i]) {
            return null;
        }
    }

    return null;
}