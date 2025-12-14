let socket;
let mediaRecorder;
let audioStream;

const startBtn = document.getElementById("startBtn");
const output = document.getElementById("output");

startBtn.onclick = async () => {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => {
      mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === 1) {
          socket.send(event.data);
        }
      };

      mediaRecorder.start(500);

      startBtn.innerText = "Recording...";
      startBtn.disabled = true;
    };

    socket.onmessage = (event) => {
      output.innerText += " " + event.data;
    };

  } catch (err) {
    alert("Microphone permission denied or unavailable");
    console.error(err);
  }
};
