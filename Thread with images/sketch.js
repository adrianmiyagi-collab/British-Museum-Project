let webcam;
let webcamReady = false;
let threads = [];
let popups = [];
let media = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Carga asíncrona — no bloquea el arranque
  loadImage("image1.jpg", img => media.push(img));
  loadImage("image2.jpg", img => media.push(img));

  webcam = createCapture(VIDEO, function () {
    console.log("camera ready");
    webcamReady = true;
  });

  webcam.size(width, height);
  webcam.hide();

  for (let i = 0; i < 45; i++) {
    threads.push(new WeavingThread());
  }
}

function draw() {
  background(0);

  // Detección de webcam lista por doble vía
  if (webcam && !webcamReady && webcam.elt.readyState >= 2) {
    webcamReady = true;
  }

  push();
  translate(width, 0);
  scale(-1, 1);

  if (webcamReady) {
    image(webcam, 0, 0, width, height);
  }

  pop();

  fill(0, 45);
  noStroke();
  rect(0, 0, width, height);

  for (let t of threads) {
    t.update();
    t.display();
  }

  checkIntersections();

  for (let i = popups.length - 1; i >= 0; i--) {
    popups[i].update();
    popups[i].display();

    if (popups[i].life <= 0) {
      popups.splice(i, 1);
    }
  }

  drawFrame();
}

class WeavingThread {
  constructor() {
    this.horizontal = random() > 0.5;
    this.base = this.horizontal ? random(height) : random(width);
    this.baseOrigin = this.base;
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
    this.base = this.baseOrigin + sin(frameCount * this.speed) * 8;
  }

  getPoint(pos) {
    let wave = noise(pos * 0.006, this.offset) * 55 - 27;

    if (this.horizontal) {
      return createVector(pos, this.base + wave);
    } else {
      return createVector(this.base + wave, pos);
    }
  }

  display() {
    noFill();
    stroke(this.c[0], this.c[1], this.c[2], 170);
    strokeWeight(this.thickness);

    let step = 22;
    let points = [];

    if (this.horizontal) {
      for (let x = -50; x < width + 50; x += step) {
        points.push(this.getPoint(x));
      }
    } else {
      for (let y = -50; y < height + 50; y += step) {
        points.push(this.getPoint(y));
      }
    }

    beginShape();
    curveVertex(points[0].x, points[0].y);
    for (let p of points) {
      curveVertex(p.x, p.y);
    }
    curveVertex(points[points.length - 1].x, points[points.length - 1].y);
    endShape();
  }
}

function checkIntersections() {
  if (frameCount % 18 !== 0) return;
  if (popups.length > 5) return;

  let horizontals = threads.filter(t => t.horizontal);
  let verticals = threads.filter(t => !t.horizontal);

  if (horizontals.length === 0 || verticals.length === 0) return;

  let h = random(horizontals);
  let v = random(verticals);

  let x = v.base;
  let y = h.base;

  let hp = h.getPoint(x);
  let vp = v.getPoint(y);

  if (dist(hp.x, hp.y, vp.x, vp.y) < 35) {
    popups.push(new MediaPopup((hp.x + vp.x) / 2, (hp.y + vp.y) / 2));
  }
}

class MediaPopup {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.media = media.length > 0 ? random(media) : null;
    this.life = 255;
    this.size = random(130, 210);
  }

  update() {
    this.life -= 2.2;
    this.y -= 0.15;
  }

  display() {
    push();
    translate(this.x, this.y);

    let alpha = constrain(this.life, 0, 255);

    fill(245, 240, 230, alpha);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size + 16, this.size * 0.72 + 16, 8);

    if (this.media) {
      tint(255, alpha);
      imageMode(CENTER);
      image(this.media, 0, 0, this.size, this.size * 0.65);
      noTint();
    }

    stroke(245, 235, 210, alpha);
    strokeWeight(1);
    line(-this.size / 2, 0, this.size / 2, 0);

    pop();
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

  if (webcam) {
    webcam.size(width, height);
  }
}
