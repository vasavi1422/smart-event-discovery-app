import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Alarm() {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");

  let audioContext = null;
  let interval = null;

  const playSound = () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    interval = setInterval(() => {
      const g = audioContext.createGain();
      const o = audioContext.createOscillator();

      o.frequency.value = 880;
      o.connect(g);
      g.connect(audioContext.destination);

      g.gain.setValueAtTime(0, audioContext.currentTime);
      g.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);
      g.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

      o.start();
      o.stop(audioContext.currentTime + 0.5);
    }, 1000);
  };

  const stopSound = () => {
    if (interval) clearInterval(interval);
  };

  useEffect(() => {
    socket.on("new_event", (data) => {
      setTitle(data.title);
      setVisible(true);
      playSound();
    });

    return () => socket.off("new_event");
  }, []);

  const handleOK = () => {
    stopSound();
    setVisible(false);
  };

  const handleSnooze = () => {
    stopSound();
    setVisible(false);

    setTimeout(() => {
      setVisible(true);
      playSound();
    }, 60 * 60 * 1000);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#ffe5e5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      zIndex: 9999
    }}>
      <h2>Now</h2>
      <h3>{title}</h3>

      <button onClick={handleOK}>Taken (OK)</button>
      <button onClick={handleSnooze}>Snooze (1 hr)</button>
    </div>
  );
}