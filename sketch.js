let webcam;
let overlayText = "BRITISH MUSEUM";
let glyphs = [];
const GLYPH_COUNT = 220;

function setup(){
   createCanvas(windowWidth, windowHeight);
   webcam = createCapture(VIDEO);
   webcam.size(windowWidth, windowHeight);
   webcam.hide();

   textFont("monospace");
   for (let i = 0; i < GLYPH_COUNT; i++) {
    glyphs.push({
      x: random(width),
      y: random(height),
      vx: random(-0.45, 0.45),
      vy: random(-0.2, 0.2),
      ch: overlayText[int(random(overlayText.length))],
      sz: random(8, 14)
    });
   }
}

function draw(){
  image(webcam, 0, 0, width, height);
  fill(255);
  noStroke();

  for (let i = 0; i < glyphs.length; i++) {
    let g = glyphs[i];
    textSize(g.sz);
    text(g.ch, g.x, g.y);

    g.x += g.vx + sin(frameCount * 0.01 + i) * 0.15;
    g.y += g.vy + cos(frameCount * 0.012 + i) * 0.08;

    if (g.x < -20) g.x = width + 20;
    if (g.x > width + 20) g.x = -20;
    if (g.y < -20) g.y = height + 20;
    if (g.y > height + 20) g.y = -20;
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  webcam.size(windowWidth, windowHeight);
}
