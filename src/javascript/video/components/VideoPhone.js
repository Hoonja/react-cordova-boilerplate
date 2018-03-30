import React, { Component } from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import studentM from '../../../resource/student_m.png';
import studentW from '../../../resource/student_w.png';
import {service, values, api} from '../../commons/configs';
import {CustomIcon} from '../../commons/components';
import {socket as action, fetch} from '../../redux/actions';
import Loader from 'react-loader';

import {Flex, Button} from 'antd-mobile';

const mapStateToProps = ({ fetch, security, socket }) => {
    const room = service.getValue(fetch, 'multipleList.room', {});
    const student = service.getValue(room, 'sdata.studentDetail', {});
    const talkInfo = service.getValue(fetch, 'item', {});
    return {
        parent: {...security.actor},
        student,
        room,
        rtc: socket.rtc,
        remote: socket.remote,
        status: socket.status,
        local: socket.local,
        callState: socket.callState,
        talkInfo
    }
};
const mapDispatchProps = dispatch => ({
    update: (url, params) => dispatch(fetch.update(url, params)),
    simpleUpdate: (url, params) => dispatch(fetch.simpleUpdate(url, params)),
    updateStatus: (status, student, useRelay) => dispatch(action.updateVideoCallConnectStatus(status, student, useRelay)),
    emit: (params) => dispatch(action.emitTalk(params))
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
        };
        this.roomId = '7292_7293';
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
        if(local && keys.length === 0) {
            if(callState === 'remoteRemove') {
                this.disconnect(values.callState.CALL_END);
            } else {
                this.onLocalStream(local);
            }
        }
    }

    appendRemoteVideo({video, peer}) {
        var vids = document.getElementById('divVidPeer');
        this.stopVibrate();
        this.onStartTimer();

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
        console.log('onLocalStream');
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

    prepareWebRTC = () => {
        if (window.cordova.platformId === 'ios') {
            window.cordova.plugins.iosrtc.registerGlobals();
        }
        this.connect();
    }

    connectRoom() {
        const {student} = this.props.data;
        setTimeout(() => {
            this.props.updateStatus(values.status.CONNECT, student, false );
        }, 300);
    }

    connect() {
        const {callState} = this.props;
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
        this.facingMode = true;

        if(callState === values.callState.REQUEST) {
            this.connectRoom();
            this.setTalk('create');
        } else if(callState === values.callState.RECEIVED) {
            this.startVibrate();
        }
    }

    disconnect(state) {
        console.log('[VideoPhone] disconnect', this.actorId, this.roomId, state);
        const {student} = this.props;
        this.props.updateStatus(values.status.DISCONNECT, student, false );
        this.onStopTimer();
        this.setTalk(state);
        this.stopVibrate();
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

    createVideoTalk() {
        const {room} = this.props;
        const params = {
            modelType: values.talkType.RealtimeVideoTalk,
            room: room.id,
            data: {}
        };
        const obj = api.sendTalk(params);
        return this.props.update(obj.url, obj.params);
    }

    completeVideoTalk(state) {
        const {room, talkInfo, student} = this.props;
        const {duration} = this.state;
        const params = {
            state,
            duration: moment(duration).format('mm:ss') // this.state.curTime - this.state.startTime
        };
        const obj = api.modifyTalk(talkInfo.id, params);
        return this.props.simpleUpdate(obj.url, obj.params)
            .then(() => {
                const setObj = api.setTalk(talkInfo.id, {status: 0});
                return this.props.update(setObj.url, setObj.params);
            })
            .then(() => {
                return this.props.emit({to: student.id, room: room.id, text: '통화성공'});
            })
    }

    failVideoTalk(state) {
        const {room, talkInfo, student} = this.props;
        const params = {
            state,
            duration: 0
        };
        const obj = api.modifyTalk(talkInfo.id, params);
        return this.props.simpleUpdate(obj.url, obj.params)
          .then(() => {
              const setObj = api.setTalk(talkInfo.id, {status: 99});
              return this.props.update(setObj.url, setObj.params);
          })
          .then(() => {
              return this.props.emit({to: student.id, room: room.id, text: '통화실패'});
          })
    }

    setTalk(state) {
        const {talkInfo, room} = this.props;

        if(state === 'create') {
            if(!talkInfo.id) {
                this.createVideoTalk();
            }
        } else {
            if(!room.id) {
                return ;
            }
            switch (state) {
                case values.callState.CALL_END:
                    this.completeVideoTalk(state);
                    break;
                case values.callState.CALL_CANCEL:
                case values.callState.CALL_FAIL:
                case values.callState.CALL_REJECT:
                    this.failVideoTalk(state);
                    break;
                default:
                    break;
            }
        }
    }

    isConnected() {
        const {remote} = this.props;
        return (Object.keys(remote).length > 0);
    }

    renderCallStatus() {
        const { duration } = this.state;
        const { status, callState } = this.props;

        if (callState === values.callState.REQUEST) {
            return '연결중입니다.';
        } else if (callState === values.callState.RECEIVED) {
            return '전화 왔습니다.';
        } else if (status === values.status.CONNECT) {
            return moment(duration).format('mm:ss');
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

    stopVibrate() {
        if(navigator.vibrate) {
            navigator.vibrate(0);
        }
    }

    startVibrate() {
        if(navigator.vibrate) {
            let arr = [];
            let inx = 30;
            while(inx-- > 0) arr.push(900, 500);
            navigator.vibrate(arr);
        }
    }

    run() {
        const {startTime} = this.state;

        this.animationId = requestAnimationFrame(() => {
            this.setState({
                duration: moment().diff(startTime)
            });
            this.run();
        });
    }

    onStartTimer() {
        this.setState({
            startTime: new Date()
        });
        this.run();
    }

    onStopTimer(){
        if(this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    render() {
        const {callState, status} = this.props;
        const {student} = this.props.data;
        const {audioOn, videoOn, loaded} = this.state;

        return (
            <div>
                <Flex className="videophone-area">
                    <video id="vidSelf" class="video-loading" autoPlay style={{ backgroundColor: '#000000', transition: 'width 0.7s, height 0.7s, top 0.7s, left 0.7s'}} poster="https://s.wink.co.kr/images/parent/video_poster_parent_parent.png"></video>
                    <div id="divVidPeer"></div>
                </Flex>
                <div className="videophone-student-division">
                    <Flex direction="column">
                        {callState !== values.callState.REMOTE_APPEND && (
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

                        {(this.isConnected()) &&
                        <Flex.Item className="videophone-button">
                            <Button type="warning" size="large" onClick={e => this.disconnect(values.callState.CALL_END)}>
                                <CustomIcon type="MdCallEnd"/>
                                종료</Button>
                        </Flex.Item>}
                        {(!this.isConnected() && callState === values.callState.REQUEST) &&
                        <Flex.Item className="videophone-button">
                            <Button type="warning" size="large" onClick={e => this.disconnect(values.callState.CALL_CANCEL)}>
                                <CustomIcon type="MdCallEnd"/>
                                종료</Button>
                        </Flex.Item>}
                        {(!this.isConnected() && callState === values.callState.RECEIVED) &&
                        <Flex.Item className="videophone-button">
                            <Button type="warning" size="large" onClick={e => this.disconnect(values.callState.CALL_REJECT)}>
                                <CustomIcon type="MdDoNotDisturb"/>
                                거절</Button>
                        </Flex.Item>}
                        {(!this.isConnected() && callState === values.callState.RECEIVED) &&
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
