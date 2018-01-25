import React, { Component } from 'react';
import Menu from '../components/menu.jsx';
import Videos from '../components/videos.jsx';

class WebRTC extends Component {
  connect = () => {
    console.log('[WebRTC] connect');
  }

  disconnect = () => {
    console.log('[WebRTC] disconnect');
  }

  render() {
    return (
      <div>
        <p>WebRTC</p>
        <Menu onConnect={this.connect} onDisconnect={this.disconnect} />
        <Videos />
      </div>
    );
  }
}

export default WebRTC;
