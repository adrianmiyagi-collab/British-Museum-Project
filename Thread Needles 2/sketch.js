let cam;
let thread;
let needles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noCursor();

  cam = createCapture(VIDEO);
  cam.size(width, height);
  cam.hide();

  thread = new SewingThread();

  for (let i = 0; i < 6; i++) {
    needles.push(new Needle(i));
  }
}

function draw() {
  background(0);

  // webcam untouched
  push();
  translate(width, 0);
  scale(-1, 1);
  image(cam, 0, 0, width, height);
  pop();

  time += 0.003;

  thread.update();
  thread.display();

  for (let n of needles) {
    n.update();
    n.display();
  }
}

class SewingThread {
  constructor() {
    this.points = [];
  }

  update() {
    this.points = [];

    for (let i = 0; i <= 220; i++) {
      let p = i / 220;

      let x = map(p, 0, 1, -150, width + 150);

      let y =
        height * 0.45 +
        sin(p * TWO_PI * 2.2 + time * 2.2) * 130 +
        sin(p * TWO_PI * 5.6 - time * 1.4) * 45 +
        noise(p * 3, time) * 50;

      this.points.push(createVector(x, y));
    }
  }

  getPoint(p) {
    let index = floor(constrain(p, 0, 1) * (this.points.length - 1));
    return this.points[index];
  }

  getAngle(p) {
    let p1 = this.getPoint(max(0, p - 0.01));
    let p2 = this.getPoint(min(1, p + 0.01));
    return atan2(p2.y - p1.y, p2.x - p1.x);
  }

  display() {
    noFill();

    // soft shadow
    stroke(0, 0, 0, 35);
    strokeWeight(2.2);

    beginShape();
    for (let pt of this.points) {
      curveVertex(pt.x + 2, pt.y + 2);
    }
    endShape();

    // main thread
    stroke(20, 45, 12, 85);
    strokeWeight(1.15);

    beginShape();
    for (let pt of this.points) {
      curveVertex(pt.x, pt.y);
    }
    endShape();

    // thin highlight
    stroke(35, 10, 90, 25);
    strokeWeight(0.35);

    beginShape();
    for (let pt of this.points) {
      curveVertex(pt.x + 0.8, pt.y - 0.8);
    }
    endShape();
  }
}

class Needle {
  constructor(index) {
    this.index = index;
    this.threadPosition = index / 6 + 0.04;
    this.length = random(70, 95);
  }

  update() {
    this.threadPosition += 0.0006;

    if (this.threadPosition > 1) {
      this.threadPosition = 0;
    }

    this.pos = thread.getPoint(this.threadPosition);
    this.angle = thread.getAngle(this.threadPosition);
  }

  display() {
    if (!this.pos) return;

    push();

    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    // small gap logic: needle sits exactly on the thread
    // thread passes through the eye area

    // needle shadow
    stroke(0, 0, 0, 45);
    strokeWeight(3);
    line(-this.length / 2 + 2, 2, this.length / 2 + 2, 2);

    // metallic needle body
    stroke(0, 0, 88, 96);
    strokeWeight(2);
    line(-this.length / 2, 0, this.length / 2, 0);

    // metallic highlight
    stroke(0, 0, 100, 80);
    strokeWeight(0.7);
    line(-this.length / 2 + 7, -1.2, this.length / 2 - 8, -1.2);

    // sharp point
    stroke(0, 0, 98, 95);
    strokeWeight(1);
    line(this.length / 2 - 12, 0, this.length / 2 + 9, 0);

    // eye of the needle
    noStroke();
    fill(0, 0, 92, 95);
    ellipse(-this.length / 3, 0, 10, 14);

    fill(0, 0, 8, 95);
    ellipse(-this.length / 3, 0, 3, 7);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cam.size(width, height);

  thread = new SewingThread();
}