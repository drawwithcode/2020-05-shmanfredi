let socket = io();

let myColor = "black";
let slider;
let colorPicker;

let myUser;
let newUser;

let txtInst;
let txtColPick;
let txtBruSize;

////////////////////////////////////////////////////////////////////////////////

socket.on("connect", newConnection);
socket.on("mouseBroadcast", otherMouse);
socket.on("color", setColor);
socket.on("newPlayer", newPlayer);

////////////////////////////////////////////////////////////////////////////////

function setColor(assignedColor) {
  myColor = assignedColor;
}


function newConnection() {
  console.log("your id: " + socket.id);
}

function otherMouse(data) {
  push();
  let col = color(data.color);
  fill( /*data.*/ col);
  stroke( /*data.*/ col);
  strokeWeight(data.weight);
  line(data.x, data.y, data.px, data.py);
  noStroke()
  ellipse(data.x, data.y, myWeight);
  pop();
}

function newPlayer(newPlayerColor) {
  console.log(newPlayerColor);
  //newUser message
  newUser = createP("User " + newPlayerColor + " just joined!");
  newUser.style("color", newPlayerColor);
  newUser.style("background-color", "white"); //create a white background behind so that the msgs don't overlap
  newUser.position(width / 27, height / 1.27);
}

////////////////////////////////////////////////////////////////////////////////

function setup() {

  createCanvas(1920, 1080); // I preferred fixed dimension since windowResized() this time was giving some problems
  background("gainsboro");

  // slider
  slider = createSlider(1, 100, 10); //slider for brush size
  slider.style("width", "170px");
  slider.position(width / 16, height / 1.45);

  // canvas box
  fill("White");
  stroke("slategray");
  rect(12 * width / 48, height / 8, 2 * width / 3, 3 * height / 4, 20);

  // welcome box
  fill("white");
  stroke("slategray");
  rect(width / 48, height / 8, width / 5.8, height / 10, 20);

  // welcome message
  myUser = createP("Welcome user " + myColor + "!");
  myUser.style("color", myColor);
  myUser.position(width / 26, height / 7.25);

  // color picker
  colorPicker = createColorPicker();
  colorPicker.style("width", "170px");
  colorPicker.position(width / 16, height / 1.7);
  colorPicker.value(myColor);

  // cmd box
  fill("white");
  stroke("slategray");
  rect(width / 48, height / 4, width / 5.8, 2 * height / 4, 20);

  //cmd texts

  txtInst = createP("FREE YOUR CREATIVITY!<br><br><br>Draw in the box on the right<br>with your friends!<br><br><br>Press S to save your drawing<br>Press 0 for fullscreen");
  txtInst.style("color", "slategrey");
  txtInst.position(width / 40, height / 3.5);

  txtColPick = createP("Color");
  txtColPick.style("color", "slategrey");
  txtColPick.position(width / 11, height / 1.9)

  txtBruSize = createP("Size")
  txtBruSize.style("color", "slategrey");
  txtBruSize.position(width / 10.5, height / 1.6);

  //newUser box
  fill("white");
  stroke("slategray");
  rect(width / 48, height / 1.29, width / 5.8, height / 10, 20);
}

////////////////////////////////////////////////////////////////////////////////

function mouseDragged() {
  if (mouseX > 13 * width / 48 && mouseX < 10.7 * width / 12 && mouseY > height / 6 && mouseY < 3.4 * height / 4) { //setting the drawing field
    push();
    let col = color(myColor);
    //fill(myColor);
    fill(col);
    //stroke(myColor);
    stroke(col);
    strokeWeight(myWeight);
    line(mouseX, mouseY, pmouseX, pmouseY);
    noStroke();
    ellipse(mouseX, mouseY, myWeight);
    pop();
    let message = {
      color: myColor,
      weight: myWeight,
      x: mouseX,
      y: mouseY,
      px: pmouseX,
      py: pmouseY,
    };
    socket.emit("mouse", message);
  }
}

////////////////////////////////////////////////////////////////////////////////

function draw() {
  myWeight = slider.value();
  myColor = colorPicker.value();
}

////////////////////////////////////////////////////////////////////////////////

//inputs from keyboard
function keyPressed() {
  if (key == "s") {
    save("collab_drawing.png");
  } else if (key == "0") {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
