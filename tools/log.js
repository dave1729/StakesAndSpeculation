var includeDetailedLogs = true;

function log(theString) {
    console.log(theString);
}

function logDetailed(theString) {
    if(includeDetailedLogs) console.log(theString);
}