import React, { useEffect, useRef } from "react";

const CircularEqualizer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Fullscreen canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.9;

      const bufferLength = Math.floor(analyser.frequencyBinCount / 3);
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;
        const radius = Math.min(WIDTH, HEIGHT) * 0.28;
        const maxBarLength = Math.min(WIDTH, HEIGHT) * 0.18;

        for (let i = 0; i < bufferLength * 3; i++) {
          const dataIndex = i % bufferLength;

          const rawHeight = dataArray[dataIndex] * 0.9;
          const barHeight = Math.min(Math.max(rawHeight, 2), maxBarLength);
          const angle = (i * Math.PI * 2) / (bufferLength * 3);

          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          const xEnd =
            centerX + Math.cos(angle) * (radius + barHeight);
          const yEnd =
            centerY + Math.sin(angle) * (radius + barHeight);

          
          const hue = (i / bufferLength) * 360;
          ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;

          
          ctx.shadowBlur = 15;
          ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(xEnd, yEnd);
          ctx.stroke();
        }
      }

      draw();
    });

    // Resize handling
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "black",
      }}
    />
  );
};

export default CircularEqualizer;
