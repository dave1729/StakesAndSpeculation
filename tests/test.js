function test0() {
    var testName = "checkThatListOneIsUpToDateWithListTwo";
    var testResult = "";
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
    var multiplierArray = getWinningMultiplierArray(0);
    log("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(1);
    log("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(2);
    log("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(3);
    log("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(4);
    log("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(5);
    log("winning multiplier array: " + multiplierArray);
    var multiplierArray = getWinningMultiplierArray(6);
    log("winning multiplier array: " + multiplierArray);

    var testName = "getWinningMultiplier";
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

function runTests() {
    var testResults = "";
    var testNumber = 0;
    var testsComplete = false;
    while(!testsComplete) {
        try {
            testResults += "Test" + testNumber + " " + eval("test" + testNumber + "()") + "<br>";
        } catch (err) {
            if(err.message == ("test" + testNumber + " is not defined")) {
                testsComplete = true;
            }
            else {
                testResults += "Test" + testNumber + " ERROR: " + err.message + "<br>";
            }
        }
        testNumber++;
    }
    document.getElementById("test-span").innerHTML = testResults;
}