/* ----- INITIATE VARIABLES -----*/

var latitude=0;
var longitude=0;
var longLat=longitude.toString(10)+","+latitude.toString(10);
var roomDesc="";
var northTravel=false;
var southTravel=false;
var eastTravel=false;
var westTravel=false;
var errorMessage="You cannot go that way.";
var noError="";
var doorStatus=false;


/* SET VARIABLES TO CURRENT longLat WHEN WINDOW HAS LOADED */

window.onload = function() {
  resetDirections();
  refreshDesc();
  addItems();
  //document.getElementById("latitudeText").innerHTML=latitude;
  //document.getElementById("longitudeText").innerHTML=longitude;
  //document.getElementById("longLatText").innerHTML=longLat;
  document.getElementById("descriptionText").innerHTML=roomDesc;
  console.log(latitude);
  console.log(longitude);
  console.log(longLat);
  // var commandForm=document.getElementById('commandForm');
  // commandForm.onsubmit=submitForm;
}


/*------ TEXT CREATION TOOLS ------*/
function createPara(textContent){
    var node = document.createElement("P");                  // Create a <p> node
    // var textnode = document.createTextNode(textContent);     // Create a text node
    // node.appendChild(textnode);                              // Append the text to <p>
    node.setAttribute('class', 'temporaryPara');
    document.getElementById("lowerMarker").appendChild(node);// Append <p> to <p> with id="lowerMarker"
    node.innerHTML=textContent;
}
/*------ CONSOLE CONTROLS-----*/

// Initiate form variable on window load
function commandInit(){
  var commandForm=document.getElementById('commandForm');
  commandForm["commandBox"].focus();
  commandForm["commandBox"].select();
  commandForm.onsubmit=submitForm;
}
window.addEventListener("load", commandInit);

/****------  COMMAND PARSER  -----****/

// *** Re-usable utility functions for command parser ***//

// General compare input to string function //

function compareToInput(){

}

//HTML span elements for use in text
function warningMild(text){
  return `<span class="warningMild">${text}</span>`;
}
let endSpan=`</span>`;
function itemMild(text){
  return `<span class="itemMild">${text}</span>`;
}

//General compare longLat to object location //

function atLongLat(item){
    if(longLat===item.location) {
      return true;
    }
    else {
      return false;
    }
}

//General function to check if item is in inventory
function itemInInventory (item){
  if(item.inInventory===false){
    return false;
  }
  else {
    return true;
  }
}
//General function - returns true if item is *not* in inventory
function notInInventory (item){
  if(item.inInventory===false){
    return true;
  }
  else {
    return false;
  }
}

//General function to find a prop

function findProp(parsedProp){
  for(let n=0;n<propArray.length;n++){
    if (propArray[n].alias==parsedProp){
      console.log("Found prop" + propArray[n]);
      return propArray[n];
    }
  }
}

// *** Parsed Command Handlers *** //

// Pickup Handler
function pickUpHandler(parsedNoun){
  console.log("Pick up handler active.")
  var n = 0;
  function pickUpLoop(){
    //Create 'item' shorthand for current object in array
    var item=objectArray[n];
    //Check if this item is the parsedNoun
    if (parsedNoun===item.alias){
      console.log("Found object specified - " + item.alias + ", " + item.specifier);
      //Check if this item is not in the inventory and is at the current location - if so, pick it up
      if (atLongLat(item) && notInInventory(item)){
        item.inInventory=true;
        refreshDesc();
        createPara(`${warningMild("You pick up the ")}${itemMild(item.name)}.`);
      }
      //if the item is not in the inventory, but is not at the current location, create a specific error message.
      else if (notInInventory(item)){
        createPara(`${warningMild("There is no ")}${itemMild(item.alias.toLowerCase())}${warningMild(" here.")}`);
      }
      //if you are already carrying the item, create a message saying that.
      else if (atLongLat(item) && itemInInventory(item)){
        createPara(`${warningMild("You are already carrying a ")}${itemMild(item.name)}${warningMild(". There is no other ")}${itemMild(item.alias.toLowerCase())}${warningMild(" here.")}`);
      }
    }
    //Loop again if the array isn't complete
    else if (n<(objectArray.length-1)){
      n++;
      pickUpLoop();
    }
    //Give a console log if the noun isn't found.
    else if (n==(objectArray.length-1)){
      console.log("Noun not found - "+ parsedNoun);
      createPara("I don't know what that is.")
    }
  }
  pickUpLoop();
}

//Drop Handler

function dropHandler(parsedNoun){
  console.log("Drop handler active.")
  var n = 0;
  function dropLoop(){
    //Create shorthand for current object in array
    var item=objectArray[n];
    if (parsedNoun===item.alias){
      console.log("Found object specified - " + item.alias + ", " + item.specifier);
      if (atLongLat(item) && itemInInventory(item)){
        item.inInventory=false;
        createPara(`${warningMild("You drop the ")}${itemMild(item.name)}.`);
      }
      else if (atLongLat(item) && notInInventory(item)){
        createPara(`${warningMild("You are not carrying the ")}${itemMild(item.alias.toLowerCase())}.`);
      }
      else if (notInInventory(item)){
        createPara(`${warningMild("You are not carrying a ")}${itemMild(item.alias.toLowerCase())}.`);
      }
    }
    else if (n<(objectArray.length-1)){
      n++;
      console.log("Looping drop, n="+n+", object alias will be "+item.alias);
      dropLoop();
    }
    else if (n==(objectArray.length-1)){
      console.log("Not in inventory - "+ parsedNoun);
      createPara("You are not carrying a "+item.alias.toLowerCase());
    }
  }
  dropLoop();
}

//Use Handler

function useHandler(parsedVerb, parsedNoun, parsedProp){
  console.log("Use handler active.")
  var n = 0;
  function useLoop(){
    //Create shorthand for current object in array
    var item=objectArray[n];
    if (parsedNoun===item.alias){
      console.log("Found object specified - " + item.alias + ", " + item.specifier);
      if (atLongLat(item) && itemInInventory(item)){
        let matchedProp=findProp(parsedProp);
        console.log("trying to use prop");
        if (matchedProp){
          matchedProp.use(parsedVerb,matchedProp.alias,matchedProp.specifier,item);
          console.log("should have used prop");
        }
        else {
          item.use(parsedVerb,item.alias,item.specifier,item);
        }
      }
      else if (atLongLat(item) && notInInventory(item)){
        createPara(`${warningMild("You are not carrying the ")}${itemMild(item.alias.toLowerCase())}.`);
      }
      else if (notInInventory(item)){
        createPara(`${warningMild("You are not carrying a ")}${itemMild(item.alias.toLowerCase())}.`);
      }
    }
    else if (n<(objectArray.length-1)){
      n++;
      console.log("Looping use, n="+n+", object alias will be "+item.alias);
      useLoop();
    }
    else if (n==(objectArray.length-1)){
      console.log("Not in inventory - "+ parsedNoun);
      let matchedProp=findProp(parsedProp);
      if (matchedProp){
        matchedProp.use(parsedVerb);
      }
    // Generic message for prop use - now inactive
      //createPara("Nothing happens to the "+matchedProp.alias.toLowerCase()+".");
    }
  }
  useLoop();
}

//Initiate verb variables
var regexPickUp = /.*((PICK UP)|(TAKE)|(PICKUP)).*/;
var regexDrop = /.*((DROP)|(PUT DOWN)).*/;
var regexUse = /.*((USE)|(UTILISE)|(APPLY)|(OPEN)).*/;
var regexLock = /.*(LOCK).*/;
var regexUnlock = /.*(UNLOCK).*/;
var regexExamine = /.*(EXAMINE|INVESTIGATE|LOOK).*/;
var parsedVerb = null;

function testForVerb(input){
  //Clear parsedVerb variable
  parsedVerb=null;
  //Initiate count of the verbs
  var verbCount=0;

  // ----- TEST FOR VERBS ----- //

  //Re-usable regex function
  function regexVerbTest(regexVar,verbOutput){
    if (regexVar.test(input)===true){
      console.log(verbOutput+"listed for input of " + input);
      parsedVerb=verbOutput;
      verbCount++;
    }
  }
  //Test for verb commands
  regexVerbTest(regexPickUp,"PICKUP");
  regexVerbTest(regexDrop,"DROP");
  regexVerbTest(regexUse,"USE");
  //Test for Lock - expanded because must exlude UNLOCK
  if (regexLock.test(input)===true&&regexUnlock.test(input)===false){
    console.log("Lock command listed for input of " + input);
    parsedVerb="LOCK";
    verbCount++;
  }
  regexVerbTest(regexUnlock,"UNLOCK");
  regexVerbTest(regexExamine,"EXAMINE");

  // ----- Do things based on verb results -----//

  //Return the parsedVerb if only one verb has been counted.
  if (verbCount===1){
    return parsedVerb;
  }
  //Prompt the user if multiple verbs have been encountered.
  else if (verbCount>1){
    parsedVerb=null;
    createPara("That's a lot of verbs.")
  }
  //Console log if no verb is found.
  else if (verbCount===0){
    console.log("No verb found.")
  }
}

// ----- End Verb Parser ----- //

// ----- TEST FOR NOUNS  ----- //

//Initiate noun variables
var regexKey = /.*(KEY).*/;
var regexBook = /.*(BOOK).*/;
var regexGnome = /.*(GNOME).*/;
var parsedNoun = null;

function testForNoun(input){
  parsedNoun=null;
  //Clear parsedNoun variable
  parsedNoun=null;
  //Initiate count of the nouns
  var nounCount=0;
  // ----- TEST FOR NOUNS ----- //

  //Test for KEY noun
  if (regexKey.test(input)===true){
    console.log("Key found with name " + input);
    parsedNoun="KEY";
    nounCount++;
  }
  //Test for BOOK noun
  if (regexBook.test(input)===true){
    console.log("Book found with name " + input);
    parsedNoun="BOOK";
    nounCount++;
  }
  //Test for GNOME
  if (regexGnome.test(input)===true){
    console.log("Gnome found with name " + input);
    parsedNoun="GNOME";
    nounCount++;
  }

  // ----- Do things based on noun results -----//

  //Return the parsedNoun if only one noun has been counted.
  if (nounCount===1){
    return parsedNoun;
  }
  //Prompt the user if multiple nouns have been encountered.
  else if (nounCount>1){
    parsedNoun=null;
    createPara(`${warningMild("That's a lot of nouns.")}`)
  }
  //Console log if no noun is found
  else if (nounCount===0){
    console.log("No noun found.")
  }
}

// ----- End Noun Parser ----- //
// ----- TEST FOR PROPS  ----- //

//Initiate prop variables
var regexDoor = /.*(DOOR).*/;
var parsedProp = null;

function testForProp(input){
  parsedProp=null;
  //Clear parsedProp variable
  parsedProp=null;
  //Initiate count of the prop
  var propCount=0;
  // ----- TEST FOR PROP ----- //

  //Test for DOOR prop
  if (regexDoor.test(input)===true){
    console.log("Door found with name " + input);
    parsedProp="DOOR";
    propCount++;
  }

  // ----- Do things based on prop results -----//

  //Return the parsedProp if only one verb has been counted.
  if (propCount===1){
    return parsedProp;
  }
  //Prompt the user if multiple nouns have been encountered.
  else if (propCount>1){
    parsedProp=null;
    createPara("That's a lot of things.")
  }
  //Console log if no prop is found
  else if (propCount===0){
    console.log("No prop found.")
  }
}

// ----- End Prop Parser ----- //
// ----- COMMAND HANDLER ----- //

function submitForm(event){
  refreshDesc();
  // command = shortcut for capitalised user input
  var command = commandForm["commandBox"].value.toUpperCase();
  // Search string for accepted verbs and nouns
  console.log('Form submitted. Value:' + commandForm["commandBox"].value);
  testForVerb(command);
  testForNoun(command);
  testForProp(command);

  console.log("Parsed verb passed to submitForm with value of " + parsedVerb);
  if (parsedVerb==null){
    console.log("Parsed verb not available - value is " + parsedVerb)
  }

  console.log("Parsed noun passed to submitForm with value of " + parsedNoun);
  if (parsedNoun==null){
    console.log("Parsed noun not available - value is " + parsedNoun)
  }
  //combine verb and noun
  switch (parsedVerb) {
    case "PICKUP":
      if (parsedNoun===null) {
        createPara(`${warningMild("I'm not sure what to pick up")}`);
      }
      else {
        pickUpHandler(parsedNoun);
      }
    break;
    case "DROP":
      if (parsedNoun===null) {
        createPara(`${warningMild("I'm not sure what you want to drop.")}`);
      }
      else {
        dropHandler(parsedNoun);
      }
    break;
    //TODO: Add other verbs here, with parsedVerb passed in, to be handled by objects
    case "UNLOCK":
    case "LOCK":
    case "EXAMINE":
    case "USE":
      if (parsedNoun===null&&parsedProp===null) {
        createPara(`${warningMild("I'm not sure what you want to use.")}`);
        //Above, add dynamic to lower variable for the verb
      }
      else {
        useHandler(parsedVerb, parsedNoun, parsedProp);
    }
  }


  // Match to directions
  switch (command) {

    // Commands for North
    case "N":
    case "NORTH":
      goNorth();
    break;

    // Commands for East
    case "E":
    case "EAST":
      goEast();
    break;

    // Commands for South
    case "S":
    case "SOUTH":
      goSouth();
    break;

    // Commands for West
    case "W":
    case "WEST":
      goWest();
    break;

    //Pick up handler
    // case "PICK UP KEY":
    // case "PICK UP BLUE KEY":
    //   if (blueKey===false) {
    //     console.log("key input");
    //     if (longLat==='0,-1'){
    //       blueKey=true;
    //       console.log("key pickup");
    //       refreshDesc();
    //       createPara("You pick up the key.");
    //       //You pick up the Blue Key
    //     }
    //     else {
    //       console.log(longLat);
    //       console.log(longitude);
    //       console.log(latitude);
    //       console.log("wrong longLat");
    //       createPara("There is no key here.");
    //       //There is no key here.
    //     }
    //   }
    //   else {
    //     //You already have the blue key.
    //   }
    // break;
    // ---- Above is pick up handler ---- //
    //Use key
    // case "USE KEY":
    // case "USE KEY ON DOOR":
    // case "USE BLUE KEY":
    // case "USE BLUE KEY ON DOOR":
    //     if (blueKey===false) {
    //       createPara("You do not have a key");
    //     }
    //     else if (blueKey===true) {
    //       if (longLat==='0,0') {
    //         doorStatus=true;
    //         refreshDesc();
    //         createPara("You open the door to the North.");
    //       }
    //       else {
    //         createPara("There is nowhere to use the key.");
    //       }
    //     }
    // break;
    // case "PICK UP RED KEY":
    //   if (redKey.inInventory===false) {
    //     console.log("key input");
    //     if (longLat===redKey.location){
    //       redKey.inInventory=true;
    //       console.log("key pickup");
    //       refreshDesc();
    //       createPara("You pick up the red key.");
    //       //You pick up the Red Key
    //     }
    //     else {
    //       console.log(longLat);
    //       console.log(longitude);
    //       console.log(latitude);
    //       console.log("wrong longLat");
    //       createPara("There is no red key here.");
    //       //There is no key here.
    //     }
    // //   break;
    // }
  }
  commandForm.reset();
  event.preventDefault();
}





/* ----- CHECK DIRECTION AND MOVE ----- */

// Add 1 to latitude
function goNorth(){
  if (northTravel===true){
    latitude++;
    refreshDesc();
    updateItemLocation();
  }
  else {
    routeBlocked();
  }
}
// Minus 1 to latitude
function goSouth(){
  if (southTravel===true){
    latitude--;
    refreshDesc();
    updateItemLocation();
  }
  else {
    routeBlocked();
  }
}
// Add 1 to longitude
function goEast(){
  if (eastTravel===true){
    longitude++;
    refreshDesc();
    updateItemLocation();
  }
  else {
    routeBlocked();
  }
}
// Minus 1 to longitude
function goWest(){
  if (westTravel===true){
    longitude--;
    refreshDesc();
    updateItemLocation();
  }
  else {
    routeBlocked();
  }
}
/* ----- INVENTORY ----- */

var blueKey=false;
var objectArray = [null];

//Updates the location of items in the inventory (inInventory===true)
function updateItemLocation(){
  var n = 0;
  console.log("update item loc started");
  function itemLocLoop(){
    if (objectArray[n].inInventory===true){
      console.log("first if statement");
      console.log("Updating location of - " + objectArray[n].name);
      objectArray[n].location=longLat;
      n++;
      if(n<objectArray.length){
        itemLocLoop();
      }
    }
    else if ((n+1)<objectArray.length){
      console.log("second if statement, n =" + n);
      n++;
      itemLocLoop();
    }
    else if (n=objectArray.length){
      console.log("Inventory is empty");
    }
    // if (longLat===objectArray[n].location && objectArray.inInventory===false){
    //   createPara("There is a " + objectArray[n].name +" on the floor.");
    // }
  }
  itemLocLoop();
}

function addToArray(objectName,arrayName){
  console.log("Add to array initiated with " + objectName.name);
  var objectIndex=0;
  function arrayIterator(){
    console.log("arrayIterator started");
    if (arrayName[objectIndex]===null){
      arrayName[objectIndex]=objectName;
      console.log(arrayName[objectIndex]);
      console.log("Option 1");
    }
    else if ((objectIndex+1)===arrayName.length){
      arrayName.push(objectName);
      console.log(arrayName);
      console.log("Option 2");
    }
    else {
      console.log(arrayName[objectIndex]);
      console.log("Option 3");
      objectIndex++;
      arrayIterator();
    }
  }
  arrayIterator();
}
//Constructor function - blueprint for items
function Item(name, inInventory, location, alias, specifier){
  this.name=name;
  this.inInventory=inInventory;
  this.location=location;
  this.alias=alias;
  this.specifier=specifier;
}

//Variables to create items
var redKey = new Item("red key", false, "1,0", "KEY", "RED");
var gnome = new Item("small gnome", false, "0,-1", "GNOME", "SMALL");
var purpleBook = new Item("purple book", false, "1,0", "BOOK", "PURPLE");
var blueKey = new Item("blue key", false, "-1,0", "KEY", "BLUE");
//Extra item properties
redKey.use = function (verb, alias, specifier, item) {
  if (verb=="EXAMINE"){
    createPara(`${warningMild("It is a finely crafted key, with a rich red colour.")}`);
  }
}
gnome.use = function (verb, alias, specifier, item) {
  if (verb=="EXAMINE"){
    createPara(`${warningMild("It is a standard garden gnome, with a rather smug expression.")}`);
  }
  else if (verb=="USE"){
    createPara(`${warningMild("There is not much you can do with the gnome.")}`);
  }
}
purpleBook.use = function (verb, alias, specifier, item) {
  if (verb=="EXAMINE"){
    createPara(`${warningMild("It is a dusty and rather expensive looking purple tome.")}`);
  }
}

//Adds all objects to an array which can be looped in other functions
function addItems(){
  addToArray(redKey,objectArray);
  addToArray(gnome,objectArray);
  addToArray(purpleBook,objectArray);
  addToArray(redDoor,propArray);
  addToArray(blueKey,objectArray);
  itemRoomDesc();
  // if (longLat===purpleBook.location && purpleBook.inInventory===false){
  //   createPara("There is a red key on the floor.");
  // // }
  // console.log(purpleBook.name + purpleBook.inInventory + purpleBook.location);
}
//Adds paragraph if any item is in the room, but not in the inventory
function itemRoomDesc(){
  var n=0;
  function itemRoomLoop(){
    console.log("item room loop started, " + objectArray[n].location);
    if ((longLat===objectArray[n].location) && (objectArray[n].inInventory===false)){
      createPara(`There is a <span class="item"> ${objectArray[n].name} </span> on the floor.`);
    }
    if ((n+1)<objectArray.length){
      n++;
      itemRoomLoop();
    }
  }
  itemRoomLoop();
}

/*----- WORLD PROPS ----*/

var propArray = [null];

//Prototype object literal. With the
var redDoor = {
  locked: true,
  use: function(verb, alias, specifier, item) {
    console.log("Use function activated");
    if(item){
      if (redDoor.locked===true&&item.alias=="KEY"&&(verb=="UNLOCK"||verb=="USE")&&item.specifier=="RED"){
        redDoor.locked=false;
        refreshDesc();
        createPara(`${warningMild("You unlock the door.")}`);
      }
      else if (redDoor.locked===false&&item.alias=="KEY"&&(verb=="LOCK"||verb=="USE")&&item.specifier=="RED"){
        redDoor.locked=true;
        refreshDesc();
        createPara(`${warningMild("You lock the door.")}`);
      }
      if (alias=="KEY"&&(verb=="LOCK"||verb=="USE"||verb=="UNLOCK")&&item.specifier=="BLUE"){
        createPara(`${warningMild("You try the key in the door, but it won't turn.")}`);
      }
    }
    else if (redDoor.locked===true&&(verb=="UNLOCK"||verb=="USE")){
      createPara(`${warningMild("You try the door but it doesn't budge.")}`);
    }
    else if (redDoor.locked===false&&(verb=="UNLOCK"||verb=="USE")){
      createPara(`${warningMild("The unlocked door swings freely in your grasp.")}`);
    }
    else if (verb=="EXAMINE"){
      createPara(`${warningMild("It is a firm and sturdy door. You notice that it has a red keyhole.")}`);
    }
  },
  keyhole: {
  },
  name: "red door",
  location: "0,0",
  alias: "DOOR",
  specifier: "RED"
}

/* ----- ROOM AND DESCRIPTION CHANGERS ----- */

//Variable is true after first loop (on window load)
var secondRefresh=false;
// Refresh descriptions to match current longLat and outline possible directions
function refreshDesc() {
  resetDirections();
  routeOpen();
  removeTemporaryPara();
  longLat=longitude.toString(10)+","+latitude.toString(10);
  switch (longLat) {
    case '1,0':
    roomDesc="You find yourself in a damp corridor. There is a lanky dog here. There is a door to the West";
    westTravel=true;
    break;

    case '0,1':
    roomDesc="U R DED. There is a slimy tunnel to the South.";
    southTravel=true;
    break;

    case '0,0':
    if (redDoor.locked===false) {
      northTravel=true;
      roomDesc="You are in a large hall. There are doors in all directions.<br><br>The door to the North is unlocked.";
    }
    else {
      northTravel=false;
      roomDesc="You are in a large hall. There are doors in all directions.<br><br>The door to the North is shut.";
    }
    southTravel=true;
    eastTravel=true;
    westTravel=true;
    break;

    case '-1,0':
    roomDesc="Back off normie reee. There is a large dog flap to the East.";
    eastTravel=true;
    break;

    case '0,-1':
    // if (blueKey===true){
      roomDesc="You find yourself in a small stone room with a single window.";
    // }
    // else {
    //   roomDesc="You find yourself in a small stone room with a single window. There is a blue key on the floor.";
    // }
    northTravel=true;
    break;

    default:
    roomDesc="There is nothing here.";
  }
  // document.getElementById("latitudeText").innerHTML=latitude;
  // document.getElementById("longitudeText").innerHTML=longitude;
  // document.getElementById("longLatText").innerHTML=longLat;
  document.getElementById("descriptionText").innerHTML=roomDesc;
  console.log("Co-ordinates refreshed.");
  console.log(longLat);
  if (secondRefresh===true){
    itemRoomDesc();
  }
  secondRefresh=true;
}

//Reset all available directions to false so that avilable routes can be declared for current longLat
function resetDirections() {
  northTravel=false;
  southTravel=false;
  eastTravel=false;
  westTravel=false;

}

//Remove temporary paragraphs, run in refreshDesc()
function removeTemporaryPara() {
  var parent = document.getElementById("lowerMarker");
  var children = document.getElementsByClassName("temporaryPara");
  while(children.length > 0){
      children[0].parentNode.removeChild(children[0]);
  }
}

//Show error message if chosen route is not available

var i = -1;
function routeBlocked(){
  var errorText=document.getElementById("errorMessage");
  var colorArray=["#db1200","#bc0f00","#9e0c00","#7c0900","#600700","#3f0500","#1c1c1c","#1c1c1c"];
  i=-1;
  function errorColor(runCheck){
    console.log("runCheck="+runCheck);
    console.log("i="+i);
    if(runCheck===i) {
      console.log("runCheck passed");
      i++;
      var j=i;
      if (i<colorArray.length){
        console.log("running function again");
        errorText.style.color=colorArray[i];
        setTimeout(errorColor,200,j);
      }
      else {
        i=-1;
      }
    }
  }

  //Updates the error message in the html
  errorText.innerHTML=errorMessage;
  errorColor(i);
  console.log("Step 4");
  // }
}

//Remove error message if true route is possible
function routeOpen() {
  document.getElementById("errorMessage").innerHTML=noError;
}
