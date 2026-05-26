let webcam;
let overlay;

function setup(){
   createCanvas(windowWidth, windowHeight);
   colorMode(HSB, 360, 100, 100);
   noCursor();
   webcam = createCapture(VIDEO);
   webcam.size(windowWidth, windowHeight);
   webcam.hide();
   overlay = createGraphics(windowWidth, windowHeight);
   overlay.colorMode(HSB, 360, 100, 100);
   overlay.clear();
}

function draw(){
  background(0);
  if (webcam) {
    image(webcam, 0, 0, width, height);
  }
  image(overlay, 0, 0);
  drawNeedle(mouseX, mouseY, pmouseX, pmouseY);
}

function mouseDragged() {
  overlay.stroke(0, 100, 100);
  overlay.strokeWeight(4);
  overlay.strokeCap(ROUND);
  overlay.line(pmouseX, pmouseY, mouseX, mouseY);
}

function drawNeedle(x, y, px, py) {
  let dx = x - px;
  let dy = y - py;
  let angle = (abs(dx) + abs(dy) > 0.1) ? atan2(dy, dx) : 0;
  push();
  translate(x, y);
  rotate(angle);

  // Needle
  stroke(0, 0, 90);
  strokeWeight(3);
  line(-32, 0, 32, 0);

  fill(0, 0, 90);
  noStroke();
  ellipse(-16, 0, 10, 14);
  fill(0, 0, 0);
  ellipse(-16, 0, 4, 8);

  noStroke();
  fill(0, 0, 90);
  triangle(32, 0, 24, -4, 24, 4);

  // stroke(0, 100, 100);
  // strokeWeight(2);
  // line(-16, 0, -40, 0);
  // pop();
}

function touchMoved() {
  mouseDragged();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  webcam.size(windowWidth, windowHeight);
  overlay.resizeCanvas(windowWidth, windowHeight);
}
