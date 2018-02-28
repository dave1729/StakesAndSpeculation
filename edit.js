function addRiddleInterface() {
    var innerHtml = "";
    innerHtml += labelAndInputForRiddleMember("Question", "", 80);
    innerHtml += labelAndInputForRiddleMember("Answer", "", 20);
    innerHtml += labelAndInputForRiddleMember("Units", "(%,lbs,feet,meters,people,etc.)");
    innerHtml += labelAndInputForRiddleMember("Fun Fact", "", 80);
    innerHtml += labelAndInputForRiddleMember("Source Name", "(e.g. Wikipedia)", 40);
    innerHtml += labelAndInputForRiddleMember("Source", "(actual url)", 80);
    innerHtml += labelAndInputForRiddleMember("Source Type", "(website,etc)", 20);
    innerHtml += labelAndInputForRiddleMember("Source Date", "(YYYY)", 20);
    innerHtml += labelAndInputForRiddleMember("Created By", "(FirstName LastInitial)", 40);
    innerHtml += '<button type="button" id="submit-input-button" onclick="addRiddle()" >Add Riddle</button><br>';
    innerHtml += '<br><label id="delete-input-label">Delete Question With This ID </label><input type="text" id="delete-input"><br>';
    innerHtml += '<button type="button" id="delete-input-button" onclick="deleteRiddle()" >Delete Riddle by ID</button>';
    document.getElementById("body-span").innerHTML = innerHtml;
}

function labelAndInputForRiddleMember(userFriendlyMemberName, clarification, size) {
    var memberName = userFriendlyMemberName.toLowerCase().replace(" ", "");

    var inputType = "text";
    if(memberName.includes("date")) inputType = "date";

    return '<label id="' + memberName + '-input-label">' +
    userFriendlyMemberName + clarification + " " +
    '</label><input type="' + inputType + '" id="' +
    memberName + '-input" size="' + size + '"><br>';
}

function addRiddle() {
    GetJson("Riddles", updateRiddles);
}

function deleteRiddle() {
    var id = document.getElementById("delete-input").value;
    for(var i = 0; i < riddles.length; i++) {
        if(riddles[i].id == id) {
            riddles.splice(i,1);
            break;
        }
    }

    SaveRiddles();
}

function updateRiddles() {
    riddles.sort(
        function(riddle1, riddle2){
            return riddle1.id - riddle2.id;
        }
    );

    var lastId = riddles[riddles.length-1].id;

    var newRiddle = {};
    newRiddle.id = parseInt(lastId) + 1;
    newRiddle.question = document.getElementById("question-input").value;
    newRiddle.answer = document.getElementById("answer-input").value;
    newRiddle.units = document.getElementById("units-input").value;
    newRiddle.funfact = document.getElementById("funfact-input").value;
    newRiddle.sourcename = document.getElementById("sourcename-input").value;
    newRiddle.source = document.getElementById("source-input").value;
    newRiddle.sourcetype = document.getElementById("sourcetype-input").value;
    newRiddle.sourceyear = document.getElementById("sourcedate-input").value;
    newRiddle.creationdate = Date.now();
    newRiddle.createdby = document.getElementById("createdby-input").value;
    newRiddle.lastuseddate = 0;

    riddles.push(newRiddle);
    SaveRiddles();
}