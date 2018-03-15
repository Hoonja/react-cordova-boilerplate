import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ChatAction from '../chat/ChatAction';
import { MsgClient, MSG_TYPE, MSG_SUBTYPE } from './MsgClient';
import { bindHandlers, unbindHandlers } from 'danbi-msgclient';
import * as MsgAction from './MsgAction';

function getMsgServerUrl() {
    let url;
    if (~location.host.indexOf('wink.co.kr')) {
        // url = 'https://' + location.host + ':7070/users';
        url = 'https://msg.wink.co.kr/users';
    } else if (~location.host.indexOf('danbi.biz')) {
        // url = 'https://' + location.host + ':7070/users';
        url = 'https://msg.danbi.biz/users';
    } else {
        url = 'http://127.0.0.1:27070/users';
        // url = '//msg.local.danbi/users';
    }

    // url = 'https://msg.wink.co.kr/users';
    // url = 'https://msg.danbi.biz/users';
    return url;
}

class _MsgNotifier2 extends Component {
    //  props : url, id, token, roomid
    constructor(props) {
        console.log('[MsgNotifier] constructor called');
        super(props);

        this.serverURL = getMsgServerUrl();
        this.msgClient = new MsgClient(this.serverURL);
        this.msgHandlers = bindHandlers(this.msgClient, this, 'onMsg');
        this.callEventHandler = this.callEventHandler.bind(this);

        this.state = {
            cameraId: 0
        };

        // test용 프로퍼티
        // this.toActorId = 24; // 로컬
        this.toActorId = 86;
        this.chatMsg = '채팅 메세지';
        this.fromName = this.props.actorName;
        this.contentsStepNo = 1;
        this.camName = 'face';
        this.camWidth = 487;
        this.camHeight = 650;
        this.camFps = null;
    }

    callEventHandler(evtName, arg) {
        if (this.props[evtName]) {
            return this.props[evtName](arg);
        } else {
            console.warn('[MsgNotifier] Not handled event: ' + evtName);
        }
    }

    onMsgConnect() {
        console.log(`[MsgNotifier] Connected to ${this.serverURL}`);
        this.props.fireOnConnected(this.msgClient);
        this.callEventHandler('onConnected', null);
        console.log(`[MsgNotifier] login info(authToken:${this.props.authToken}, actorId:${this.props.actorId}, actorName:${this.props.actorName})`);
        // this.msgClient.logout();
        this.msgClient.login(this.props.authToken, this.props.actorId, this.props.actorName, this.onMsgLogin.bind(this));
    }

    onMsgReconnect(args) {
        console.log('[MsgNotifier] reconnect ', args);
        this.callEventHandler('onReconnected', null);
    }

    onMsgDisconnect() {
        console.log('[MsgNotifier] Disconnected from ' + this.serverURL);
        this.props.fireOnDisconnected();
        this.callEventHandler('onDisconnected', null);
    }

    onMsgMessage(data) {
        // console.log('[MsgNotifier] onMsgMessage: ', data);
        let recvMsg;
        try {
            recvMsg = JSON.parse(data.message);
        } catch (e) {
            console.error('[MsgNotifier] JSON 파싱 실패, 규정외의 패킷을 수신함', e);
            return;
        }
        switch (recvMsg.type) {
            //  {"type":"CALL", "subtype": "REQ(or ACCEPT, REJECT)", "fromActorId":1234, "fromname": "hoonja", "text":"XXX로부터 연결 요청이 왔습니다"}
            case MSG_TYPE.call:
                switch (recvMsg.subtype) {
                    case MSG_SUBTYPE.request:
                        this.props.fireOnRecvVConfReq(recvMsg);
                        this.callEventHandler('onVConfRequested', recvMsg);
                        break;
                    case MSG_SUBTYPE.requestClass:
                        this.props.fireOnRecvVClassReq(recvMsg);
                        this.callEventHandler('onVClassRequested', recvMsg);
                        break;
                    case MSG_SUBTYPE.accept:
                        this.props.fireOnRecvVConfAccept(recvMsg);
                        this.callEventHandler('onVConfAccepted', recvMsg);
                        break;
                    case MSG_SUBTYPE.reject:
                        this.props.fireOnRecvVConfReject(recvMsg);
                        this.callEventHandler('onVConfRejected', recvMsg);
                        break;
                    case MSG_SUBTYPE.quit:
                        this.props.fireOnRecvVConfQuit(recvMsg);
                        this.callEventHandler('onVConfQuit', recvMsg);
                        break;
                    case MSG_SUBTYPE.quitClass:
                        this.props.fireOnRecvVClassQuit(recvMsg);
                        this.callEventHandler('onVClassQuit', recvMsg);
                        break;
                    default:
                        break;
                }
                break;
            //  {"type":"NOTI","url":"아직 안정했음","content":"test message"}
            case MSG_TYPE.noti:
                this.props.fireOnRecvNoti(recvMsg.content, recvMsg.url);
                this.callEventHandler('onNotiReceived', recvMsg);
                break;
            //  {"type":"CHAT","subtype":"MSG","roomid":1234,"content":"test message"}
            case MSG_TYPE.chat:
                this.callEventHandler('onChatNotify', recvMsg);
                // this.props.notify(recvMsg.roomid);
                break;
            case MSG_TYPE.custom:
                this.callEventHandler('onCustomMsg', recvMsg);
                break;
            default:
                break;
        }
    }

    onMsgLogin(err) {
        if (err) {
            console.error('[MsgNotifier]' + err);
        } else {
            console.log(`[MsgNotifier] login successed (actorId:${this.props.actorId}, actorName:${this.props.actorName})`);
        }
        this.props.fireOnLogined();
        this.callEventHandler('onLogin', err);
    }

    onMsgLogout(err) {
        if (err) {
            console.error('[MsgNotifier]' + err);
        } else {
            console.log('[MsgNotifier] logout successed');
        }
        this.props.fireOnLogouted();
        this.callEventHandler('onLogout', err);
    }

    componentWillUnmount() {
        console.warn('[MsgNotifier] componentWillUnmount');
        unbindHandlers(this.msgClient, this.msgHandlers);
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('[MsgNotifier] componentDidUpdate', this.props, prevProps);
        // console.log('[MsgNotifier] componentDidUpdate', this.state, prevState);
        if ((this.props.authToken !== prevProps.authToken)
            || (this.props.actorId !== prevProps.actorId)
            || (this.props.actorName !== prevProps.actorName)) {
            console.log('[MsgNotifier] componentDidUpdate: ' + (this.props.authToken !== prevProps.authToken), this.props.authToken, prevProps.authToken);
            console.log('[MsgNotifier] componentDidUpdate: ' + (this.props.actorId !== prevProps.actorId), this.props.actorId, prevProps.actorId);
            console.log('[MsgNotifier] componentDidUpdate: ' + (this.props.actorName !== prevProps.actorName), this.props.actorName, prevProps.actorName);

            this.msgClient.logout();
            this.msgClient.login(this.props.authToken, this.props.actorId, this.props.actorName, this.onMsgLogin.bind(this));

        }
    }

    //  test methods
    testVConfReq() {
        this.msgClient.requestVConf(this.toActorId, this.props.roomId, (err, targetCount) => {
            console.log('[MsgNotifier] requestVConf callback:', err, targetCount);
        });
    }

    testVClassReq() {
        this.msgClient.requestVClass(this.toActorId, this.props.roomId, {
            name: '테스트 수업',
            subjects: ['한글'],
            profileImg: 'https://s.wink.co.kr/app/student/images/today/tmp_teacher_photo.jpg'
        }, (err, targetCount) => {
            console.log('[MsgNotifier] requestVClass callback:', err, targetCount);
        });
    }

    testVConfAccept() {
        this.msgClient.acceptVConf(this.toActorId, this.props.roomId, (err, targetCount) => {
            console.log('[MsgNotifier] acceptVConf callback:', err, targetCount);
        });
    }

    testVConfReject() {
        this.msgClient.rejectVConf(this.toActorId, this.props.roomId, (err, targetCount) => {
            console.log('[MsgNotifier] rejectVConf callback:', err, targetCount);
        });
    }

    testVConfQuit() {
        this.msgClient.quitVConf(this.toActorId, this.props.roomId, (err, targetCount) => {
            console.log('[MsgNotifier] quitVConf callback:', err, targetCount);
        });
    }

    testVClassQuit() {
        this.msgClient.quitVClass(this.toActorId, this.props.roomId, (err, targetCount) => {
            console.log('[MsgNotifier] testVClassQuit callback:', err, targetCount);
        });
    }

    testNotiReceived() {
        const payload = {
            message: JSON.stringify({
                type: MSG_TYPE.noti,
                content: '공지 메세지 ' + Math.floor(Math.random() * 10000000),
                url: 'https://google.com'
            })
        };
        this.onMsgMessage(payload);
    }

    testNotiRead() {
        this.props.readNoti(0);
    }

    testSendPush() {
        this.msgClient.sendPushNotification(40, '테스트푸시 ' + Math.floor(Math.random() * 10000000));
    }

    testSendHeartPoint() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'point',
            fromName: this.props.actorName,
            fromActorId: this.props.actorId,
            point: 10
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 하트 점수 발송중 오류 발생.', err, targetCount);
            }
        });
    }

    testSendChangeCamera() {
        console.log(`[MsgNotifier] testSendChangeCamera: ${this.camName}, ${this.camWidth}, ${this.camHeight}`);
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'camera',
            fromName: this.props.actorName,
            fromActorId: this.props.actorId,
            // camera: this.state.cameraId === 0 ? 'text' : 'face'
            cameraInfo: {
                // name: this.state.cameraId === 0 ? 'text' : 'face',
                name: this.camName,
                width: this.camWidth,
                height: this.camHeight,
                frameRate: this.camFps,
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 카메라 전환 명령 전송중 오류 발생.', err, targetCount);
            } else {
                this.setState({
                    ...this.state,
                    cameraId: this.state.cameraId === 0 ? 1 : 0
                });
            }
        });
    }

    testSendChangeCameraToText() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'camera',
            fromName: this.props.actorName,
            fromActorId: this.props.actorId,
            cameraInfo: {
                name: 'text',
                width: 1920,
                height: 1080,
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 카메라 전환 명령 전송중 오류 발생.', err, targetCount);
            }
        });
    }

    testSendChangeCameraToFace() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'camera',
            fromName: this.props.actorName,
            fromActorId: this.props.actorId,
            cameraInfo: {
                name: 'face',
                width: 487,
                height: 650
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 카메라 전환 명령 전송중 오류 발생.', err, targetCount);
            }
        });
    }

    testSendOpenContents() {
        // this.msgClient.sendMessage(this.toActorId, JSON.stringify({
        //   type: MSG_TYPE.custom,
        //   subtype: 'media-wink',
        //   contentsInfo: {
        //     visible: true,
        //     Url: 'https://s.wink.co.kr/c/eng/03010501.html?tab_no=' + this.contentsStepNo + '&step_no=0&sub_no=0&mode=dev'
        //   }
        // }), (err, targetCount) => {
        //   if (err || !targetCount) {
        //     console.error('[MsgNotifier] 윙크 콘텐츠 공유 중 오류 발생.', err, targetCount);
        //   }
        // });
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'share',
            contentsInfo: {
                visible: true,
                // Url: 'https://s.wink.co.kr/staging/u/3/2017/10/06/b84E343971FEB88BDA073E552BB9FE774.%EC%95%84%EC%9D%B4%EC%98%81%EC%83%81_%EA%B9%80%EB%AF%BC%EB%A1%9D_2017-10-06_1946.webm',
                Url: 'https://s.wink.co.kr/staging/u/3/2017/10/27/b174F717A82C1CF640FE3663D5D18DD69.%EC%95%84%EC%9D%B4%EC%98%81%EC%83%81_%EC%8B%AC%EA%B9%9C%EB%86%80_2017-10-27_2201.webm',
                type: 'media-video',
                cmd: 'play'
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 윙크 콘텐츠 공유 중 오류 발생.', err, targetCount);
            }
        });
    }

    testSendPlayVideo() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'share',
            contentsInfo: {
                type: 'media-video',
                cmd: 'play'
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 윙크 콘텐츠 공유 중 오류 발생.', err, targetCount);
            }
        });
    }

    testSendStopVideo() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'share',
            contentsInfo: {
                type: 'media-video',
                cmd: 'pause'
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 윙크 콘텐츠 공유 중 오류 발생.', err, targetCount);
            }
        });
    }

    testSendCloseContents() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'share',
            contentsInfo: {
                visible: false
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 윙크 콘텐츠 공유 중 오류 발생.', err, targetCount);
            }
        });
    }

    testSendRequestToRecordVideo() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'vrecord',
            recordInfo: {
                cmd: 'start'
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 비디오 녹화 요청 전송 중 오류 발생', err, targetCount);
            }
        });
    }

    testSendResponseToRecordVideo() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'vrecord',
            recordInfo: {
                cmd: 'start-ok'
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 비디오 녹화 요청에 대한 응답 전송 중 오류 발생.', err, targetCount);
            }
        });
    }

    testSendInformRecordingCompleted() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'vrecord',
            recordInfo: {
                cmd: 'stop'
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 비디오 녹화 완료 알림 전송 중 오류 발생.', err, targetCount);
            }
        });
    }

    testSendResponseRecordingCompleted() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'vrecord',
            recordInfo: {
                cmd: 'stop-ok',
                url: 'https://www.youtube.com/watch?v=Qm509gYHAe0&list=PLUoLBV-_TwODc60iEHC-uj4N34vOvZIG7&index=3'
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 비디오 녹화 완료 알림에 대한 응답 전송 중 오류 발생', err, targetCount);
            }
        });
    }

    testParentMsg() {
        this.msgClient.sendMessage(this.toActorId, JSON.stringify({
            type: MSG_TYPE.custom,
            subtype: 'parent_general',
            parentMsg: {
                msg: 'hello, baby'
            }
        }), (err, targetCount) => {
            if (err || !targetCount) {
                console.error('[MsgNotifier] 학부모 메세지 전송 실패', err, targetCount);
            }
        });
    }

    handleChangeInput(e) {
        const { id, value } = e.target;
        if (id === 'to-actor-id') {
            this.toActorId = value;
        } else if (id === 'chat-msg') {
            this.chatMsg = value;
        } else if (id === 'contents-step') {
            this.contentsStepNo = value;
        } else if (id === 'cam-name') {
            this.camName = value;
        } else if (id === 'cam-width') {
            this.camWidth = parseInt(value, 10);
        } else if (id === 'cam-height') {
            this.camHeight = parseInt(value, 10);
        } else if (id === 'cam-fps') {
            this.camFps = parseInt(value, 10);
        }
    }

    sendChatMessage() {
        this.msgClient.sendChatMessage(this.toActorId, this.props.roomId, this.chatMsg);
    }

    render() {
        if (this.props.debugOn) {
            return (
                <div>
                    <p>
                        <button onClick={this.testVConfReq.bind(this)}>Test VCONF_REQUEST</button>
                        <button onClick={this.testVConfAccept.bind(this)}>Test VCONF_ACCEPT</button>
                        <button onClick={this.testVConfReject.bind(this)}>Test VCONF_REJECT</button>
                        <button onClick={this.testVConfQuit.bind(this)}>Test VCONF_QUIT</button>
                    </p>
                    <p>
                        <button onClick={this.testVClassReq.bind(this)}>Test VCLASS_REQUEST</button>
                        <button onClick={this.testVClassQuit.bind(this)}>Test VCLASS_QUIT</button>
                        <button onClick={this.testSendHeartPoint.bind(this)}>Test Send Heart</button>
                    </p>
                    <p>
                        <input id="cam-name" placeholder="face or text" onChange={this.handleChangeInput.bind(this)} />
                        <input id="cam-width" placeholder="너비" onChange={this.handleChangeInput.bind(this)} />
                        <input id="cam-height" placeholder="높이" onChange={this.handleChangeInput.bind(this)} />
                        <input id="cam-fps" placeholder="FPS" onChange={this.handleChangeInput.bind(this)} />
                        <button onClick={this.testSendChangeCamera.bind(this)}>학습지 Camera</button>
                    </p>
                    <p>
                        <button onClick={this.testSendChangeCameraToText.bind(this)}>학습지 Camera</button>
                        <button onClick={this.testSendChangeCameraToFace.bind(this)}>얼굴 Camera</button>
                    </p>
                    <p>
                        <button onClick={this.testSendRequestToRecordVideo.bind(this)}>녹화요청 보내기</button>
                        <button onClick={this.testSendResponseToRecordVideo.bind(this)}>녹화요청에 대한 응답 보내기</button>
                    </p>
                    <p>
                        <button onClick={this.testSendInformRecordingCompleted.bind(this)}>녹화완료 보내기</button>
                        <button onClick={this.testSendResponseRecordingCompleted.bind(this)}>녹화완료에 대한 응답 보내기</button>
                    </p>
                    <p>
                        <input id="contents-step" defaultValue={this.contentsStepNo} onChange={this.handleChangeInput.bind(this)} />
                        <button onClick={this.testSendOpenContents.bind(this)}>비디오 공유 시작</button>
                        <button onClick={this.testSendPlayVideo.bind(this)}>비디오 재생</button>
                        <button onClick={this.testSendStopVideo.bind(this)}>비디오 멈춤</button>
                        <button onClick={this.testSendCloseContents.bind(this)}>비디오 공유 종료</button>
                    </p>
                    <p>
                        <button onClick={this.testNotiReceived.bind(this)}>Test NOTI_RECV</button>
                        <button onClick={this.testNotiRead.bind(this)}>Test NOTI_READ</button>
                        <button onClick={this.testSendPush.bind(this)}>Test PUSH</button>
                        <button onClick={this.testParentMsg.bind(this)}>Test 부모메세지</button>
                    </p>
                    <p>
                        <label htmlFor="to-actor-id">To</label>
                        <input id="to-actor-id" defaultValue={this.toActorId} onChange={this.handleChangeInput.bind(this)} />
                        <input id="chat-msg" defaultValue={this.chatMsg} onChange={this.handleChangeInput.bind(this)} />
                        <button onClick={this.sendChatMessage.bind(this)}>전송</button>
                    </p>
                </div>
            )
        } else {
            return (<div></div>);
        }

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        notify: (roomId) => dispatch(ChatAction.notify(roomId)),
        fireOnConnected: (client) => dispatch(MsgAction.fireOnConnected(client)),
        fireOnDisconnected: () => dispatch(MsgAction.fireOnDisconnected()),
        fireOnLogined: () => dispatch(MsgAction.fireOnLogined()),
        fireOnLogouted: () => dispatch(MsgAction.fireOnLogouted()),
        fireOnRecvVConfReq: (vconfInfo) => dispatch(MsgAction.fireOnRecvVConfReq(vconfInfo)),
        fireOnRecvVClassReq: (vconfInfo) => dispatch(MsgAction.fireOnRecvVClassReq(vconfInfo)),
        fireOnRecvVConfAccept: (vconfInfo) => dispatch(MsgAction.fireOnRecvVConfAccept(vconfInfo)),
        fireOnRecvVConfReject: (vconfInfo) => dispatch(MsgAction.fireOnRecvVConfReject(vconfInfo)),
        fireOnRecvVConfQuit: (vconfInfo) => dispatch(MsgAction.fireOnRecvVConfQuit(vconfInfo)),
        fireOnRecvVClassQuit: (vconfInfo) => dispatch(MsgAction.fireOnRecvVClassQuit(vconfInfo)),
        fireOnRecvNoti: (content, url) => dispatch(MsgAction.fireOnRecvNoti(content, url)),
        readNoti: (id) => dispatch(MsgAction.readNoti(id))
    }
}

const MsgNotifier = connect(null, mapDispatchToProps)(_MsgNotifier2);

export default MsgNotifier;
