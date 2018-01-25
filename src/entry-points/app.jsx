import React, { Component } from 'react';
import WebRTC from '../containers/webrtc.jsx';

export default class App extends Component {
  render() {
    return (
      <div>
        <div>
          <h3>WebRTC sample</h3>
        </div>
        <WebRTC />
      </div>
    );
  }
}
