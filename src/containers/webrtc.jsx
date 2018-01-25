/* global cordova */
import React, { Component } from 'react';
import Menu from '../components/menu.jsx';
import Videos from '../components/videos.jsx';

class WebRTC extends Component {
  componentDidMount() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  }

  onDeviceReady = () => {
    console.log('[WebRTC] onDeviceReady');
    if (cordova.platformId === 'ios') {
      cordova.plugins.iosrtc.registerGlobals();

      // load adapter.js
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://webrtc.github.io/adapter/adapter-latest.js';
      script.async = false;
      document.getElementsByTagName("head")[0].appendChild(script);

      this.videos.turnOnCamera();
    }
  }

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
        <Videos ref={ref => { this.videos = ref; }} />
      </div>
    );
  }
}

export default WebRTC;
