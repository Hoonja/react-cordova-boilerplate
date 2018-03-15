import React, { Component } from 'react';
import { bindHandlers, unbindHandlers, SocketIOConnection } from 'danbi-msgclient';
import SimpleWebRTC from 'danbi-simplewebrtc';
import {Menu, Videos } from './';
import { MsgClient, MSG_TYPE, MSG_SUBTYPE } from '../../lib/MsgClient.js';
import {service} from '../../commons/configs';
import {CustomIcon} from '../../commons/components';

import {Flex, Button} from 'antd-mobile';

class VideoPhone extends Component {
    constructor(props) {
        super(props);
        this.roomId = '7292_7293';
        this.rtc = null;
        // this.socket = null;
    }
    componentDidMount() {
        if (window.cordova !== undefined) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } else {
            // this.videos.turnOnCamera();
        }
    }

    componentWillUnmount() {
        if (this.rtc) {
            unbindHandlers(this.rtc, this.rtcHandlers);
            this.rtcHandlers = null;

            this.rtc.dispose();
            this.rtc = null;
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

    isWebBrowser() {
        const uagentLow = navigator.userAgent.toLocaleLowerCase();
        if (~uagentLow.indexOf('iphone') || (~uagentLow.indexOf('android') && ~uagentLow.indexOf('wv'))) {
            return false;
        } else {
            return true;
        }
    }

    onMsgLogin(err) {
        if (err) {
            console.error('[VideoPhone]' + err);
            return;
        }
        console.log(`[VideoPhone] login successed (actorId:${this.actorId}, actorName:${this.actorName})`);

        if (this.isWebBrowser()) {
            this.rtc = new SimpleWebRTC({
                connection: new SocketIOConnection(this.socket.getConnection(), { eventPrefix: 'rtc' }),
                localVideoEl: 'vidSelf',
                autoRequestMedia: true,
                media: {
                    video: { width: 226, height: 303 },
                    audio: {
                        autoGainControl: { ideal: false },
                        echoCancellation: { ideal: true },
                        noiseSuppression: { ideal: true },
                        latency: { ideal: 1.5 }
                    }
                }
            });
        } else {
            this.rtc = new SimpleWebRTC({
                connection: new SocketIOConnection(this.socket.getConnection(), { eventPrefix: 'rtc' }),
                localVideoEl: 'vidSelf',
                autoRequestMedia: true,
                media: {
                    video: { facingMode: { exact: this.facingMode ? 'user' : 'environment' } },
                    audio: {
                        autoGainControl: { ideal: false },
                        echoCancellation: { ideal: true },
                        noiseSuppression: { ideal: true },
                        latency: { ideal: 1.5 }
                    }
                }
            });
        }
        this.rtcHandlers = bindHandlers(this.rtc, this, 'onRtc');
        console.log(this.socket);
        this.socket.usePlugin('rtc');
        window.onbeforeunload = () => {
            console.warn('[VideoPhone] App is suddenly terminated.');
            this.disconnect();
        }

    }
    connectRoom() {
        if (this.isWebBrowser()) {
            this.rtc = new SimpleWebRTC({
                connection: new SocketIOConnection(this.socket.getConnection(), { eventPrefix: 'rtc' }),
                localVideoEl: 'vidSelf',
                autoRequestMedia: true,
                media: {
                    video: { width: 226, height: 303 },
                    audio: {
                        autoGainControl: { ideal: false },
                        echoCancellation: { ideal: true },
                        noiseSuppression: { ideal: true },
                        latency: { ideal: 1.5 }
                    }
                }
            });
        } else {
            this.rtc = new SimpleWebRTC({
                connection: new SocketIOConnection(this.socket.getConnection(), { eventPrefix: 'rtc' }),
                localVideoEl: 'vidSelf',
                autoRequestMedia: true,
                media: {
                    video: { facingMode: { exact: this.facingMode ? 'user' : 'environment' } },
                    audio: {
                        autoGainControl: { ideal: false },
                        echoCancellation: { ideal: true },
                        noiseSuppression: { ideal: true },
                        latency: { ideal: 1.5 }
                    }
                }
            });
        }
        this.rtcHandlers = bindHandlers(this.rtc, this, 'onRtc');
        this.socket.usePlugin('rtc');

        window.onbeforeunload = () => {
            console.warn('[VideoPhone] App is suddenly terminated.');
            this.disconnect();
        }
    }

    onRtcLocalStream(stream) {
        console.log('[VideoPhone] onRtcLocalStream');
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.iosrtc) {
            window.cordova.plugins.iosrtc.refreshVideos();
        }
    }

    onRtcReadyToCall(session) {
        console.log('[VideoPhone] onRtcReadyToCall', this.roomId);
        this.rtc.joinRoom(this.roomId, (err, description) => {
            if (err) {
                console.error('[VideoPhone] 입장 실패: ' + err);
            } else {
                console.log(`Joining to Room#${this.roomId} has successed.`);
            }
        });
    }

    onRtcVideoAdded(video, peer) {
        console.log('[VideoPhone] onRtcVideoAdded', video, peer);
        var vids = document.getElementById('divVidPeer');

        // video.width = '100%';
        video.height = '100%';
        video.poster = 'https://s.wink.co.kr/images/parent/video_poster_parent_student.png';
        video.style.backgroundColor = 'black';

        vids.appendChild(video);

        var vidSelf = document.getElementById('vidSelf');
        vidSelf.style.zIndex = 100;
        setTimeout(() => {
            vidSelf.className = 'my-video';
        }, 100);
    }

    onRtcVideoRemoved(video, peer) {
        console.log('[VideoPhone] onRtcVideoRemoved');
        var vids = document.getElementById('divVidPeer');

        vids.removeChild(video);
        this.disconnect();
    }

    prepareWebRTC = () => {
        if (window.cordova.platformId === 'ios') {
            window.cordova.plugins.iosrtc.registerGlobals();
        }
        this.connect();
    }

    connect() {
        // const {parent, student, room} = this.props.data;
        // if(parent.id === 12126) {
        //     this.connect(service.getUrl(), "7291_7293", 7293, '학생');
        // } else {
        //     this.connect(service.getUrl(), room.name, parent.id, parent.authHumanName);
        // }
        const {parent, room} = this.props.data;
        const serverUrl = service.getUrl();
        if(parent.id === 12126) {
            parent.id = 7293;
            parent.authHumanName = "학생";
            room.name = "7291_7293";
        }

        console.log('[VideoPhone] connect', serverUrl, room.name, parent.id, parent.authHumanName);
        this.serverUrl = serverUrl;
        this.roomId = room.name;
        this.actorId = parent.id;
        this.actorName = parent.authHumanName;

        this.socket = new MsgClient(this.serverUrl);
        // this.msgHandlers = bindHandlers(this.socket, this, 'onMsg');
        // this.connectRoom();
    }

    disconnect() {
        console.log('[VideoPhone] disconnect', this.actorId, this.roomId);
        if (this.rtc) {
            console.log('leaveRoom', this.rtc);
            this.rtc.leaveRoom();
            this.rtc.stopLocalVideo();
        }
        this.socket.quitVConf(this.actorId, this.roomId);
        // this.socket.logout();
        this.props.onClose();
    }

    render() {
        const {student} = this.props.data;
        return (
            <div>
                <Flex className="videophone-area" style={{backgroundColor: 'black', height: '90vh'}}>
                    <video id="vidSelf" autoPlay style={{ backgroundColor: '#000000', transition: 'width 0.7s, height 0.7s, top 0.7s, left 0.7s', width: '100%'}} poster="https://s.wink.co.kr/images/parent/video_poster_parent_parent.png"></video>
                    <div id="divVidPeer"></div>
                </Flex>
                <div className="student-division">
                    <Flex>
                        <Flex.Item>
                            images
                        </Flex.Item>
                        <Flex.Item>
                            {student.authHumanName}
                        </Flex.Item>
                        <Flex.Item>
                            ing...
                        </Flex.Item>
                    </Flex>
                </div>
                <div className="button-division">
                    <Flex className="button-out">
                        <Flex.Item>
                            <Button type="primary" size="small" onClick={e => this.connectRoom(e)}>접속</Button>
                        </Flex.Item>
                        <Flex.Item>
                            <CustomIcon type="MdVisibilityOff" style={{color: '#fff'}} />
                        </Flex.Item>
                    </Flex>
                    <Flex className="button-ing">
                        <Flex.Item>
                            <CustomIcon type="MdVolumeOff" style={{color: '#fff'}} />
                        </Flex.Item>
                        <Flex.Item>
                            <Button type="primary" size="small" onClick={e => this.disconnect(e)}>종료</Button>
                        </Flex.Item>
                    </Flex>
                </div>
            </div>
        );
    }
}

export default VideoPhone;
