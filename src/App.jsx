import { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

function App() {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const colorRef = useRef("#000000");
  const sizeRef = useRef(20);
  const wsRef = useRef(null);
  const drawQueueRef = useRef([]);

  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(20);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  // Conexión WebSocket
  useEffect(() => {
    const socket = new WebSocket("wss://boardback-ergfg6cxfudshkbz.canadacentral-01.azurewebsites.net/bbService");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Conectado al WebSocket");
    };

    socket.onmessage = (event) => {
      console.log(event.data);
      const data = JSON.parse(event.data);

      // Guardamos los puntos recibidos en una cola para pintar en draw()
      drawQueueRef.current.push(data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket cerrado");
    };

    return () => socket.close(); // Limpiar al desmontar
  }, []);

  const sendPoint = (x, y) => {
    const point = {
      x,
      y,
      color: colorRef.current,
      size: parseInt(sizeRef.current)
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(point));
    }
  };

  const clearCanvas = () => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.clear();
      p5InstanceRef.current.background(255);
    }
  };

  const sendM=(msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    }
  }

  const sketch = (p) => {
    p.setup = () => {
      p.createCanvas(950, 600);
      p.background(255);
    };

    p.draw = () => {
      // Pintar puntos recibidos del WebSocket
      while (drawQueueRef.current.length > 0) {
        const point = drawQueueRef.current.shift();
        if(!point.msg){
          p.fill(point.color);
          p.noStroke();
          p.ellipse(point.x, point.y, point.size, point.size);
        }else{
          clearCanvas();
        }
      }

      // Enviar punto si el mouse está presionado (dibujo local)
      if (p.mouseIsPressed && p.mouseX >= 0 && p.mouseY >= 0) {
        sendPoint(p.mouseX, p.mouseY);
        p.fill(colorRef.current);
        p.noStroke();
        p.ellipse(p.mouseX, p.mouseY, sizeRef.current, sizeRef.current);
      }
    };
  };

  useEffect(() => {
    p5InstanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="board">
      <h1>Draw Board</h1>

      <div className="controls">
        <label>
          🎨 Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <label>
          📏 Size: {size + "px"}
          <input
            type="range"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            min={1}
            max={100}
          />
        </label>

        <button onClick={() => {clearCanvas(); sendM("CLEAR");}}>🧹 Clear All</button>
      </div>

      <div id="container" ref={containerRef}></div>
    </div>
  );
}

export default App;
