import React, { Component } from 'react';
import { bindHandlers, unbindHandlers, SocketIOConnection } from 'danbi-msgclient';
import SimpleWebRTC from 'danbi-simplewebrtc';
import Menu from '../components/menu.jsx';
import Videos from '../components/videos.jsx';
import { MsgClient, MSG_TYPE, MSG_SUBTYPE } from '../lib/MsgClient.js';

class VideoPhone extends Component {
  componentDidMount() {
    if (window.cordova !== undefined) {
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    } else {
      this.videos.turnOnCamera();
    }
  }

  onDeviceReady = () => {
    console.log('[VideoPhone] onDeviceReady');
    this.prepareWebRTC();
  }

  onMsgConnect() {
    console.log('[VideoPhone] onMsgConnect to ' + this.serverUrl);
    this.socket.login('*danbi*', this.actorId, this.actorName, this.onMsgLogin.bind(this));
  }

  onMsgReconnect(args) {
    console.log('[VideoPhone] onMsgReconnect');
  }

  onMsgDisconnect() {
    console.log('[VideoPhone] onMsgDisconnect');
  }

  onMsgMessage(data) {
    console.log('[VideoPhone] onMsgMessage', data);
  }

  onMsgLogin(err) {
    if (err) {
      console.error('[VideoPhone]' + err);
      return;
    }

    console.log(`[VideoPhone] login successed (actorId:${this.actorId}, actorName:${this.actorName})`);

    // const myVidbox = document.querySelector('#vidbox-me');
    const vidSelf = document.createElement('VIDEO');
    vidSelf.autoplay = true;
    vidSelf.width = 180;
    vidSelf.height = 240;
    vidSelf.volume = 0;
    vidSelf.id = 'vidSelf';
    // myVidbox.appendChild(vidSelf);
    this.vidSelf = vidSelf;

    this.rtc = new SimpleWebRTC({
      connection: new SocketIOConnection(this.socket.getConnection(), { eventPrefix: 'rtc' }),
      localVideoEl: 'vidSelf',
      autoRequestMedia: true,
      media: {
        video: {
          width: 226,
          height: 303,
          frameRate: {
            min: 1,
            max: 15
          }
        },
        audio: true
      }
    });
    this.rtc.webrtc.config.peerConnectionConfig.iceTransports = 'relay';
    // this.rtc.webrtc.config.peerConnectionConfig.iceTransports = 'relay';

    this.rtcHandlers = bindHandlers(this.rtc, this, 'onRtc');
    this.socket.usePlugin('rtc');
  }

  onRtcLocalStream(stream) {
    console.log('[VideoPhone] onRtcLocalStream');
    const myVidbox = document.querySelector('#vidbox-me');
    myVidbox.appendChild(this.vidSelf);
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.iosrtc) {
      window.cordova.plugins.iosrtc.refreshVideos();
    }
  }

  onRtcReadyToCall(session) {
    console.log('[VideoPhone] onRtcReadyToCall', session);
    this.rtc.joinRoom(this.roomId, err => {
      if (err) {
        console.error('[VideoPhone] 입장 실패: ' + err);
      } else {
        console.log(`Joining to Room#${this.roomId} has successed.`);
      }
    });
  }

  onRtcVideoAdded(video, peer) {
    console.log('[VideoPhone] onRtcVideoAdded', video, peer);
    const vids = document.getElementById('vidbox-you');
    this.rtc.getStats(0, (ret, stats) => console.log('onRtcVideoAdded.peer.getStat()', stats));

    video.width = 226;
    video.height = 303;

    vids.appendChild(video);
  }

  prepareWebRTC = () => {
    if (window.cordova.platformId === 'ios') {
      window.cordova.plugins.iosrtc.registerGlobals();
    }

    this.videos.turnOnCamera();
  }

  connect = (serverUrl, roomId, actorId, actorName) => {
    console.log('[VideoPhone] connect');
    this.serverUrl = serverUrl;
    this.roomId = roomId;
    this.actorId = actorId;
    this.actorName = actorName;
    this.socket = new MsgClient(this.serverUrl);
    this.msgHandlers = bindHandlers(this.socket, this, 'onMsg');
  }

  disconnect = () => {
    console.log('[VideoPhone] disconnect');
    unbindHandlers(this.socket, this.msgHandlers);
  }

  render() {
    return (
      <div>
        <Menu onConnect={this.connect} onDisconnect={this.disconnect} />
        <Videos ref={ref => { this.videos = ref; }} />
      </div>
    );
  }
}

export default VideoPhone;
