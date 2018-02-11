function selectRandomElements(list, maximumToReturn) {
    if(list == null || list.length == 0) {
        alert("No elements found to choose from.");
    }

    if(list.length <= maximumToReturn) {
        return list;
    }

    var selectedElements = [];
    for (i = 0; i < DefaultRiddlesPerGame; i++) {
    	selectedElements.push(list[i]);
    }

    return selectedElements;
}

function shuffle(list) {
	// random index, scanning value, i
    var randIdx, scanValue, i;
    for (i = list.length-1; i > 0 ; i--) {
    	// find some random index
        randIdx = Math.floor(Math.random() * i);
        //grab current values, scanning from the end
        scanValue = list[i];
        // switch the random value with the current value
        list[i] = list[randIdx];
        list[randIdx] = scanValue;
    }
}
