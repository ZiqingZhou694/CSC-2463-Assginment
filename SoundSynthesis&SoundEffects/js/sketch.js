let img;
let nxDial, nxButton;

let synth = new Tone.PolySynth().toDestination();
let dSynth = new Tone.PolySynth().toDestination();

let pattern = new Tone.Pattern(function (time, note) {
  synth.triggerAttackRelease(note, 0.25, time);
}, ['C4', ['D4', 'B3'], 'E4', 'G4']);

const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, 0.2, time);
}, ['C5', 'E5', 'G5', 'B5', 'A5', 'D5', 'F5', 'E5']).start("0:0");

let chords = [
  {"time": "0:0", "note": ["C4", 'E4', "G4", "B4"]},
  {"time": "0:2", "note": ["F4", 'A4', "C4", "E4"]},
  {"time": "0:3", "note": ["G4", 'B4', "D4", "F4"]},
  {"time": "1:2", "note": ["A4", 'C5', "E4", "G4"]}
]

let chord = new Tone.Part((time, notes)=>{
  dSynth.triggerAttackRelease(notes.note, '2n', time)
}, chords);

chord.loop = true;
chord.loopEnd = '2m';


const synthA = new Tone.FMSynth().toDestination();
const synthB = new Tone.AMSynth().toDestination();

const delay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
const reverb = new Tone.Reverb(2).toDestination();

synthA.chain(delay, reverb);
synthB.chain(delay, reverb);

//play a note every quarter-note
const loopA = new Tone.Loop(time => {
  synthA.triggerAttackRelease("C2", "8n", time);
}, "4n").start(0);
//play another note every off quarter-note, by starting it "8n"
const loopB = new Tone.Loop(time => {
  synthB.triggerAttackRelease("C4", "8n", time);
}, "4n").start("8n");

function setup() {
  createCanvas(400, 400);

  nxDial = Nexus.Add.Dial('#nxUI', {
    'size': [100, 100]
  });

  synthA.volume.value = -6;
  synthB.volume.value = -9;
  synth.volume.value = -3;
  dSynth.volume.value = -5;


  nxButton = Nexus.Add.Button('#nxUI');
  nxButton.on('change', () => {
    Tone.start();
    chord.start('0:0');
    pattern.start(0);
    Tone.Transport.start();
  })
}

function draw() {
  background(220);

  // Check if the mouse is pressed
 
 
}

// function mousePressed() {
//   createImg('https://picsum.photos/400/400?random=1').position(0, 180);
// }

function mousePressed() {
  // Create a new image element with a random seed
  let img = createImg(`https://picsum.photos/400/400?random=${int(random(1000))}`);
  // Set the position of the image
  img.position(0, 180);
}