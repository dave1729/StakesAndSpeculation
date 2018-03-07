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
    var x = [];
    x[2] = 22;
    console.log(x[2].toString());
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