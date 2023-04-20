const int xPin = A0; // Analog joystick X-axis
const int yPin = A1; // Analog joystick Y-axis
const int buttonPin = 2; // Button

int xValue = 0;
int yValue = 0;
bool buttonState = false;
int colorIndex = 0;

void setup() {
  Serial.begin(9600);

  pinMode(xPin, INPUT);
  pinMode(yPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  xValue = analogRead(xPin);
  yValue = analogRead(yPin);
  buttonState = digitalRead(buttonPin);

  if (buttonState == LOW) {
    colorIndex++;
    if (colorIndex > 9) {
      colorIndex = 0;
    }
    delay(200);
  }

  // Format the data as a JSON string
  String jsonString = "{";
  jsonString += "\"x\":" + String(xValue) + ",";
  jsonString += "\"y\":" + String(yValue) + ",";
  jsonString += "\"colorIndex\":" + String(colorIndex) + "}";
  
  // Send the JSON string over serial
  Serial.println(jsonString);
  
  delay(10);
}
