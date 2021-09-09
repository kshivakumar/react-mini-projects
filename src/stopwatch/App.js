import React from "react"
import "./App.css"

const formatTime = centiSecs => {
  let [hrs, mins, secs] = [0, 0, 0]

  if (centiSecs > 99) {
    secs = Math.floor(centiSecs / 100)
    centiSecs = centiSecs % 100
  }

  if (secs > 3599) {
    hrs = Math.floor(secs / 3600)
    secs = secs % 3600
  }

  if (secs > 59) {
    mins = Math.floor(secs / 60)
    secs = secs % 60
  }

  hrs = String(hrs).padStart(2, "0")
  mins = String(mins).padStart(2, "0")
  secs = String(secs).padStart(2, "0")
  centiSecs = String(centiSecs).padStart(2, "0")

  return `${hrs}:${mins}:${secs}.${centiSecs}`
}

const Lap = ({ seq, splitTime, lapTime }) => {
  return (
    <div className="stopwatch-lap">
      <span>{seq}</span>
      <span>{splitTime}</span>
      <span>{lapTime}</span>
    </div>
  )
}

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
  )
})

const StartBtn = ({ onClick }) => <button onClick={onClick}>Start</button>

const PauseResumeBtn = React.memo(({ timerStatus, onClick }) => (
  <button onClick={onClick}>{timerStatus ? "Pause" : "Resume"}</button>
))

const LapResetBtn = React.memo(({ timerStatus, onClick }) => (
  <button onClick={onClick}>{timerStatus ? "Lap" : "Reset"}</button>
))

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      centiSeconds: 0,
      laps: [],
      intervalId: null,
    }
  }

  runTimer = () => {
    const intervalId = setInterval(
      () =>
        this.setState(state => {
          return { ...state, centiSeconds: state.centiSeconds + 1 }
        }),
      10
    )

    this.setState(state => {
      return { ...state, intervalId: intervalId }
    })
  }

  clearTimer = () => {
    clearInterval(this.state.intervalId)
    this.setState(state => {
      return { ...state, intervalId: null }
    })
  }

  componentWillUnmount = () => this.clearTimer()

  handleStart = () => this.runTimer()

  handlePauseResume = () =>
    this.state.intervalId ? this.clearTimer() : this.runTimer()

  handleLapReset = () => {
    if (this.state.intervalId) {
      this.setState(state => {
        return { ...state, laps: [...state.laps, state.centiSeconds] }
      })
    } else {
      this.clearTimer()
      this.setState(state => {
        return { ...state, centiSeconds: 0, laps: [] }
      })
    }
  }

  render() {
    return (
      <div className="stopwatch-container">
        <span className="stopwatch-time">
          {formatTime(this.state.centiSeconds)}
        </span>
        {this.state.centiSeconds === 0 ? (
          <StartBtn onClick={this.handleStart} />
        ) : (
          <div className="stopwatch-two-btns">
            <PauseResumeBtn
              timerStatus={this.state.intervalId}
              onClick={this.handlePauseResume}
            />
            <LapResetBtn
              timerStatus={this.state.intervalId}
              onClick={this.handleLapReset}
            />
          </div>
        )}
        {this.state.laps ? <Laps laps={this.state.laps} /> : null}
      </div>
    )
  }
}

export default App
