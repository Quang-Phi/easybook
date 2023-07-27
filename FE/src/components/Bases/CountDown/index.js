import React, { memo } from 'react';
import Countdown from 'react-countdown';
import './CountDown.scss';

const CountDown = ({ countdownDays }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
    } else {
      return (
        <div className="countdown-wrap">
          <div className="count-down countdown-days">
            <span>{days}</span>
            <p>Days</p>
          </div>
          <div className="count-down countdown-hours">
            <span>{hours}</span>
            <p>Hours</p>
          </div>
          <div className="count-down countdown-minutes">
            <span>{minutes}</span>
            <p>Minutes</p>
          </div>
          <div className="count-down countdown-seconds">
            <span>{seconds}</span>
            <p>Seconds</p>
          </div>
        </div>
      );
    }
  };

  const countdownTimeInMilliseconds = countdownDays * 24 * 60 * 60 * 1000;

  return (
    <Countdown
      date={Date.now() + countdownTimeInMilliseconds}
      renderer={renderer}
    />
  );
};

export default memo(CountDown);
