import React, { Component } from 'react';
import WebRTC from '../containers/webrtc.jsx';

export default class App extends Component {
  render() {
    const actorId = '989898';
    const actorName = '아이퐁';
    const authToken = '*danbi*';
    return (
      <div>
        <div>
          <h3>WebRTC sample</h3>
        </div>
        <WebRTC actorId={actorId} actorName={actorName} authToken={authToken} />
      </div>
    );
  }
}
