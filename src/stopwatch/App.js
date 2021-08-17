import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const formatTime = (centiSecs) => {
  let [hrs, mins, secs] = [0, 0, 0];

  if (centiSecs > 99) {
    secs = Math.floor(centiSecs / 100);
    centiSecs = centiSecs % 100;
  }

  if (secs > 3659) {
    hrs = Math.floor(secs / 3600);
    secs = secs % 3600;
  }

  if (secs > 59) {
    mins = Math.floor(secs / 60);
    secs = secs % 60;
  }

  hrs = String(hrs).padStart(2, "0");
  mins = String(mins).padStart(2, "0");
  secs = String(secs).padStart(2, "0");
  centiSecs = String(centiSecs).padStart(2, "0");

  return `${hrs}:${mins}:${secs}.${centiSecs}`;
};

const Lap = ({ seq, splitTime, lapTime }) => {
  return (
    <div className="stopwatch-lap">
      <span>{seq}</span>
      <span>{splitTime}</span>
      <span>{lapTime}</span>
    </div>
  );
};

const Laps = React.memo(({ laps }) => {
  return (
    <div className="stopwatch-laps">
      {laps.map((l, i, ls) => (
        <Lap
          key={l + i}
          seq={i + 1}
          splitTime={formatTime(l)}
          lapTime={formatTime(i ? l - ls[i - 1] : l)}
        />
      ))}
    </div>
  );
});

const StartBtn = ({ onClick }) => <button onClick={onClick}>Start</button>;

const PauseResumeBtn = React.memo(({ timerStatus, onClick }) => (
  <button onClick={onClick}>{timerStatus ? "Pause" : "Resume"}</button>
));

const LapResetBtn = React.memo(({ timerStatus, onClick }) => (
  <button onClick={onClick}>{timerStatus ? "Lap" : "Reset"}</button>
));

function App() {
  const [centiSeconds, setcentiSeconds] = useState(0);
  const [laps, setLaps] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  const runTimer = () => {
    setIntervalId(setInterval(() => setcentiSeconds((state) => state + 1), 10));
  };

  const clearTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  useEffect(() => () => clearTimer, []);

  const handleStart = () => {
    runTimer();
  };

  const handlePauseResume = useCallback(() => {
    if (intervalId) {
      clearTimer();
    } else {
      runTimer();
    }
  }, [intervalId]);

  // Can't use useCallback here, centiSeconds is a dependency.
  // If centiSeconds is not used as a depenency,
  // only its intial value(0) is used by setLaps(closure behaviour)
  // Make this component class based?
  const handleLapReset = () => {
    if (intervalId) {
      setLaps((state) => [...state, centiSeconds]);
    } else {
      clearTimer();
      setcentiSeconds(0);
      setLaps([]);
    }
  };

  return (
    <div className="stopwatch-container">
      <span className="stopwatch-time">{formatTime(centiSeconds)}</span>
      {centiSeconds === 0 ? (
        <StartBtn onClick={handleStart} />
      ) : (
        <div className="stopwatch-two-btns">
          <PauseResumeBtn
            timerStatus={intervalId}
            onClick={handlePauseResume}
          />
          <LapResetBtn timerStatus={intervalId} onClick={handleLapReset} />
        </div>
      )}
      {laps ? <Laps laps={laps} /> : null}
    </div>
  );
}

export default App;
