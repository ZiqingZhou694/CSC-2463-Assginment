let port;
let writer, reader;
let red, green, blue;
let sensorData = {};
const encoder = new TextEncoder();
const decoder = new TextDecoder();

let activationState = { active: false };

let paintcolor = 255;
let sounds = new Tone.Players({
  "nuggets": "sounds/chicken.wav",
  "drop": "sounds/water.mp3",
  "duct": "sounds/ductTape.wav",
  "cartoon": "sounds/cartoon-toy-whistle.wav",
  "sweep": "sounds/fast-small-sweep-transition.wav",
  "game": "sounds/retro-game-notification.wav",
  "technological-hum": "sounds/technological-futuristic-hum.wav"
});

const delay = new Tone.FeedbackDelay("8n", 0.5);
let soundName;

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const loop = new Tone.Loop((time) => {
  const chord = ["C4", "E4", "G4", "B4"];
  synth.triggerAttackRelease(chord, "8n", time);
}, "2n");

loop.start(0);
Tone.Transport.start();

let totalPixels;
let blackPixels = 0;
let pixelDensityThreshold = 0.3;


// let toggleButton;

function setup() {
  createCanvas(1800, 700);
  background(225, 255, 255);
  sounds.connect(delay);
  delay.toDestination();

  slider = createSlider(1, 20, 10);
  eraser = createButton("clear");
  eraser.mousePressed(changeBackground);

  if ("serial" in navigator) {
    // The Web Serial API is supported.
    let button = createButton("connect");
    button.position(10, 10);
    button.mousePressed(connect);
  }
  // serialRead(); // Add this line

  if (reader) {
    serialRead();
  }
}

function draw() {
  colorPalette();
  noStroke();

  if (reader) {
    serialRead();
  }
  if (sensorData) {
    let brushX = map(sensorData.x, 0, 1023, 0, width);
    let brushY = map(sensorData.y, 0, 1023, 0, height);

    paintcolor = getColorByIndex(sensorData.colorIndex);
    soundName = getSoundNameByIndex(sensorData.colorIndex);

    stroke(paintcolor);
    strokeWeight(slider.value());
    line(pmouseX, pmouseY, brushX, brushY);
    pmouseX = brushX;
    pmouseY = brushY;

    if (brushX <= 1800 && brushY <= 700) {
      sounds.player(soundName).start();
    }

    totalPixels = width * height;
    if (paintcolor === color(0, 0, 0)) {
      blackPixels++;
    }
    let density = blackPixels / totalPixels;

    if (density >= pixelDensityThreshold) {
      Tone.Transport.bpm.value = map(density, pixelDensityThreshold, 1, 60, 180);
      synth.set({ "detune": map(density, pixelDensityThreshold, 1, 0, 1200) });
    }
  }
}

function changeBackground() {
  background(255);
}

function getColorByIndex(index) {
  switch (index) {
    case 0:
      return color(255, 0, 0);
    case 1:
      return color(255, 165, 0);
    case 2:
      return color(255, 255, 0);
    case 3:
      return color(0, 255, 0);
    case 4:
      return color(0, 255, 255);
    case 5:
      return color(0, 0, 255);
    case 6:
      return color(255, 0, 255);
    case 7:
      return color(150, 75, 0);
    case 8:
      return color(255, 255, 255);
    case 9:
      return color(0, 0, 0);
    default:
      return color(255);
  }
}

function getSoundNameByIndex(index) {
  switch (index) {
    case 0:
      return "game";
    case 1:
      return "sweep";
    case 2:
      return "technological-hum";
    case 3:
      return "cartoon";
    case 4:
      return "duct";
    case 5:
      return "drop";
    case 6:
      return "nuggets";
    case 7:
      return "sweep";
    case 8:
      return "game";
    case 9:
      return "cartoon";
    default:
      return "";
  }
}

function colorPalette() {
  stroke(255, 255, 255);
  strokeWeight(2);
  fill("red");
  rect(0, 0, 30, 30);
  fill("orange");
  rect(0, 30, 30, 30);
  fill("yellow");
  rect(0, 60, 30, 30);
  fill("green");
  rect(0, 90, 30, 30);
  fill("cyan");
  rect(0, 120, 30, 30);
  fill("blue");
  rect(0, 150, 30, 30);
  fill("magenta");
  rect(0, 180, 30, 30);
  fill("brown");
  rect(0, 210, 30, 30);
  fill("white");
  rect(0, 240, 30, 30);
  fill("black");
  rect(0, 270, 30, 30);
}

// Web Serial API functions
function serialWrite(jsonObject) {
  if (writer) {
    writer.write(encoder.encode(JSON.stringify(jsonObject) + "\n"));
  }
}

async function connect() {
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600 });

  writer = port.writable.getWriter();

  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
}
  
async function serialRead() {
  while (true) {
    try {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }
      sensorData = JSON.parse(value);
      red = map(sensorData.analogValue, 0, 1023, 0, 255);
      green = map(sensorData.analogValue, 0, 1023, 255, 0);
      blue = 0;
    } catch (err) {
      console.error('Error reading data:', err);
    }
  }
}
  
class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line break in chunks, send the parsed lines out.
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
