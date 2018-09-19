import React, { Component } from 'react';
import PropTypes from "prop-types";
import mutedIcon from '../assets/audio-muted.svg';
import playingIcon from '../assets/audio-playing.svg';

const CIRCUMFERENCE = 273;

export default class Controls extends Component {
    static propTypes = {
        playHead: PropTypes.number,
        trackDuration: PropTypes.number,
        muted: PropTypes.bool,
        toggleAudio: PropTypes.func,
    }

  updateTrackCompletion = () => {
    const { playHead, trackDuration } = this.props;
    if (!playHead || !trackDuration) return 0;
    return playHead / trackDuration;
  };

  playheadStyle = () => {
    const audioCompletion = this.updateTrackCompletion();
    const offset = CIRCUMFERENCE - audioCompletion * CIRCUMFERENCE;
    return {
      strokeDashoffset: offset,
    };
  };

  render() {
    const { muted, toggleAudio } = this.props;
    return (
      <div className="controls">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
          <circle
            className="controls__playhead"
            style={this.playheadStyle()}
            cx="45"
            cy="45"
            r="40"
          />

          <circle className="controls__ghost" cx="45" cy="45" r="40" />
        </svg>

        <button
          className="controls__button"
          data-muted={muted}
          onClick={toggleAudio}
        >
          <img
            src={mutedIcon}
            className="controls__button__icon"
            data-audio-state="muted"
            alt="muted"
          />
          <img
            src={playingIcon}
            className="controls__button__icon"
            data-audio-state="playing"
            alt="play"
          />
        </button>
      </div>
    );
  }
}
