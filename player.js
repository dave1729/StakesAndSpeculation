function Player(playerName) {
  this.name = playerName;
  this.color = null;
  this.money = [];
  this.answers = [];
  this.bets = [];
}

function firstPlayerUpToDateWithSecondPlayer(somePlayer, localCopyOfPlayer) {
    log("Comparing Players " + JSON.stringify(somePlayer) + " and " + JSON.stringify(localCopyOfPlayer));

    if(localCopyOfPlayer == null || localCopyOfPlayer.color == null) {
        return null;
    }

    var upToDateMessage = checkThatListOneIsUpToDateWithListTwo(somePlayer.answers, localCopyOfPlayer.answers, "answers");
    if(upToDateMessage != null) {
        return upToDateMessage;
    }

    var upToDateMessage = checkThatListOneIsUpToDateWithListTwo(somePlayer.money, localCopyOfPlayer.money, "money");
    if(upToDateMessage != null) {
        return upToDateMessage;
    }

    if(localCopyOfPlayer.bets.length > somePlayer.bets.length) {
            return "localCopyOfPlayer.bets.length " + localCopyOfPlayer.bets.length +
                     " > somePlayer.bets.length " + somePlayer.bets.length;
    }

    for(var i = 0; i < somePlayer.bets.length; i++) {
        if(localCopyOfPlayer.bets[i] != somePlayer.bets[i]) {
            return "localCopyOfPlayer.bets[i] " + localCopyOfPlayer.bets[i].playerColor + localCopyOfPlayer.bets[i].amount +
                     " != somePlayer.bets[i] " + somePlayer.bets[i].playerColor + somePlayer.bets[i].amount;
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
        if(foreignList[i] != localList[i]) {
            return listName + ": localList[i] " + localList[i] +
                     " != foreignList[i] " + foreignList[i];
        }
    }

    return null;
}