import React, { Component } from 'react';
import vegas from '../assets/vegas.mp3';
import Overlay from './overlay';
import Controls from './controls';
import Liquid3D from './liquid3D';
import { map } from '../util/tools';

const AUDIO_DATA = {
  audioSource: vegas,
  album: 'I Created Disco',
  artist: 'Calvin Harris',
  song: 'Vegas',
  lyrics: 'Ive got my car and my ride and my wheels',
  playhead: 0.0,
  muted: false,
};

/* eslint-disable react/prefer-stateless-function */
export default class Audio3D extends Component {
  state = {
    muted: false,
  };

  componentDidMount = () => {
    const { audioSource } = AUDIO_DATA;

    const AudioContext = window.AudioContext; // Default

    const context = new AudioContext();

    const request = new XMLHttpRequest();
    this.analyser = context.createAnalyser();
    this.analyser.fftSize = 256;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    request.open('GET', audioSource, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      context.decodeAudioData(request.response, onDecoded);
    };

    const onDecoded = buffer => {
      this.trackDuration = buffer.duration;
      const bufferSource = context.createBufferSource();
      bufferSource.buffer = buffer;
      bufferSource.connect(this.analyser);

      // Route the analyser through the gainNode for muting
      this.gainNode = context.createGain();
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(context.destination);

      bufferSource.start();
    };
    request.send();
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1);
  };

  analyzeAudio() {
    const masterOffsetRaw = Math.pow(
      (this.dataArray[0] < 100 ? 0 : this.dataArray[0] - 100) / 155,
      3,
    );
    const masterOffset = masterOffsetRaw * 50;
    const highs = Math.max(...this.dataArray.slice(25, 28));
    const masterOffset2Raw = Math.pow((highs < 100 ? 0 : highs - 100) / 155, 3);
    const masterOffset2 = masterOffset2Raw * 50;

    const low = map(masterOffset, 0, 30, 0, 1);
    const high = map(masterOffset2, 0, 20, 0, 1);
    this.audioData = { low, high };

    this.playHead = this.analyser.context.currentTime;
  }

  toggleAudio = () => {
    const muted = !this.state.muted;

    if (muted) {
      this.gainNode.gain.value = 0;
    } else {
      this.gainNode.gain.value = 1;
    }

    this.setState({ muted });
  };

  render() {
    const { time } = this.state;

    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.dataArray);
      this.analyzeAudio();
    }
    return (
      <div className="audio" id="audio-wrapper">
        <Overlay {...AUDIO_DATA} />
        <Liquid3D time={time} {...this.audioData} />
        <Controls
          trackDuration={this.trackDuration}
          playHead={this.playHead}
          muted={this.state.muted}
          toggleAudio={this.toggleAudio}
        />
      </div>
    );
  }
}
