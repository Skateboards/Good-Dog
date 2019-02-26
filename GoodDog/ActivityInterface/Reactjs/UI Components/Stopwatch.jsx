import React from "react";
import LatLongTest from "../LatLongTest";
import ReactCountdownClock from "react-countdown-clock";
import * as prompts from "../NotificationMessage";
import "../../styles/countdownclock.css";
import swal from "sweetalert";
import { Flip } from "react-toastify";

const formattedSeconds = sec =>
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsElapsed: 0,
      lastClearedIncrementer: null,
      renderLatLong: true,
      coordinates: null,
      paused: false,
      points: 0
    };
    this.incrementer = null;
    this.pauseIncrementer = null;
  }

  pointCalc = () => {
    if (
      this.props.currentUser.roles &&
      this.props.currentUser.roles.includes("Premium")
    ) {
      if (this.state.secondsElapsed < 1080) {
        let vpt = 2;
        return Math.floor((this.state.secondsElapsed / 360) * vpt);
      } else if (
        this.state.secondsElapsed >= 1080 &&
        this.state.secondsElapsed < 2520
      ) {
        let vpt = 4;
        return Math.floor((this.state.secondsElapsed / 360) * vpt);
      } else if (
        this.state.secondsElapsed >= 2520 &&
        this.state.secondsElapsed < 3600
      ) {
        let vpt = 6;
        return Math.floor((this.state.secondsElapsed / 360) * vpt);
      } else if (this.state.secondsElapsed >= 3600) {
        return 80;
      }
    } else {
      if (this.state.secondsElapsed < 1080) {
        let vpt = 1;
        return Math.floor((this.state.secondsElapsed / 360) * vpt);
      } else if (
        this.state.secondsElapsed >= 1080 &&
        this.state.secondsElapsed < 2520
      ) {
        let vpt = 2;
        return Math.floor((this.state.secondsElapsed / 360) * vpt);
      } else if (
        this.state.secondsElapsed >= 2520 &&
        this.state.secondsElapsed < 3600
      ) {
        let vpt = 3;
        return Math.floor((this.state.secondsElapsed / 360) * vpt);
      } else if (this.state.secondsElapsed >= 3600) {
        return 40;
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.points !== this.state.points) {
      this.pointsRequested();
    }
    if (
      this.props.currentUser.roles &&
      this.props.currentUser.roles.includes("Premium")
    ) {
      if (this.state.secondsElapsed === 600) {
        prompts.warning({
          message: "Walk 2 more minutes for an extra 2 points!",
          position: "top-center",
          hideProgressBar: false,
          transition: Flip,
          autoClose: 10000
        });
      }
      if (this.state.secondsElapsed === 900) {
        swal({
          title: "CHALLENGE",
          text: "Walk another 9 minutes and earn 16 points!",
          showCancelButton: false,
          autoClose: 10000,
          confirmButtonText: "Let's do it!",
          closeOnConfirm: true
        });
      }
      if (this.state.secondsElapsed === 1500) {
        prompts.warning({
          message: "Walk 5 more minutes and earn an extra 4 points!",
          position: "top-center",
          hideProgressBar: false,
          transition: Flip,
          autoClose: 10000
        });
      }
      if (this.state.secondsElapsed === 1800) {
        swal({
          title: "CHALLENGE",
          text: "Walk another 15 minutes and earn 42 points!",
          showCancelButton: false,
          autoClose: 10000,
          confirmButtonText: "Let's do it!",
          closeOnConfirm: true
        });
      }
      if (this.state.secondsElapsed === 2520) {
        swal({
          title: "CHALLENGE",
          text: "Walk a full 60 minutes and earn 80 points!",
          showCancelButton: false,
          autoClose: 10000,
          confirmButtonText: "Let's do it!",
          closeOnConfirm: true
        });
      }
      if (this.state.secondsElapsed === 3601) {
        prompts.prompt({
          title: "Great Work!",
          text: "You earned 80 points!",
          icon: "success"
        });
      }
    } else {
      if (this.state.secondsElapsed === 600) {
        prompts.warning({
          message: "Walk 2 more minutes for an extra point!",
          position: "top-center",
          hideProgressBar: false,
          transition: Flip,
          autoClose: 10000
        });
      }
      if (this.state.secondsElapsed === 900) {
        swal({
          title: "CHALLENGE",
          text: "Walk another 9 minutes and earn 8 points!",
          showCancelButton: false,
          autoClose: 10000,
          confirmButtonText: "Let's do it!",
          closeOnConfirm: true
        });
      }
      if (this.state.secondsElapsed === 1500) {
        prompts.warning({
          message: "Walk 5 more minutes and earn an extra 2 points!",
          position: "top-center",
          hideProgressBar: false,
          transition: Flip,
          autoClose: 10000
        });
      }
      if (this.state.secondsElapsed === 1800) {
        swal({
          title: "CHALLENGE",
          text: "Walk another 15 minutes and earn 21 points!",
          showCancelButton: false,
          autoClose: 10000,
          confirmButtonText: "Let's do it!",
          closeOnConfirm: true
        });
      }
      if (this.state.secondsElapsed === 2520) {
        swal({
          title: "CHALLENGE",
          text: "Walk a full 60 minutes and earn 40 points!",
          showCancelButton: false,
          autoClose: 10000,
          confirmButtonText: "Let's do it!",
          closeOnConfirm: true
        });
      }
      if (this.state.secondsElapsed === 3601) {
        prompts.prompt({
          title: "Great Work!",
          text: "You earned 40 points!",
          icon: "success"
        });
      }
    }
  }

  pauseSuccess = response => {
    console.log(response);
  };

  pauseFail = error => {
    console.log(error);
  };

  startingLocation() {
    this.incrementer = setInterval(null, 1);
  }

  handleStartClick() {
    this.startingLocation();
    this.props.currentActivityRequester();

    this.incrementer = setInterval(
      () =>
        this.setState({
          paused: false,
          secondsElapsed: this.state.secondsElapsed + 1,
          points: this.pointCalc()
        }),
      1000
    );
  }

  handleStopClick() {
    clearInterval(this.incrementer);
    let newPoints = this.pointCalc();
    this.setState(
      {
        lastClearedIncrementer: this.incrementer,
        renderLatLong: false,
        points: newPoints
      },
      console.log(this.state)
    );
  }

  handleResumeClick() {
    this.incrementer = setInterval(
      () =>
        this.setState({
          secondsElapsed: this.state.secondsElapsed + 1,
          paused: false
        }),
      1000
    );
  }

  pauseRequested = () => {
    this.handlePauseClick();
  };

  handlePauseClick() {
    clearInterval(this.incrementer);
  }

  onComplete = () => {
    this.handleStartClick();
  };
  pointsRequested = () => {
    this.props.pointRequester(this.state.points);
  };

  render() {
    let stopwatchStyle = {
      fontFamily: "sans-serif",
      margin: 0,
      textAlign: "center",
      justifyContent: "center"
    };

    let timerStyle = {
      fontSize: 76,
      fontWeight: 100,
      lineHeight: 160 + "px",
      margin: 0
    };

    let titleText = {
      fontSize: 26,
      fontWeight: 600
    };

    let stopButtonStyle = {
      fontFamily: "inherit",
      fontSize: 16,
      display: "inline-block",
      width: 72,
      height: 72,
      margin: 24,
      padding: 0,
      cursor: "pointer",
      letterSpacing: 1,
      border: 0,
      borderRadius: 50 + "%",
      outline: "none",
      background: "white",
      color: "#fd3d2a"
    };

    if (
      this.state.renderLatLong === true &&
      this.state.secondsElapsed === 0 &&
      this.state.paused === false
    ) {
      return (
        <div className="stopwatch" style={stopwatchStyle}>
          <div className="d-flex flex-row">
            <div className="countdownClockContainer">
              <ReactCountdownClock
                seconds={5}
                color="#37bc9b"
                alpha={0.9}
                size={200}
                onComplete={this.onComplete}
                paused={false}
              />
              <p style={titleText}>Starting...</p>
            </div>
          </div>
        </div>
      );
    } else if (
      this.state.renderLatLong === true &&
      this.state.secondsElapsed > 0 &&
      this.state.paused === false
    ) {
      return (
        <div className="stopwatch" style={stopwatchStyle}>
          <LatLongTest
            {...this.props}
            {...this.state}
            pauseRequester={this.pauseRequested}
          />
          <h1 className="stopwatch-timer" style={timerStyle}>
            {formattedSeconds(this.state.secondsElapsed)}
          </h1>
          <Button
            className="stop-btn"
            style={stopButtonStyle}
            onClick={this.handleStopClick.bind(this)}
          >
            stop
          </Button>
        </div>
      );
    } else if (
      this.state.renderLatLong === true &&
      this.state.secondsElapsed > 0 &&
      this.state.paused === true
    ) {
      return (
        <div className="stopwatch" style={stopwatchStyle}>
          <LatLongTest
            {...this.props}
            {...this.state}
            pauseRequester={this.pauseRequested}
          />
          <h1 className="stopwatch-timer" style={timerStyle}>
            {formattedSeconds(this.state.secondsElapsed)}
          </h1>
          <Button
            className="stop-btn"
            style={stopButtonStyle}
            onClick={this.handleStopClick.bind(this)}
          >
            stop
          </Button>
        </div>
      );
    } else if (this.state.renderLatLong === false) {
      return (
        <div className="stopwatch" style={stopwatchStyle}>
          <h1 className="stopwatch-timer" style={timerStyle}>
            {formattedSeconds(this.state.secondsElapsed)}
          </h1>
        </div>
      );
    }
  }
}

const Button = props => (
  <button type="button" {...props} className={"btn " + props.className} />
);

export default Stopwatch;
