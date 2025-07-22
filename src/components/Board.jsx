import React, {useRef, useState, useEffect} from 'react';
import p5 from 'p5';
import {getWSToken} from '../services/AuthService';
import {useUser} from '../services/userUtils';

const Board = () => {
  const {userId, email} = useUser();
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const colorRef = useRef("#000000");
  const sizeRef = useRef(20);
  const wsRef = useRef(null);
  const drawQueueRef = useRef([]);

  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(20);
  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  const getToken = async () => {
    try{
    const data = await getWSToken(userId || "");
    return await data.token;
    }catch(error){
      console.log(error);
      alert("Error obtaining auth, please try again later.");
    }
    return undefined;
  }
  // Conexión WebSocket
  useEffect(() => {
    let socket;
    let isMounted = true;
    let reconnectTimeout = null;

    const connectWS = async () => {
      const token = await getToken();
      if (!token || !isMounted) return;
      socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL + `?token=${token}`);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log("✅ Conectado al WebSocket");
      };

      socket.onmessage = (event) => {
        console.log(event.data);
        const data = JSON.parse(event.data);
        if (data.type === "CHAT") {
          let msg = JSON.parse(data.message)
          setChatMessages(prev => [...prev, msg]);
        } else if(data.type === "BOARD") {
          let boardMsg = JSON.parse(data.message)
          drawQueueRef.current.push(boardMsg);
        } else if(data.type === "CLEAR"){
          clearCanvas()
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("❌ WebSocket cerrado");
        if (isMounted) {
          reconnectTimeout = setTimeout(() => {
            console.log("🔄 Reintentando conexión WebSocket...");
            connectWS();
          }, 5000);
        }
      };
    };

    connectWS();
    return () => {
      isMounted = false;
      if (socket) socket.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  const sendPoint = (x, y) => {
    const point = {
      x,
      y,
      color: colorRef.current,
      size: parseInt(sizeRef.current)
    };

    const msg = {
      type: "BOARD",
      message: JSON.stringify(point)
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
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
      wsRef.current.send(JSON.stringify(msg));
    }
  }

  // Enviar mensaje de chat
  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      name: email,
      userId: userId,
      text: chatInput.trim(),
      timestamp: Date.now()
    }
    const chatMsg = {
      type: "CHAT",
      message: JSON.stringify(msg)
    };
    sendM(chatMsg);
    setChatInput("");
    setChatMessages(prev => [...prev, msg]);
  };

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

        <button onClick={() => {clearCanvas(); sendM({type: "CLEAR"});}}>🧹 Clear All</button>
      </div>

      <div id="container" ref={containerRef}></div>

      {/* Chat Section */}
      <div className="chat-section" style={{marginTop: 32, maxWidth: 950, marginLeft: 'auto', marginRight: 'auto'}}>
        <h2>💬 Chat</h2>
        <div className="chat-messages" style={{
          background: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 16,
          height: 200,
          overflowY: 'auto',
          marginBottom: 12
        }}>
          {chatMessages.map((msg, idx) =>
            msg.userId === userId ? (
              <div key={idx} style={{textAlign: 'right', marginBottom: 8}}>
                <span style={{
                  display: 'inline-block',
                  background: '#d1e7dd',
                  color: '#0f5132',
                  borderRadius: 16,
                  padding: '6px 16px',
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                  fontWeight: 500
                }}>{msg.text}</span>
              </div>
            ) : (
              <div key={idx} style={{textAlign: 'left', marginBottom: 8}}>
                <span style={{fontWeight: 600, color: '#333', marginRight: 8}}>{msg.name}:</span>
                <span style={{
                  display: 'inline-block',
                  background: '#e2e3e5',
                  color: '#41464b',
                  borderRadius: 16,
                  padding: '6px 16px',
                  maxWidth: '70%',
                  wordBreak: 'break-word'
                }}>{msg.text}</span>
              </div>
            )
          )}
        </div>
        <form onSubmit={sendChat} style={{display: 'flex', gap: 8}}>
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            style={{flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ccc'}}
          />
          <button type="submit" style={{padding: '8px 16px', borderRadius: 8, background: '#007bff', color: '#fff', border: 'none'}}>Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default Board;