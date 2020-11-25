let socket = io();
let myColor;
let slider;
let colorPicker;
let colorPicker2;

socket.on("connect", newConnection);
socket.on("mouseBroadcast", otherMouse);


function newConnection() {
	console.log("your id: " + socket.id);
}

function setup() {

	createCanvas(1920, 1080); // I preferred fixed dimension since windowResized() this time was giving some problems
	background("gainsboro");

  fill("white");
  stroke("slategray");
  rect(width/48,height/4, width/5.8, 2*height/4, 20);

	let txtInst = "FREE YOUR CREATIVITY!\n\nDraw in the box on the right\nwith your friends!\n\nPress S to save your drawing\nPress 0 for fullscreen"
	let txtColPick = "Color"
	let txtBruSize = "Brush size"

  fill("slategray");
  textFont("Comfortaa"); // Something is wrong. It loads the font only if you refresh the page.
  textAlign(CENTER);
  textSize(20);
  text(txtInst, 5.2 * width / 48, height/3);
	text(txtColPick, 5.2 * width / 48, height/1.8);
	text(txtBruSize, 5.2 * width / 48, height/1.5);

  colorPicker = createColorPicker("#000000"); //created color picker and set value to black
  colorPicker.style("width", "170px");
  colorPicker.position(width/16, height/1.7);

  slider = createSlider(1, 100, 10); //slider for brush size
	slider.style("width", "170px");
  slider.position(width/16, height/1.45);

  fill("White");
  stroke("slategray");
  rect(12 * width/48, height/8, 2*width/3, 3*height/4, 20);

}

function draw() {
	myWeight = slider.value();
  myColor = colorPicker.value();
}

//inputs from keyboard
function keyPressed(){
  if(key == "s"){
  save("collab_drawing.png");
} else if(key =="0"){
	let fs = fullscreen();
    fullscreen(!fs);
}
}

function mouseDragged() {
	if (mouseX > 13 * width/48 && mouseX < 10.5*width/12 && mouseY > height/8 && mouseY < 3.5*height/4) { //setting the drawing field
		push();
		fill(myColor);
    stroke(myColor);
    strokeWeight(myWeight);
    line(mouseX, mouseY, pmouseX, pmouseY);
		noStroke();
		ellipse(mouseX, mouseY, myWeight);
		pop();
		let message = {
			col: myColor,
			weight: myWeight,
			x: mouseX,
			y: mouseY,
			px: pmouseX,
			py: pmouseY,
		};
		socket.emit("mouse", message);
	}
}

function otherMouse(data){
  push();
    fill(data.col);
    stroke(data.col);
		strokeWeight(data.weight);
    line(data.x, data.y, data.px, data.py);
    noStroke()
    ellipse(data.x, data.y, myWeight);
  pop();
}
