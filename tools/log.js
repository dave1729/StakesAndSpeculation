var includeDetailedLogs = false;

function log(theString) {
    console.log(theString);
}

function logDetailed(theString) {
    if(includeDetailedLogs) console.log(theString);
}