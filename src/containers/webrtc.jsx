import React, { Component } from 'react';
import { bindHandlers, unbindHandlers, SocketIOConnection } from 'danbi-msgclient';
import SimpleWebRTC from 'danbi-simplewebrtc';
import Menu from '../components/menu.jsx';
import Videos from '../components/videos.jsx';
import { MsgClient, MSG_TYPE, MSG_SUBTYPE } from './MsgClient.js';

const serverUrl = 'https://msg.danbi.biz/users';
const roomId = '989898';

class WebRTC extends Component {
  componentDidMount() {
    if (window.cordova !== undefined) {
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    } else {
      this.videos.turnOnCamera();
    }
  }

  onDeviceReady = () => {
    console.log('[WebRTC] onDeviceReady');
    this.prepareWebRTC();
  }

  prepareWebRTC = () => {
    if (window.cordova.platformId === 'ios') {
      window.cordova.plugins.iosrtc.registerGlobals();
    }
    // const script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.src = 'https://webrtc.github.io/adapter/adapter-latest.js';
    // script.async = false;
    // document.getElementsByTagName('head')[0].appendChild(script);

    this.videos.turnOnCamera();
  }

  connect = () => {
    console.log('[WebRTC] connect');
    this.socket = new MsgClient(serverUrl);
    this.msgHandlers = bindHandlers(this.socket, this, 'onMsg');
  }

  disconnect = () => {
    console.log('[WebRTC] disconnect');
    unbindHandlers(this.socket, this.msgHandlers);
  }

  onMsgConnect() {
    console.log('[webrtc] onMsgConnect to ' + serverUrl);
    const {authToken, actorId, actorName} = this.props;
    this.socket.login(authToken, actorId, actorName, this.onMsgLogin.bind(this));
  }

  onMsgReconnect(args) {
    console.log('[webrtc] onMsgReconnect');
  }

  onMsgDisconnect() {
    console.log('[webrtc] onMsgDisconnect');
  }

  onMsgMessage(data) {
    console.log('[webrtc] onMsgMessage', data);
  }

  onMsgLogin(err) {
    if (err) {
      console.error('[webrtc]' + err);
      return;
    }

    console.log(`[webrtc] login successed (actorId:${this.props.actorId}, actorName:${this.props.actorName})`);

    const myVidbox = document.querySelector('#vidbox-me');
    const vidSelf = document.createElement('VIDEO');
    vidSelf.autoplay = true;
    vidSelf.width = 180;
    vidSelf.height = 240;
    vidSelf.volume = 0;
    vidSelf.id = 'vidSelf';
    myVidbox.appendChild(vidSelf);

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
    // this.rtc.webrtc.config.peerConnectionConfig.iceTransports = 'relay';

    this.rtcHandlers = bindHandlers(this.rtc, this, 'onRtc');
    this.socket.usePlugin('rtc');
  }

  onRtcLocalStream(stream) {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.iosrtc) {
      window.cordova.plugins.iosrtc.refreshVideos();
    }
  }

  onRtcReadyToCall(session) {
    console.log('[webrtc] onRtcReadyToCall', session);
    this.rtc.joinRoom(roomId, err => {
      if (err) {
        console.error('[webrtc] 입장 실패: ' + err);
      } else {
        console.log(`Joining to Room#${roomId} has successed.`);
      }
    });
  }

  onRtcVideoAdded(video, peer) {
    console.log('[webrtc] onRtcVideoAdded', video, peer);
    const vids = document.getElementById('vidbox-you');
    this.rtc.getStats(0, (ret, stats) => console.log('onRtcVideoAdded.peer.getStat()', stats));

    video.width = 226;
    video.height = 303;

    vids.appendChild(video);
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
