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
    var textnode = document.createTextNode(textContent);     // Create a text node
    node.appendChild(textnode);                              // Append the text to <p>
    node.setAttribute('class', 'temporaryPara');
    document.getElementById("lowerMarker").appendChild(node);// Append <p> to <p> with id="lowerMarker"
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


//Run code

function submitForm(event){
  // command = shortcut for capitalised user input
  var command = commandForm["commandBox"].value.toUpperCase();
  // log to console for debugging
  console.log('Form submitted. Value:' + commandForm["commandBox"].value);
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
    case "PICK UP KEY":
    case "PICK UP BLUE KEY":
      if (blueKey===false) {
        console.log("key input");
        if (longLat==='0,-1'){
          blueKey=true;
          console.log("key pickup");
          refreshDesc();
          createPara("You pick up the key.");
          //You pick up the Blue Key
        }
        else {
          console.log(longLat);
          console.log(longitude);
          console.log(latitude);
          console.log("wrong longLat");
          createPara("There is no key here.");
          //There is no key here.
        }
      }
      else {
        //You already have the blue key.
      }
    break;
    //Use key
    case "USE KEY":
    case "USE KEY ON DOOR":
    case "USE BLUE KEY":
    case "USE BLUE KEY ON DOOR":
        if (blueKey===false) {
          createPara("You do not have a key");
        }
        else if (blueKey===true) {
          if (longLat==='0,0') {
            doorStatus=true;
            refreshDesc();
            createPara("You open the door to the North.");
          }
          else {
            createPara("There is nowhere to use the key.");
          }
        }
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
    console.log("Gone north.");
    console.log(latitude);
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
    console.log("Gone South.");
    console.log(latitude);
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
    console.log("Gone East.");
    console.log(longitude);
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
    console.log("Gone West.");
    console.log(longitude);
  }
  else {
    routeBlocked();
  }
}
/* ----- INVENTORY ----- */

var blueKey=false;

function Item(name, inInventory, location){
  this.name=name;
  this.inInventory=inInventory;
  this.location=location;
}

var redKey = new Item("redKey", false, "1,0");

function addItems(){
  if (longLat===redKey.location){
    createPara("There is a red key on the floor.");
  }
  console.log(redKey.name + redKey.inInventory + redKey.location);
}


/* ----- ROOM AND DESCRIPTION CHANGERS ----- */

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
    if (doorStatus===true) {
      northTravel=true;
      roomDesc="You are in a large hall. There are doors in all directions.<br><br>The door to the North is unlocked.";
    }
    else {
      northTravel=false;
      roomDesc="You are in a large hall. There are doors in all directions.<br><br>The door to the North is locked. It has a blue keyhole.";
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
    if (blueKey===true){
      roomDesc="You find yourself in a small stone room with a single window.";
    }
    else {
      roomDesc="You find yourself in a small stone room with a single window. There is a blue key on the floor.";
    }
    northTravel=true;
    break;

    default:
    roomDesc="There is nothing here.";
  }
  addItems();
  // document.getElementById("latitudeText").innerHTML=latitude;
  // document.getElementById("longitudeText").innerHTML=longitude;
  // document.getElementById("longLatText").innerHTML=longLat;
  document.getElementById("descriptionText").innerHTML=roomDesc;
  console.log("Co-ordinates refreshed.");
  console.log(longLat);
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
  var colorArray=["#db1200","#bc0f00","#9e0c00","#7c0900","#600700","#3f0500","#1e0200","#000000"];
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
