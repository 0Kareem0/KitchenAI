import React, { useState, useEffect } from "react";
import { ClockIcon, SparklesIcon, CheckIcon } from "./Icons";

export default function KitchenTimer() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(300); // default 5 mins

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const startTimer = (mins) => {
    const totalSec = mins * 60;
    setInitialSeconds(totalSec);
    setSecondsLeft(totalSec);
    setIsRunning(true);
  };

  const toggleRun = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(initialSeconds);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(0);
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;

  return (
    <div className="kitchen-timer-card">
      <div className="timer-header">
        <div className="timer-title-group">
          <ClockIcon className="timer-icon" />
          <h4>Interactive Kitchen Timer</h4>
        </div>
        {secondsLeft === 0 && isRunning === false && initialSeconds > 0 && progressPercent === 100 && (
          <span className="timer-done-badge"><CheckIcon /> Timer Done!</span>
        )}
      </div>

      <div className="timer-display-wrapper">
        <div className="timer-digital-display">
          {formatTime(secondsLeft)}
        </div>
        
        <div className="timer-progress-bg">
          <div className="timer-progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="timer-presets">
        <button type="button" className="timer-preset-btn" onClick={() => startTimer(2)}>2 min</button>
        <button type="button" className="timer-preset-btn" onClick={() => startTimer(5)}>5 min</button>
        <button type="button" className="timer-preset-btn" onClick={() => startTimer(10)}>10 min</button>
        <button type="button" className="timer-preset-btn" onClick={() => startTimer(15)}>15 min</button>
        <button type="button" className="timer-preset-btn" onClick={() => startTimer(25)}>25 min</button>
      </div>

      <div className="timer-controls">
        <button 
          type="button" 
          className={`timer-action-btn ${isRunning ? "pause" : "start"}`}
          onClick={toggleRun}
          disabled={secondsLeft === 0 && !isRunning && initialSeconds === 0}
        >
          {isRunning ? "Pause" : secondsLeft > 0 ? "Resume" : "Start"}
        </button>

        <button type="button" className="timer-action-btn reset" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}
