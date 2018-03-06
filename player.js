function Player(playerName) {
  this.name = playerName;
  this.color = null;
  this.answers = [];
  this.money = [];
  this.bets = [];
  this.winnings = [];
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
            return "localCopyOfPlayer.bets[i] " + localCopyOfPlayer.bets[i] +
                     " != somePlayer.bets[i] " + somePlayer.bets[i];
        }
    }

    return null;
}

function checkThatListOneIsUpToDateWithListTwo(foreignList, localList, listName) {
    if(localList.length > foreignList.length) {
            return listName + ": localList.length " + localList.length +
                     " > foreignList.length " + foreignList.length;
    }

    for(var i = 0; i < foreignList.length; i++) {
        console.log(listName + "localList[i] " + localList[i] + " != foreignList[i] " + foreignList[i] + " RESULT " + (foreignList[i] != localList[i]));
        if(foreignList[i] != localList[i]) {
            return listName + "localList[i] " + localList[i] +
                     " != foreignList[i] " + foreignList[i];
        }
    }

    return null;
}