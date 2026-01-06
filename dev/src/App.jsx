import React, { useState, useEffect, useRef } from 'react';

export default function ChaoticRaccoonTimer() {
  const [time, setTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [chaos, setChaos] = useState(0);
  const [raccoons, setRaccoons] = useState([]);
  const [glitchText, setGlitchText] = useState('ＴＩＭＥＲ');
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [screenShake, setScreenShake] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(t => t - 1);
        setChaos(c => Math.min(c + 2, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const texts = ['ＴＩＭＥＲ', 'T̴I̴M̴E̴R̴', 'ＴＩＭＥ？', '⏰⏰⏰', 'ＴＩＭＲ', 'ＴＩＭＥＲ', 'T͎I͎M͎E͎R͎', '🕐🕑🕒', 'ＴＩＭＥＲＲＲＲ', 'tImEr'];
      setGlitchText(texts[Math.floor(Math.random() * texts.length)]);
      setScreenShake(Math.random() * (chaos / 10));
    }, 300);
    return () => clearInterval(glitchInterval);
  }, [chaos]);

  useEffect(() => {
    if (chaos > 50 && raccoons.length < 20) {
      const newRaccoon = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5
      };
      setRaccoons(r => [...r, newRaccoon]);
    }
    
    // Add floating chaos text
    if (isRunning && Math.random() > 0.7) {
      const texts = ['OOER', 'HELP', '🦝', 'OH NO', 'PLZ', 'GARLIC', 'SOCKS', '???', 'BEPIS', '!!!'];
      const newText = {
        id: Date.now() + Math.random(),
        text: texts[Math.floor(Math.random() * texts.length)],
        x: Math.random() * 100,
        y: 110
      };
      setFloatingTexts(t => [...t.slice(-10), newText]);
    }
  }, [chaos, isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = `hsl(${Date.now() / 10 % 360}, 100%, 50%)`;
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 20 + Math.random() * 50, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Random lines
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        ctx.lineWidth = Math.random() * 5;
        ctx.stroke();
      }
      
      if (isRunning) requestAnimationFrame(animate);
    };
    
    if (isRunning && chaos > 20) animate();
  }, [isRunning, chaos]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const hueRotate = (Date.now() / 10) % 360;

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: `linear-gradient(${hueRotate}deg, #ff0080, #00ff80, #0080ff, #ff0080)`,
      backgroundSize: '400% 400%',
      animation: 'gradientShift 3s ease infinite',
      fontFamily: 'Comic Sans MS, cursive',
      transform: `translate(${Math.sin(screenShake) * 5}px, ${Math.cos(screenShake) * 5}px) rotate(${screenShake / 2}deg)`,
      imageRendering: chaos > 60 ? 'pixelated' : 'auto',
      filter: chaos > 80 ? `saturate(${2 + Math.sin(Date.now() / 100)}) contrast(${1.5 + Math.cos(Date.now() / 100) * 0.5})` : 'none'
    }}>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-10px, 10px) rotate(-5deg); }
          75% { transform: translate(10px, -10px) rotate(5deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-5px, 5px); }
          40% { transform: translate(-5px, -5px); }
          60% { transform: translate(5px, 5px); }
          80% { transform: translate(5px, -5px); }
          100% { transform: translate(0); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes seizure {
          0%, 100% { filter: invert(0) hue-rotate(0deg); }
          25% { filter: invert(1) hue-rotate(90deg); }
          50% { filter: invert(0) hue-rotate(180deg); }
          75% { filter: invert(1) hue-rotate(270deg); }
        }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.5, mixBlendMode: 'screen' }} />

      {/* Floating chaos text */}
      {floatingTexts.map(ft => (
        <div key={ft.id} style={{
          position: 'absolute',
          left: `${ft.x}%`,
          top: `${ft.y}%`,
          fontSize: `${1 + Math.random() * 3}rem`,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          fontWeight: 'bold',
          textShadow: '0 0 10px currentColor, 2px 2px 0 #000',
          animation: 'floatUp 3s linear forwards',
          zIndex: 5,
          pointerEvents: 'none',
          transform: `rotate(${Math.random() * 360}deg)`
        }}>
          {ft.text}
        </div>
      ))}

      {raccoons.map(raccoon => (
        <div key={raccoon.id} style={{
          position: 'absolute',
          left: `${raccoon.x}%`,
          top: `${raccoon.y}%`,
          fontSize: `${raccoon.scale * 3}rem`,
          transform: `rotate(${raccoon.rotation}deg)`,
          animation: `spin ${1 + Math.random()}s linear infinite, bounce ${0.5 + Math.random()}s ease-in-out infinite`,
          filter: `hue-rotate(${hueRotate}deg) drop-shadow(0 0 10px rgba(255,255,255,0.8))`,
          zIndex: 1,
          textShadow: '0 0 20px #ff00ff'
        }}>
          🦝
        </div>
      ))}

      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: `translateX(-50%) ${chaos > 70 ? 'rotate(' + (Math.sin(Date.now() / 100) * 10) + 'deg)' : ''}`,
        textAlign: 'center',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '4rem',
          margin: 0,
          color: '#fff',
          textShadow: '0 0 20px #ff00ff, 0 0 40px #00ffff, 5px 5px 0 #000',
          animation: chaos > 50 ? 'glitch 0.3s infinite' : 'none',
          letterSpacing: '0.5rem'
        }}>
          {glitchText}
        </h1>
        <div style={{
          fontSize: '1.5rem',
          color: '#ffff00',
          textShadow: '2px 2px 4px #000',
          marginTop: '10px',
          animation: 'shake 0.5s infinite'
        }}>
          🗑️ Team [object Object] 🗑️
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${1 + chaos / 200}) rotate(${chaos > 80 ? Math.sin(Date.now() / 200) * 15 : 0}deg)`,
        zIndex: 10
      }}>
        <div style={{
          fontSize: '10rem',
          fontWeight: 'bold',
          color: '#ffffff',
          textShadow: `
            0 0 10px #ff0000,
            0 0 20px #ff00ff,
            0 0 30px #00ffff,
            0 0 40px #ffff00,
            10px 10px 0 #000,
            -5px -5px 0 #ff0000,
            5px -5px 0 #00ff00,
            -5px 5px 0 #0000ff
          `,
          animation: time < 30 ? 'shake 0.2s infinite' : 'none',
          filter: time < 10 ? `hue-rotate(${Date.now() % 360}deg) brightness(1.5) blur(${Math.sin(Date.now() / 100)}px)` : 'none',
          WebkitTextStroke: '2px #000'
        }}>
          {formatTime(time)}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 10
      }}>
        <button onClick={() => setIsRunning(!isRunning)} style={{
          fontSize: '2rem',
          padding: '20px 40px',
          background: `linear-gradient(45deg, #ff00ff, #00ffff)`,
          border: '5px solid #fff',
          borderRadius: '20px',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          textShadow: '2px 2px 4px #000',
          boxShadow: '0 0 20px #ff00ff, 0 10px 0 #000, inset 0 0 20px rgba(255,255,255,0.5)',
          transform: `translateY(0) rotate(${Math.sin(Date.now() / 500) * 5}deg)`,
          transition: 'transform 0.1s',
          animation: 'bounce 1s ease-in-out infinite',
          filter: `hue-rotate(${Date.now() / 20 % 360}deg)`
        }} onMouseDown={(e) => e.target.style.transform = 'translateY(10px)'} onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}>
          {isRunning ? '⏸️ ＰＡＵＳＥ' : '▶️ ＳＴＡＲＴ'}
        </button>
        <button onClick={() => { setTime(300); setChaos(0); setRaccoons([]); setFloatingTexts([]); setIsRunning(false); }} style={{
          fontSize: '2rem',
          padding: '20px 40px',
          background: `linear-gradient(45deg, #ff0000, #ff8800)`,
          border: '5px solid #fff',
          borderRadius: '20px',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          textShadow: '2px 2px 4px #000',
          boxShadow: '0 0 20px #ff0000, 0 10px 0 #000, inset 0 0 20px rgba(255,255,255,0.5)',
          transform: `translateY(0) rotate(${Math.cos(Date.now() / 500) * 5}deg)`,
          transition: 'transform 0.1s',
          animation: `spin 4s linear infinite ${chaos > 70 ? ', seizure 0.5s infinite' : ''}`,
        }} onMouseDown={(e) => e.target.style.transform = 'translateY(10px)'} onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}>
          🔄 ＲＥＳＥＴ
        </button>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '150px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 10
      }}>
        {[60, 180, 300, 600].map(seconds => (
          <button key={seconds} onClick={() => setTime(seconds)} style={{
            fontSize: '1.2rem',
            padding: '10px 20px',
            background: '#000',
            border: `3px solid hsl(${seconds * 2}, 100%, 50%)`,
            borderRadius: '10px',
            color: `hsl(${seconds * 2}, 100%, 50%)`,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: `0 0 10px hsl(${seconds * 2}, 100%, 50%)`,
            animation: 'shake 2s ease-in-out infinite'
          }}>
            {Math.floor(seconds / 60)}m
          </button>
        ))}
      </div>

      <div style={{
        position: 'absolute',
        top: '150px',
        right: '20px',
        fontSize: '1.5rem',
        color: '#fff',
        textShadow: '2px 2px 4px #000',
        transform: `rotate(${Math.sin(Date.now() / 500) * 10}deg)`,
        zIndex: 10
      }}>
        🦝 ＣＨＡＯＳ: {Math.floor(chaos)}% 🦝
      </div>

      {time === 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'glitch 0.1s infinite, seizure 0.3s infinite'
        }}>
          <div style={{
            fontSize: '8rem',
            color: '#fff',
            textShadow: '0 0 50px #ff0000, 0 0 100px #ff00ff, 10px 10px 0 #000',
            animation: 'spin 1s linear infinite, shake 0.1s infinite',
            filter: `hue-rotate(${Date.now() % 360}deg) brightness(2)`
          }}>
            🦝 ＴＩＭＥ ＵＰ！ 🦝
          </div>
        </div>
      )}

      {/* Random corner elements */}
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          [i % 2 === 0 ? 'left' : 'right']: '20px',
          [i < 2 ? 'top' : 'bottom']: '20px',
          fontSize: '3rem',
          animation: `spin ${2 + i}s linear infinite, bounce 1s ease-in-out infinite`,
          filter: `hue-rotate(${(Date.now() / 10 + i * 90) % 360}deg)`,
          opacity: chaos > 40 ? 1 : 0,
          transition: 'opacity 0.5s'
        }}>
          {['🗑️', '🦝', '⚠️', '❗'][i]}
        </div>
      ))}
    </div>
  );
}