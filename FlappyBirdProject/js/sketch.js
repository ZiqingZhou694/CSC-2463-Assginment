let port;
let writer, reader;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const GRAVITY = 9.81;
const JUMP_HEIGHT = 9.0;
const GROUND_HEIGHT = 20;

const WIDTH = 400;
const HEIGHT = 600;

var SCROLL_SPEED = 4;
var SCORE = 0;
var gameStarted = false;
var gameOver = false;

// tone.js
const synth = new Tone.MonoSynth({
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 0,
    release: 0.2
  }
}).toDestination();

// Web Serial API (Arduino)
async function connect() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    writer = port.writable.getWriter();
    reader = port.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader();

    serialRead();

  } catch (err) {
    console.error("Error connecting to Arduino:", err);
  }
}

class LineBreakTransformer {
  constructor() {
    this.chunks = "";
  }

  transform(chunk, controller) {
    this.chunks += chunk;
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.chunks);
  }
}

async function serialRead() {
  while (reader) {
    try {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }
      handleArduinoCommand(value);
    } catch (err) {
      console.error("Error reading data:", err);
    }
  }
}

function handleArduinoCommand(command) {
  command = command.trim();
  console.log("Received command:", command);
  if (command === 'J') {
    console.log("Calling bird.flap()");
    if (!gameStarted) {
      gameStarted = true;
    }
    if (!gameOver) {
      bird.flap();
    }
  } else if (command === 'R') {
    restartGame();
  }
  
}


// if (writer) {
//   writer.write(encoder.encode(`${SCORE}\n`));
// }

// P5 flappy bird code.
function setup() {
  createCanvas(WIDTH, HEIGHT);

  if ('serial' in navigator) {
    let button = createButton('connect');
    button.position(10, 10);
    button.mousePressed(connect);
  }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class Bird {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vely = 0;
  }

  draw() {
    fill("#eaff00");
    circle(this.x, this.y, this.size);
  }

  update() {
    this.y += this.vely;
    this.vely = lerp(this.vely, GRAVITY, 0.05);
    this.y = Math.max(this.size / 2, Math.min(this.y, HEIGHT - GROUND_HEIGHT - this.size / 2));
  }

  flap() {
    this.vely = -JUMP_HEIGHT;
    synth.triggerAttack(523.25); // C5
    setTimeout(() => {
      synth.set({ frequency: 391.995 }); // G4
      setTimeout(() => {
        synth.triggerRelease();
      }, 40);
    }, 20);
  }

  checkDeath(pipes) {
    for (var pipe of pipes.pipes_list) {
      if (this.x + this.size / 2 > pipe.x && this.x - this.size / 2 < pipe.x + pipes.width) {
        if (this.y - this.size / 2 <= pipe.height || this.y + this.size / 2 >= pipe.height + pipes.gap) {
          gameOver = true;
        }
      }
      if (this.x - this.size / 2 > pipe.x + pipes.width && pipe.scored == false) {
        SCORE += 1;
        pipe.scored = true;
      }
    }
  }
}

class Pipes {
  constructor(width, frequency, gap) {
    this.width = width;
    this.frequency = frequency;
    this.gap = gap;

    this.pipes_list = [
      { x: 700, height: getRndInteger(this.gap, HEIGHT - GROUND_HEIGHT - this.gap), scored: false },
      { x: 700 + this.width + this.frequency, height: getRndInteger(this.gap, HEIGHT - GROUND_HEIGHT - this.gap), scored: false }
    ];
  }

  update() {
    for (var pipe of this.pipes_list) {
      pipe.x -= SCROLL_SPEED;
      if (pipe.x + this.width <= 0) {
        pipe.x = WIDTH;
        pipe.height = getRndInteger(this.gap, HEIGHT - GROUND_HEIGHT - this.gap - this.gap);
        pipe.scored = false;
      }
    }
  }

  drawPipes() {
    fill("#008a39");
    for (var pipe of this.pipes_list) {
      rect(pipe.x, 0, this.width, pipe.height);
      rect(pipe.x, HEIGHT - GROUND_HEIGHT, this.width, -HEIGHT + pipe.height + GROUND_HEIGHT + this.gap);
    }
  }
}

var bird = new Bird(WIDTH / 3, HEIGHT / 2, 30);
var pipes = new Pipes(60, 150, 130);

function drawStartScreen() {
  background("#87CEEB");
  fill(255);
  textSize  (40);
  textAlign(CENTER);
  text("Flappy Bird", WIDTH / 2, HEIGHT / 4);
  textSize(20);
  text("Press 'Space' or click to start", WIDTH / 2, HEIGHT / 2);
}

function drawGameOverScreen() {
  background(0, 0, 0, 200);
  fill(255);
  textSize(40);
  textAlign(CENTER);
  text("Game Over", WIDTH / 2, HEIGHT / 4);
  textSize(20);
  text("Press 'R' to restart", WIDTH / 2, HEIGHT / 2);
  text("Your score: " + SCORE, WIDTH / 2, HEIGHT / 2 + 40);
}

function draw() {
  if (gameOver) {
    drawGameOverScreen();
    return;
  }
  if (!gameStarted) {
    drawStartScreen();
    return;
  }
  background("#87CEEB");
  fill("#7cfc00");
  rect(0, HEIGHT - GROUND_HEIGHT, WIDTH, HEIGHT);

  bird.draw();
  bird.update();
  bird.checkDeath(pipes);

  pipes.update();
  pipes.drawPipes();

  fill(255);
  textSize(60);
  textAlign(CENTER);
  text(SCORE, WIDTH / 2, HEIGHT - HEIGHT / 7);

  if (writer) {
    writer.write(encoder.encode(`${SCORE}\n`));
  }
}

function restartGame() {
  SCORE = 0;
  gameStarted = false;
  gameOver = false;
  bird = new Bird(WIDTH / 3, HEIGHT / 2, 30);
  pipes = new Pipes(60, 150, 130);
}

function keyPressed() {
  if (keyCode == 32) {
    if (!gameStarted) {
      gameStarted = true;
    }
    if (!gameOver) {
      bird.flap();
    }
  }
  if (keyCode == 82 && gameOver) {
    restartGame();
  }
}


