import React, { Component } from 'react';

export default class Overlay extends Component {
  render() {
    const { album, artist, song, lyrics } = this.props;
    return (
      <div className="overlay">
        <div className="overlay__meta-data">
          <div className="overlay__album">
            <div className="overlay__album__text"> {album} </div>
          </div>

          <div className="overlay__song-data">
            <div className="overlay__song-data__wrapper">
              <div className="overlay__artist"> {artist} </div>
              <div className="overlay__song"> {song} </div>
            </div>
          </div>
        </div>

        <div className="overlay__scroll-lyrics">{lyrics}</div>

        <div className="overlay__controls" />
      </div>
    );
  }
}
