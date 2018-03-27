import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindHandlers, unbindHandlers, SocketIOConnection } from 'danbi-msgclient';
import studentM from '../../../resource/student_m.png';
import studentW from '../../../resource/student_w.png';
import SimpleWebRTC from 'danbi-simplewebrtc';
import {Menu, Videos } from './';
import { MsgClient, MSG_TYPE, MSG_SUBTYPE } from '../../lib/MsgClient.js';
import { isWebBrowser } from '../../lib/utils.js';
import {service, values} from '../../commons/configs';
import {CustomIcon} from '../../commons/components';
import {socket as action} from '../../redux/actions';
import Loader from 'react-loader';

import {Flex, Button, Icon} from 'antd-mobile';

const mapStateToProps = ({ fetch, security, socket }) => {
    const room = service.getValue(fetch, 'multipleList.room', {});
    const student = service.getValue(room, 'sdata.studentDetail', {});
    return {
        parent: {...security.actor},
        student,
        room,
        rtc: socket.rtc,
        remote: socket.remote,
        status: socket.status,
        local: socket.local,
        callState: socket.callState
    }
};
const mapDispatchProps = dispatch => ({
    // update: (url, params) => dispatch(fetchAction.simpleSilentUpdate(url, params)),
    // multipleList: (list) => dispatch(fetchAction.multipleList(list)),
    updateStatus: (status, student, useRelay) => dispatch(action.updateVideoCallConnectStatus(status, student, useRelay)),
    // checked: (id) => dispatch(action.checked(id)),
    // move: (location) => dispatch(push(location)),
});

class VideoPhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'connect',
            audioOn: true,
            pauseVideo: false,
            loaded: true,
            videoOn: true,
            callState: 'calling'
        };
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

    componentDidUpdate(prevProps) {
        const {remote, status, local, callState} = this.props;
        const keys = Object.keys(remote);
        if(values.status.CONNECT === status && keys.length > 0 && (!prevProps.remote[keys[0]])) {
            this.appendRemoteVideo(remote[keys[0]]);
        }
        if(values.status.CONNECT === status && local && keys.length === 0) {
            if(callState === 'remoteRemove') {
                this.disconnect();
            } else {
                this.onLocalStream(local);
            }
        }
    }

    appendRemoteVideo({video, peer}) {
        var vids = document.getElementById('divVidPeer');

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

    onLocalStream(stream) {
        setTimeout(() => {
            var vidSelf = document.getElementById('vidSelf');
            vidSelf.className = "video-loaded";
            if (vidSelf && vidSelf.paused) {
                console.log('vidSelf.play()');
                vidSelf.volume = 0;
                vidSelf.play();
            }
            vidSelf.volume = 0;
        }, 0);
    }
    componentWillUnmount() {
        // if (this.props.rtc) {
        //     unbindHandlers(this.rtc, this.rtcHandlers);
        //     this.rtcHandlers = null;
        //
        //     this.rtc.dispose();
        //     this.rtc = null;
        // }
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

        if (isWebBrowser()) {
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
    connectRoom() {
        if (isWebBrowser()) {
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
        } else {
            setTimeout(() => {
                var vidSelf = document.getElementById('vidSelf');
                vidSelf.className = "video-loaded";
                console.log('vidSelf.paused', vidSelf.paused);
                if (vidSelf && vidSelf.paused) {
                    console.log('vidSelf.play()');
                    vidSelf.volume = 0;
                    vidSelf.play();
                }
                vidSelf.volume = 0;
            }, 0);
        }
    }

    onRtcReadyToCall(session) {
        console.log('[VideoPhone] onRtcReadyToCall', this.roomId);
        const {rtc} = this.props;
        rtc.joinRoom(this.roomId, (err, description) => {
            if (err) {
                console.error('[VideoPhone] 입장 실패: ' + err);
            } else {
                console.log(`Joining to Room#${this.roomId} has successed.`);
                const {student} = this.props.data;
                // console.log(student);
                // this.socket.requestVConf(student.id, this.roomId);
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
        // this.disconnect();
    }

    prepareWebRTC = () => {
        if (window.cordova.platformId === 'ios') {
            window.cordova.plugins.iosrtc.registerGlobals();
        }
        this.connect();
    }

    connect() {
        const {parent, room, student} = this.props.data;
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
        this.facingMode = true;

        setTimeout(() => {
            this.props.updateStatus(values.status.CONNECT, student, false );
        }, 300);

        // this.socket = new MsgClient(this.serverUrl);
        // this.msgHandlers = bindHandlers(this.socket, this, 'onMsg');
        // this.connectRoom();
    }

    disconnect() {
        console.log('[VideoPhone] disconnect', this.actorId, this.roomId);
        const {student} = this.props;
        this.props.updateStatus(values.status.DISCONNECT, student, false );
        // if (this.rtc) {
        //     console.log('leaveRoom', this.rtc);
        //     this.rtc.leaveRoom();
        //     this.rtc.stopLocalVideo();
        // }
        if(this.socket) {
            this.socket.quitVConf(this.actorId, this.roomId);
        }
        // this.socket.logout();
        this.props.onClose();
    }

    toggleAudio = (e) => {
        console.log('[VideoPhone] toggleAudio');
        e.preventDefault();
        if (this.props.rtc) {
            if (this.state.audioOn) {
                this.props.rtc.mute();
            } else {
                this.props.rtc.unmute();
            }
            this.setState({
                ...this.state,
                audioOn: !this.state.audioOn
            });
        }
    }

    toggleVideo = (e) => {
        console.log('[VideoPhone] toggleVideo');
        e.preventDefault();
        if (this.props.rtc) {
            if (this.state.videoOn) {
                this.props.rtc.pauseVideo();
            } else {
                this.props.rtc.resumeVideo();
            }
            this.setState({
                ...this.state,
                videoOn: !this.state.videoOn
            });
        }
    }

    changeCamera = (e) => {
        e.preventDefault();
        console.log('[VideoPhone] changeCamera');
        this.facingMode = !this.facingMode;
        return this.props.rtc.changeLocalVideo({
            video: { facingMode: { exact: this.facingMode ? 'user' : 'environment' } },
            audio: true
        });
    }

    renderCallStatus() {
        const {status} = this.state;
        if(status === 'connecting') {
            return '연결 중입니다.'
        } else {
            return '0:07';
        }
    }

    renderCameraSwitchButton() {
        return (
            <div className="videophone-camera-switch">
                <img src="https://s.wink.co.kr/app/parents/images/parents/btn_camera_change.png" alt="" onClick={e => this.changeCamera(e)}/>
            </div>
        )
    }

    renderSpinner() {
        return (
            <div className="videophone-spinner">
                <Loader lines={12} length={12} width={8} radius={30}
                        color="#fff" className="spinner" zIndex={2e9} top="50%" left="50%" scale={1.00}
                        loadedClassName="loadedContent" >
                </Loader>
                <CustomIcon roots="FontAwesome" type="FaVideoCamera" className="loader-icon" sizes="lg"/>
            </div>
        )
    }

    isConnected() {
        const {remote} = this.props;
        return (Object.keys(remote).length > 0);
    }

    render() {
        const {student} = this.props.data;
        const {status, audioOn, videoOn, pauseVideo, loaded, callState} = this.state;

        return (
            <div>
                <Flex className="videophone-area">
                    <video id="vidSelf" class="video-loading" autoPlay style={{ backgroundColor: '#000000', transition: 'width 0.7s, height 0.7s, top 0.7s, left 0.7s'}} poster="https://s.wink.co.kr/images/parent/video_poster_parent_parent.png"></video>
                    <div id="divVidPeer"></div>
                </Flex>
                <div className="videophone-student-division">
                    <Flex direction="column">
                        {status === 'connecting' && (
                            <Flex.Item>
                                <img src={student.isMail ? studentM : studentW} alt="student" className="student-img"/>
                            </Flex.Item>
                        )}
                        <Flex.Item className="student-name">
                            {student.authHumanName || '정주어'}
                        </Flex.Item>
                        <Flex.Item className="call-status">
                            {this.renderCallStatus()}
                        </Flex.Item>
                    </Flex>
                </div>
                {false && this.renderCameraSwitchButton()}
                {!loaded && this.renderSpinner()}
                <div className="videophone-button-division">
                    <Flex className="button-list" justify="center">
                        {this.isConnected() &&
                        <Flex.Item className="videophone-icon">
                            <CustomIcon type={audioOn ? "MdMicOff" : "MdMic"} onClick={e => this.toggleAudio(e)}/>
                        </Flex.Item>}

                        {(this.isConnected() || callState === 'wait') &&
                        <Flex.Item className="videophone-button">
                            <Button type="warning" size="large" onClick={e => this.disconnect(e)}>
                                <CustomIcon type="MdCallEnd"/>
                                종료</Button>
                        </Flex.Item>}
                        {(!this.isConnected() && callState === 'calling') &&
                        <Flex.Item className="videophone-button">
                            <Button type="warning" size="large" onClick={e => this.disconnect(e)}>
                                <CustomIcon type="MdDoNotDisturb"/>
                                거절</Button>
                        </Flex.Item>}
                        {(!this.isConnected() && callState === 'calling') &&
                        <Flex.Item className="videophone-button">
                            <Button type="primary" size="large" onClick={e => this.connectRoom(e)}>
                                <CustomIcon type="MdPhone"/>
                                통화</Button>
                        </Flex.Item>}
                        {this.isConnected() &&
                        <Flex.Item className="videophone-icon">
                            <CustomIcon type={videoOn ? "MdVideocamOff" : "MdVideocam"} onClick={e => this.toggleVideo(e)}/>
                        </Flex.Item>}
                    </Flex>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(VideoPhone);
