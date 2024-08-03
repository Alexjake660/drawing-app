// pages/index.js
import { useEffect, useRef } from "react";
import io from "socket.io-client";

const Home = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socketRef.current = io();

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socketRef.current.on("draw", (data) => {
        drawOnCanvas(data);
      });
    };

    socketInitializer();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const drawOnCanvas = (data) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineTo(data.x, data.y);
    context.stroke();
  };

  const handleMouseMove = (e) => {
    if (e.buttons !== 1) return; // Only draw when the mouse is pressed
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    socketRef.current.emit("draw", { x, y });
    drawOnCanvas({ x, y });
  };

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} onMouseMove={handleMouseMove}></canvas>
    </div>
  );
};

export default Home;
