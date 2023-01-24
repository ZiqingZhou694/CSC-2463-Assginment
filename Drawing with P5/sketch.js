// //Example 1
// function setup() {
//   createCanvas(200, 100);
// }

// function draw() {
//   background(0,280,0);
//   ellipse(50,50,80,80);
//   rect(110,10,80,80);
// }

var exp1 = function(p5){
  p5.setup = function(){
    p5.createCanvas(200, 100);
  };
  p5.draw = function(){
    p5.background(0,280,0);
    p5.ellipse(50,50,80,80);
    p5.rect(110,10,80,80);
  };
};
var myp5 = new p5(exp1, 'e1');

//Example 2
// function setup() {
//   createCanvas(400, 400);
// }

// function draw() {
//   background(250);
//   noStroke();
//   fill('rgba(251, 106, 98, 0.57)');
//   // stroke('rgba(251, 106, 98, 0.57)');
//   ellipse(200,150,120,120);
//   fill('rgba(98, 118, 251, 0.57)');
//   // stroke('rgba(98, 118, 251, 0.57)');
//   ellipse(160,210,120,120);
//   // fill('green');
//   fill ('rgba(75, 253, 97, 0.57)');
//   // stroke('rgba(75, 253, 97, 0.57)');
//   ellipse(240,210,120,120);
// }
var exp2 = function(p5){
  p5.setup = function(){
    p5.createCanvas(200, 200);
  };
  p5.draw = function(){
    p5.background(250);
    p5.noStroke();
    p5.fill('rgba(251, 106, 98, 0.57)');
    p5.ellipse(100,50,100,100);
    p5.noStroke();
    p5.fill ('rgba(75, 253, 97, 0.57)');
    p5.ellipse(135,110,100,100);
    p5.noStroke();
    p5.fill('rgba(98, 118, 251, 0.57)');
    p5.ellipse(65,110,100,100);
  };
};
var myp5 = new p5(exp2, 'e2');

// //Example 3
// function setup() {
//   createCanvas(200, 100);
// }

// function draw() {
//   background('black');
//   fill('yellow');
//   arc(52,50,80,80,-90.4,2.5,PIE);
//   fill('rgb(238,65,65)');
//   circle(150, 48, 80);
//   noStroke();
//   rect(110, 50, 80, 40);
//   fill('white');
//   circle(130, 48, 25);
//   circle(170, 48, 25);
//   fill('blue');
//   circle(130, 48, 15);
//   circle(170, 48, 15);
// };
var exp3 = function(p5){
  p5.setup = function(){
    p5.createCanvas(200, 100);
  };
  p5.draw = function(){
    p5.background('black');
    p5.fill('yellow');
    p5.arc(52,50,80,80,-90.4,2.5,PIE);
    p5.fill('rgb(238,65,65)');
    p5.circle(150, 48, 80);
    p5.noStroke();
    p5.rect(110, 50, 80, 40);
    p5.fill('white');
    p5.circle(130, 48, 25);
    p5.circle(170, 48, 25);
    p5.fill('blue');
    p5.circle(130, 48, 15);
    p5.circle(170, 48, 15);
  };
};
var myp5 = new p5(exp3, 'e3');

//Example 4
function setup() {
  createCanvas(200, 200);
}

function draw() {
  background('rgb(29,29,118)');
  circle(100, 100, 100);
  fill('green');
  stroke('white');
  strokeWeight(3);
  push();
  translate(width * 0.8, height * 0.5);
  rotate(2.2);
  fill('red');
  stroke('white');
  strokeWeight(3);
  star(35.5, 48, 20, 51, 5);
  pop(); 
}
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}