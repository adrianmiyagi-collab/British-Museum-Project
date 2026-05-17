let webcam;
let overlayText = "BRITISH MUSEUM";
let glyphs = [];
const GLYPH_COUNT = 220;
let textTargets = [];

const FLOAT_FRAMES = 240;
const FORM_FRAMES = 200;
const HOLD_FRAMES = 90;

const PHASE_FLOAT = "float";
const PHASE_FORM = "form";
const PHASE_HOLD = "hold";

let phase = PHASE_FLOAT;
let phaseFrame = 0;

function setup(){
   createCanvas(windowWidth, windowHeight);
   webcam = createCapture(VIDEO);
   webcam.size(windowWidth, windowHeight);
   webcam.hide();

   textFont("monospace");
   buildTextTargets();
   for (let i = 0; i < GLYPH_COUNT; i++) {
    glyphs.push({
      x: random(width),
      y: random(height),
      vx: random(-0.45, 0.45),
      vy: random(-0.2, 0.2),
      ch: overlayText[int(random(overlayText.length))],
      sz: random(8, 14),
      tx: 0,
      ty: 0
    });
   }
   assignTargets();
}

function draw(){
  image(webcam, 0, 0, width, height);
  fill(255);
  noStroke();
  updatePhase();

  for (let i = 0; i < glyphs.length; i++) {
    let g = glyphs[i];
    textSize(g.sz);
    text(g.ch, g.x, g.y);

    if (phase === PHASE_FORM || phase === PHASE_HOLD) {
      g.x = lerp(g.x, g.tx, phase === PHASE_HOLD ? 0.16 : 0.09);
      g.y = lerp(g.y, g.ty, phase === PHASE_HOLD ? 0.16 : 0.09);
    } else {
      g.x += g.vx + sin(frameCount * 0.01 + i) * 0.15;
      g.y += g.vy + cos(frameCount * 0.012 + i) * 0.08;
    }

    if (g.x < -20) g.x = width + 20;
    if (g.x > width + 20) g.x = -20;
    if (g.y < -20) g.y = height + 20;
    if (g.y > height + 20) g.y = -20;
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  webcam.size(windowWidth, windowHeight);
  buildTextTargets();
  assignTargets();
}

function updatePhase() {
  phaseFrame++;

  if (phase === PHASE_FLOAT && phaseFrame > FLOAT_FRAMES) {
    phase = PHASE_FORM;
    phaseFrame = 0;
    assignTargets();
  } else if (phase === PHASE_FORM && phaseFrame > FORM_FRAMES) {
    phase = PHASE_HOLD;
    phaseFrame = 0;
  } else if (phase === PHASE_HOLD && phaseFrame > HOLD_FRAMES) {
    phase = PHASE_FLOAT;
    phaseFrame = 0;
  }
}

function buildTextTargets() {
  textTargets = [];

  const pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.clear();
  pg.fill(255);
  pg.noStroke();
  pg.textAlign(CENTER, CENTER);
  pg.textFont("monospace");
  pg.textSize(min(width * 0.11, 140));
  pg.text(overlayText, width * 0.5, height * 0.5);
  pg.loadPixels();

  const step = max(5, floor(min(width, height) / 160));
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = 4 * (x + y * width);
      if (pg.pixels[idx + 3] > 10) {
        textTargets.push({ x, y });
      }
    }
  }
}

function assignTargets() {
  if (textTargets.length === 0) return;

  for (let i = 0; i < glyphs.length; i++) {
    const t = textTargets[int(random(textTargets.length))];
    glyphs[i].tx = t.x;
    glyphs[i].ty = t.y;
    glyphs[i].ch = overlayText[i % overlayText.length];
  }
}