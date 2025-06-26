import { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

function App() {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null); 
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(20);
  const colorRef = useRef(null);
  const sizeRef = useRef(null);

  useEffect(()=>{
    colorRef.current = color;
  },[color])

  const clearCanvas = () => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.clear(); 
      p5InstanceRef.current.background(255); 
    }
  };
  
  useEffect(() => {
    sizeRef.current = size;
  }, [size])
  const sketch = (p) => {
    p.setup = () => {
      p.createCanvas(950, 600);
      p.background(255);
    };

    p.draw = () => {
      if (p.mouseIsPressed) {
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
            ref={colorRef}
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <label>
          📏 Size: {size + "px"} 
          <input
            type="range"
            ref={sizeRef}
            value={size}
            onChange={(e) => setSize(e.target.value)}
            min={1}
            max={100}
          />
        </label>

        <button onClick={clearCanvas}>🧹 Clear All</button>
      </div>

      <div id="container" ref={containerRef}></div>
    </div>

  );
}

export default App;
