//Input Manager takes the context to draw on
//and the name of your first InputGroup
//InputManager(context, String)
function InputManager(firstGroupName, ctx) {
    this.inputgroup_list = [];
    this.ctx = ctx;
    this.currentgroup = new InputGroup(firstGroupName, ctx);
    this.inputgroup_list.push(this.currentgroup);
}

//Adds a new group and switches to it, like right stat now! ;-)
//addGroup(String)
InputManager.prototype.addGroup = function(newGroupName, ctx) {
	this.currentgroup = new InputGroup(newGroupName, ctx);
	this.ctx = ctx;
	this.inputgroup_list.push(this.currentgroup);
}

//add a new input to the current group
//addInput(Input)
InputManager.prototype.addInput = function(theInput) {
	this.currentgroup.addInput(theInput);
}

//initiates the mouse for this group
//addMouse()
InputManager.prototype.addMouse = function() {
	this.currentgroup.addMouse();
}

//sets an input command to false(to stop a motion with a command)
//returns false if not in current group
//setFalse(String)
InputManager.prototype.setFalse = function(theName) {
	for(var i = 0; i < this.currentgroup.input_list.length; i++) {
		if(this.currentgroup.input_list[i].name === theName) {
			this.currentgroup.input_list[i].isPressed = false;
		}
	}
}

//sets all inputs in the current group to false(aka isPressed = false)
//setAllFalse()
InputManager.prototype.setAllFalse = function() {
	for(var i = 0; i < this.currentgroup.input_list.length; i++) {
		this.currentgroup.input_list[i].isPressed = false;
		this.currentgroup.mouseUp = false;
		this.currentgroup.mouseDown = false;
		this.currentgroup.mouseLocation = undefined;
	}
}

//returns a boolean value used to check key presses
//checkInput(string)
InputManager.prototype.checkInput = function(theName) {
	var initiated = false;
	for(var i = 0; i < this.currentgroup.input_list.length; i++) {
		if(this.currentgroup.input_list[i].name === theName) {
			initiated = this.currentgroup.input_list[i].isPressed;
		}
	}
	return initiated;
}

//returns a boolean value used to check if the
//mouse or clicks are being used on the current group
//checkMouse()
InputManager.prototype.checkMouse = function() {
	return this.currentgroup.isUsingMouse;
}

//returns the left click
//getClick()
InputManager.prototype.mouseDown = function() {
	if(this.currentgroup.isUsingMouse) {
		//var bool = this.currentgroup.mouseDown;
		//this.currentgroup.mouseDown = false;
		return this.currentgroup.mouseDown;
	}
	return null;
}

//returns the left click
//getClick()
InputManager.prototype.mouseUp = function() {
	if(this.currentgroup.isUsingMouse) {
		//var bool = this.currentgroup.mouseUp;
		//this.currentgroup.mouseUp = false;
		return this.currentgroup.mouseUp;
	}
	return null;
}

//returns the right click
//getRClick()
//InputManager.prototype.getRClick = function() {
//	if(this.currentgroup.isUsingMouse) {
//		return this.currentgroup.rClick;
//	}
//	return null;
//}

//returns the moving mouse position
//getMouse()
InputManager.prototype.mouseLocation = function() {
	if(this.currentgroup.isUsingMouse) {
		return this.currentgroup.mouseLocation;
	}
	return null;
}

//iterates forward through the groups, resets to beginning if you iterate
//past the last group. Default iterations is 1 iteration if given no input
//iterateGroupBy(int or nothing)
InputManager.prototype.iterateGroupBy = function(iterations = 1) {
	var currentGroupIndex;
	for(var i = 0; i < this.inputgroup_list.length; i++) {
		if(this.inputgroup_list[i].name === this.currentgroup.name) {
			currentGroupIndex = i;
		}
	}
	this.currentGroupIndex = ((currentGroupIndex + iterations) % this.inputgroup_list.length);
	this.currentgroup = this.inputgroup_list[currentGroupIndex];
	this.ctx = this.currentgroup.ctx;
}

//Changes the current group to the one with the passed name
//changeCurrentGroupTo(String)
InputManager.prototype.changeCurrentGroupTo = function(groupName) {
	var currentGroupIndex;
	for(var i = 0; i < this.inputgroup_list.length; i++) {
		if(this.inputgroup_list[i].name === groupName) {
			this.currentgroup = this.inputgroup_list[i];
			this.ctx = this.currentgroup.ctx;
			return;
		}
	}
}

//Sets Event Listeners to by used by the context passed on creation
//start()
InputManager.prototype.start = function () {
	var that = this;

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        return { x: x, y: y };
    }

    //event listeners are added here

    this.currentgroup.ctx.canvas.addEventListener("mousedown", function (e) {
        if(that.currentgroup.isUsingMouse) {
			that.currentgroup.mouseLocation = getXandY(e);
			that.currentgroup.mouseDown = true;
			that.currentgroup.mouseUp = false;
		}
    }, false);

    this.currentgroup.ctx.canvas.addEventListener("mouseup", function (e) {
        if(that.currentgroup.isUsingMouse) {
			that.currentgroup.mouseLocation = getXandY(e);
			that.currentgroup.mouseUp = true;
			that.currentgroup.mouseDown = false;
		}
    }, false);

//    this.currentgroup.ctx.canvas.addEventListener("contextmenu", function (e) {
//        if(that.currentgroup.isUsingMouse) {
//			that.currentgroup.mouseLocation = getXandY(e);
//		}
//        e.preventDefault();
//    }, false);

    this.currentgroup.ctx.canvas.addEventListener("mousemove", function (e) {
        //logDetailed(e);
        if(that.currentgroup.isUsingMouse) {
			that.currentgroup.mouseLocation = getXandY(e);
		}
    }, false);

//    this.currentgroup.ctx.canvas.addEventListener("mousewheel", function (e) {
//        //logDetailed(e);
//        that.wheel = e;
//        //logDetailed("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
//    }, false);

    this.currentgroup.ctx.canvas.addEventListener("keydown", function (e) {
		for(var i = 0; i < that.currentgroup.input_list.length; i++) {
			if(that.currentgroup.input_list[i].charCode === e.which) {
				that.currentgroup.input_list[i].isPressed = true;
			}
		}
    }, false);

    // this.ctx.canvas.addEventListener("keypress", function (e) {
        // that.chars[e.code] = true;
        // logDetailed(e);
        // logDetailed("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    // }, false);
//
// this could be problematic....
    this.currentgroup.ctx.canvas.addEventListener("keyup", function (e) {
		for(var i = 0; i < that.currentgroup.input_list.length; i++) {
			if(that.currentgroup.input_list[i].charCode === e.which) {
				that.currentgroup.input_list[i].isPressed = false;
			}
		}
    }, false);

    logDetailed('Input started');
}

//Input Group, holds just  name and list of Inputs
//InputGroup(String)
function InputGroup(theName, ctx) {
	this.name = theName;
	this.ctx = ctx;
    this.input_list = [];
    this.isUsingMouse = false;
    this.mouseDown = false;
    this.mouseUp = false;
    this.mouseLocation = undefined;
}

//adds a new input to the input group
//addInput(Input)
InputGroup.prototype.addInput = function(theInput) {
	this.input_list.push(theInput);
}


//adds a new mouse/clicks to the input group
//addMouse())
InputGroup.prototype.addMouse = function() {
	this.isUsingMouse = true;
}

//Sends an alert that shows the current group
InputGroup.prototype.printGroupAsAlert = function() {
	for(var i = 0; i < this.input_list.length; i++) {
		alert(this.input_list[i].name + " " + this.input_list[i].charCode + " " + this.input_list[i].isPressed);
	}
}

//Input is a name a character and isPressed defaults to false
//Input(string, char)
function Input(theName, theChar) {
    this.name = theName;
    this.charCode = theChar.charCodeAt(0) - 32;
    this.isPressed = false;
}