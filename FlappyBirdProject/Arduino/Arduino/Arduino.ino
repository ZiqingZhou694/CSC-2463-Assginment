const int ledPin = 2;
const int jumpButtonPin = 3;
const int restartButtonPin = 4;
const int segmentPins[] = {5, 6, 7, 8,9,10,11};
const int digitPins[] = {12};
const byte digitValues[] = {
  0b00111111, 0b00000110, 0b01011011, 0b01001111, 0b01100110,
  0b01101101, 0b01111101, 0b00000111, 0b01111111, 0b01100111
};

volatile int score = 0;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(jumpButtonPin, INPUT_PULLUP);
  pinMode(restartButtonPin, INPUT_PULLUP);

  for (int i = 0; i < 7; i++) {
    pinMode(segmentPins[i], OUTPUT);
  }
  
  pinMode(digitPins[0], OUTPUT);

  Serial.begin(9600);
}

void displayDigit(int value) {
  for (int i = 0; i < 7; i++) {
    digitalWrite(segmentPins[i], bitRead(digitValues[value], i));
  }
  delay(5);
}

void loop() {
  int jumpButtonState = digitalRead(jumpButtonPin);
  int restartButtonState = digitalRead(restartButtonPin);

  if (jumpButtonState == LOW) {
    Serial.println('J');
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
  }

  if (restartButtonState == LOW) {
    Serial.println('R');
  }

  if (Serial.available()) {
    score = Serial.parseInt();
  }

  if (score < 10) {
    displayDigit(score);
  }
}
