const WebSocket = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocket.Server({ port: 5000 });

console.log("WebSocket server running on ws://localhost:5000");

wss.on("connection", (ws) => {
  console.log("Client connected");

  
  const fakeSentence = [
    "hello",
    "this",
    "is",
    "a",
    "real",
    "time",
    "speech",
    "transcription",
    "demo"
  ];

  let wordIndex = 0;
  let isSpeaking = false;
  let lastSpeechTime = Date.now();

  ws.on("message", (audioChunk) => {
    const buffer = Buffer.from(audioChunk);

    
    let sumSquares = 0;
    for (let i = 0; i < buffer.length; i++) {
      const val = buffer[i] - 128;
      sumSquares += val * val;
    }

    const rms = Math.sqrt(sumSquares / buffer.length);

    const SPEECH_THRESHOLD = 18;     
    const SILENCE_TIMEOUT = 700;     

    const now = Date.now();

    
    if (rms > SPEECH_THRESHOLD) {
      lastSpeechTime = now;

      if (!isSpeaking) {
        isSpeaking = true;
        console.log("Speech started");
      }

      
      const word = fakeSentence[wordIndex % fakeSentence.length];
      ws.send(word);
      wordIndex++;
    }

    
    if (isSpeaking && now - lastSpeechTime > SILENCE_TIMEOUT) {
      isSpeaking = false;
      console.log("Speech ended");
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
