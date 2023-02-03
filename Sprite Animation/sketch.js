let spriteSheet;
//80 pixels square
let Width = 80;
let Height = 80;

let numFrames = 9; // num of grames using in animation.
let currentFrame = 0;

let x = 0; //position x
let y = 0; //position y
let Speed = 2; //position update speed
let facingRight = true;

function preload() {
  spriteSheet = loadImage("assets/Robot.png");
}

function setup() {
  createCanvas(1200, 600);
  frameRate(30);
}

function draw() {
  background(255);
  
  currentFrame = (currentFrame + 1) % numFrames;

  if (facingRight) {
    image(spriteSheet, x, y, Width, Height, currentFrame * Width, 0, Width, Height);
  } else {
    push();
    translate(x + Width, y);
    scale(-1, 1);
    image(spriteSheet, 0, 0, Width, Height, currentFrame * Width, 0, Width, Height);
    pop();
  }
  // update position
  x += Speed;

  if (keyIsDown(LEFT_ARROW)) {
    facingRight = false;
    Speed = -2;
  } else if (keyIsDown(RIGHT_ARROW)) {
    facingRight = true;
    Speed = 2;
  }
}
