function Game(gameAsArray) {
   this.id = gameAsArray[0];
   this.question = gameAsArray[1];
   this.answer = gameAsArray[2];
   this.units = gameAsArray[3];
   this.funfact = gameAsArray[4];
   this.sourcename = gameAsArray[5];
   this.source = gameAsArray[6];
   this.sourcetype = gameAsArray[7];
   this.sourceyear = gameAsArray[8];
   this.creationdate = gameAsArray[9];
   this.createdby = gameAsArray[10];
   this.lastuseddate = gameAsArray[11];
}