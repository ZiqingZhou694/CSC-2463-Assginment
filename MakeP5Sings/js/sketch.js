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

function setup() {
  createCanvas(1800, 700);
  background(225, 255, 255);
  sounds.connect(delay);
  delay.toDestination();

  slider = createSlider(1, 20, 10);
  eraser = createButton("clear");
  eraser.mousePressed(changeBackground);
}

function draw() {
  colorPalette();
  noStroke();

  if (mouseIsPressed) {
    if (mouseX <= 40 && mouseY <= 400) {
      selectColor();
    } else {
      stroke(paintcolor);
      strokeWeight(slider.value());
      line(pmouseX, pmouseY, mouseX, mouseY);

      if (mouseX <= 1800 && mouseY <= 700) {
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
}
function changeBackground() {
  background(255);
}

function selectColor(){
  if(mouseY <= 30){
    paintcolor = color(255,0,0);
    soundName = "game";
    console.log('changed to red');
  }
  else if(mouseY <= 60){
    paintcolor = color(255,165,0);
    soundName = "sweep";
    console.log('changed to orange');
  }
  else if(mouseY <= 90){
    paintcolor = color(255,255,0);
    soundName = "technological-hum";
    console.log('changed to yellow');
  }
  else if(mouseY <= 120){
    paintcolor = color(0,255,0);
    soundName = "cartoon";
    console.log('changed to green');
  }
  else if(mouseY <= 150){
    paintcolor = color(0,255,255);
    soundName = "duct";
    console.log('changed to cyan');
  }
  else if(mouseY <= 180){
    paintcolor = color(0,0,255);
    soundName = "drop";
    console.log('changed to blue');
  }
  else if(mouseY <= 210){
    paintcolor = color(255,0,255);
    soundName = "nuggets";
    console.log('changed to magenta');
  }
  else if(mouseY <= 240){
    paintcolor = color(150,75,0);
    console.log('changed to brown');
  }
  else if(mouseY <= 270){
    paintcolor = color(255,255,255);;
    console.log('changed to white');
  }
  else if(mouseY <= 400){
    paintcolor = color(0,0,0);
    console.log('changed to black');
  }
}

function colorPalette(){
  stroke(255,255,255);
  strokeWeight(2);
  fill("red");
  rect(0,0,30,30);
  fill("orange");
  rect(0,30,30,30);
  fill("yellow");
  rect(0,60,30,30);
  fill("green");
  rect(0,90,30,30);
  fill("cyan");
  rect(0,120,30,30);
  fill("blue");
  rect(0,150,30,30);
  fill("magenta");
  rect(0,180,30,30);
  fill("brown");
  rect(0,210,30,30);
  fill("white");
  rect(0,240,30,30);
  fill("black");
  rect(0,270,30,30);
}