function test0() {
    testName = "checkThatListOneIsUpToDateWithListTwo";
    var listOne = [];
    var listTwo = [];
    listOne.push("hello");
    listTwo.push("hello");
    var upToDate = checkThatListOneIsUpToDateWithListTwo(listOne, listTwo, "testlist");
    listTwo.push("hola");
    var notUpToDate = checkThatListOneIsUpToDateWithListTwo(listOne, listTwo, "testlist");
    listOne.push("hola");
    var upToDateAgain = checkThatListOneIsUpToDateWithListTwo(listOne, listTwo, "testlist");
    listTwo[1] = "hole";
    var notUpToDateAgain = checkThatListOneIsUpToDateWithListTwo(listOne, listTwo, "testlist");

    if (upToDate != null) {
        testResult = "fail, reason; upToDate-" + upToDate;
    }
    else if (notUpToDate == null) {
        testResult = "fail, reason; notUpToDate-" + notUpToDate;
    }
    else if (upToDateAgain != null) {
        testResult = "fail, reason; upToDateAgain-" + upToDateAgain;
    }
    else if (notUpToDateAgain == null) {
        testResult = "fail, reason; notUpToDateAgain-" + notUpToDateAgain;
    }
    else {
        testResult = "pass";
    }

    return testResult + " ; " + testName;
}

function test1() {
    var testName = "getWinningMultiplier";

    var multiplierArray = getWinningMultiplierArray(0);
    logDetailed(("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(1);
    logDetailed(("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(2);
    logDetailed(("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(3);
    logDetailed(("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(4);
    logDetailed(("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(5);
    logDetailed(("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(6);
    logDetailed(("winning multiplier array: " + multiplierArray);

    var index = 1;
    var array = getWinningMultiplierArray(5);

    if (array[index] === 3) {
        testResult = "pass";
    }
    else {
        testResult = "fail, reason; WinningMultiplier is " + array[index] + " in " + array;
    }

    return testResult + " ; " + testName;
}

function test2() {
    var testName = "subtraction operator";

    var totalBets = parseIntOrDefault(2, 0);

    logDetailed(("totalBets: " + totalBets);
    var totalWinnings = parseInt(6);

    logDetailed(("totalWinnings: " + totalWinnings);

    var money = parseInt(totalWinnings) - parseInt(totalBets);

    logDetailed(("money: " + money);

    var result = Math.max(money, 0);

    if (result == 4) {
        testResult = "pass";
    }
    else {
        testResult = "fail, reason; result is " + result;
    }

    return testResult + " ; " + testName;
}

function test3() {
    testName = "testing forEach loops";

    var arrayOfArrays = [];
    arrayOfArrays.push([1, 2, 3, 4]);
    arrayOfArrays.push([5, 6, 7, 8]);

    logDetailed(("before: " + arrayOfArrays);

    arrayOfArrays.forEach(function(x) {
        logDetailed(("x: " + x[1]);
        x[1] = x[1] + 1;
        logDetailed(("x: " + x[1]);
    });

    logDetailed(("after: " + arrayOfArrays);

    var result = arrayOfArrays[1][1];
    if (result == 7) {
        testResult = "pass";
    }
    else {
        testResult = "fail, reason; result is " + result;
    }

    return testResult + " ; " + testName;
}

function test4() {
    var emptyArray = [];
    logDetailed((emptyArray);
    emptyArray[2] = "thing";

    logDetailed((emptyArray);


    testName = "testing game de-serialization";
    var gameBefore = new Game({id: "qwerty"});

    var serializedGame = JSON.stringify(gameBefore);
    var backToObject = JSON.parse(serializedGame);
    var gameAfter = new Game(backToObject);

    var result = gameAfter.displayGameId(2);
    if (result == "erty") {
        testResult = "pass";
    }
    else {
        testResult = "fail, reason; result is " + result;
    }

    return testResult + " ; " + testName;
}

function runTests() {
    var testResults = "";
    var testNumber = 0;
    var testsComplete = false;
    while(!testsComplete) {
        testName = "";
        testResult = "";
        try {
            testResults += "Test" + testNumber + " " + eval("test" + testNumber + "()") + "<br>";
        } catch (err) {
            if(err.message == ("test" + testNumber + " is not defined")) {
                testsComplete = true;
            }
            else {
                testResults += "Test" + testNumber + " ERROR: " + err.message + ". LineNumber: " + err.lineNumber + "<br>";
            }
        }
        testNumber++;
    }
    document.getElementById("test-span").innerHTML = testResults;
}

var testName = "";
var testResult = "";