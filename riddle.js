function Riddle(riddleAsArray) {
   this.id = riddleAsArray[0];
   this.question = riddleAsArray[1];
   this.answer = riddleAsArray[2];
   this.units = riddleAsArray[3];
   this.funfact = riddleAsArray[4];
   this.sourcename = riddleAsArray[5];
   this.source = riddleAsArray[6];
   this.sourcetype = riddleAsArray[7];
   this.sourceyear = riddleAsArray[8];
   this.creationdate = riddleAsArray[9];
   this.createdby = riddleAsArray[10];
   this.lastuseddate = riddleAsArray[11];
}

Riddle.prototype.addGroup = function(newGroupName, ctx) {
	this.currentgroup = new InputGroup(newGroupName, ctx);
}