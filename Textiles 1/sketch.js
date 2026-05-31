let webcam;
let threads = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  webcam = createCapture(VIDEO);
  webcam.size(width, height);
  webcam.hide();

  for (let i = 0; i < 55; i++) {
    threads.push(new WeavingThread());
  }
}

function draw() {
  background(0);

  push();
  translate(width, 0);
  scale(-1, 1);
  image(webcam, 0, 0, width, height);
  pop();

  fill(0, 35);
  noStroke();
  rect(0, 0, width, height);

  for (let t of threads) {
    t.update();
    t.display();
  }

  drawFrame();
}

class WeavingThread {
  constructor() {
    this.reset();
  }

  reset() {
    this.horizontal = random() > 0.5;

    this.base = this.horizontal ? random(height) : random(width);
    this.offset = random(1000);
    this.speed = random(0.004, 0.012);
    this.thickness = random(1, 3);

    this.colours = [
      [245, 235, 210],
      [230, 170, 40],
      [20, 90, 75],
      [190, 210, 190],
      [120, 55, 35]
    ];

    this.c = random(this.colours);
  }

  update() {
    this.offset += this.speed;
    this.base += sin(frameCount * this.speed) * 0.15;
  }

  display() {
    noFill();
    stroke(this.c[0], this.c[1], this.c[2], 165);
    strokeWeight(this.thickness);

    beginShape();

    let step = 22;

    if (this.horizontal) {
      for (let x = -50; x < width + 50; x += step) {
        let wave = noise(x * 0.006, this.offset) * 55 - 27;
        curveVertex(x, this.base + wave);
      }
    } else {
      for (let y = -50; y < height + 50; y += step) {
        let wave = noise(y * 0.006, this.offset) * 55 - 27;
        curveVertex(this.base + wave, y);
      }
    }

    endShape();
  }
}

function drawFrame() {
  noFill();
  stroke(245, 235, 210, 80);
  strokeWeight(2);
  rect(35, 35, width - 70, height - 70);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  webcam.size(width, height);
}