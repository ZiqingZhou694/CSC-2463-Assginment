let slider;

const FM = new Tone.FMSynth({
  "harmonicity": 3.01,
  "modulationIndex": 14,
  "oscillator": {
      "type": "triangle"
  },
  "envelope": {
      "attack": 0.2,
      "decay": 0.3,
      "sustain": 0.1,
      "release": 1.2
  },
  "modulation" : {
      "type": "square"
  },
  "modulationEnvelope" : {
      "attack": 0.01,
      "decay": 0.5,
      "sustain": 0.2,
      "release": 0.1
  }
});


const reverb = new Tone.JCReverb(0.4);
FM.connect(reverb);
// erhu.connect(reverb);
const osc = new Tone.OmniOscillator("C#4", "pwm").start();

const ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.5,
  decay: 0.6,
  sustain: 0.3,
  release: 0.2
})

let notes = {
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'F4',
  'g': 'G4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5'
}

function setup() {
  createCanvas(400, 400);

  slider = new Nexus.Slider("#slider");
  reverb.toDestination();

  synth.release = 2;
  synth.resonance = 0.98;
  // synth.harmonicity.value = 1.25;
  //play a middle 'C' for the duration of an 8th note
  // synth.triggerAttackRelease("C4", "8n");

  slider.on('change', (v) =>  {
    reverb.roomSize.value = v;
  }); 

  osc.connect(ampEnv);
  ampEnv.connect(reverb);
}

function draw() {
  background(220);
}

function keyPressed() {
  let toPlay = notes[key];
  console.log(toPlay);

  osc.frequency.value = toPlay;
  ampEnv.triggerAttackRelease('8n');

  FM.triggerAttackRelease(toPlay, 0.5);
  // erhu.triggerAttackRelease(toPlay,0.5);
  // synth.triggerAttackRelease(toPlay, 0.5);
  // metal.triggerAttackRelease("C3", "8n", '+0.5');

}