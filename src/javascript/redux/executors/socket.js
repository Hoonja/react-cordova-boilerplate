import SimpleWebRTC from 'danbi-simplewebrtc';
import {SocketIOConnection} from 'danbi-msgclient';

// import message from 'antd/lib/message';
import {Toast} from 'antd-mobile';
import {socket as creator} from '../creators';
import {socket as type} from '../types';
import {values} from '../../commons/configs';

const authToken = '*danbi*';
let actorId, currentRtc, roomName;

const makeRTC = (socket, params = null) => {
    const connection = new SocketIOConnection(socket, { eventPrefix: 'rtc'});

    console.log('makeRTC: ', params);

    return new SimpleWebRTC({
        connection,
        autoRequestMedia: true,
        // peerVolumeWhenSpeaking: 0.75, // 의미없음
        // adjustPeerVolume: true, // 문제가 더 심각해짐
        ...params,
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
        media: {
            video: {
                facingMode: {ideal: 'user'},
                width: {ideal: 280 },
                height: {ideal: 210 }
            },
            audio: {
                ...values.mediaConfig.audio,
                ...values.audioConfig.default,
            }
        },
    });
};

const eventsWithDispatch = (rtc, emit, dispatch, isReconnect) => {
    rtc.on('localStream', (stream) => {
        console.log('[eventsWithDispatch]: localStream');
        // Notice: 화상 교육 화면에서 처음 message 호출하면 오류 발생 antd 2.13.4 기준)
        Toast.success('환영합니다.', 1);
        dispatch(creator.localStream(stream));
    });
    rtc.on('readyToCall', () => {
        console.log('[eventsWithDispatch]: readyToCall');
        emit('usePlugin', {id: 'rtc'});
        // 재연결 관련 로직 추가
        if(isReconnect && roomName) {
            rtc.joinRoom(roomName);
        }
    });

    rtc.on('videoAdded', (video, peer) => {
        console.log('[eventsWithDispatch]: videoAdded');
        dispatch(creator.appendRemote(video, peer));
        roomName = rtc.roomName;
    });

    rtc.on('videoRemoved', (video, peer) => {
        console.log('[eventsWithDispatch]: videoRemoved');
        dispatch(creator.removeRemote(video, peer));
        roomName = undefined;
    });

    window.addEventListener("message", message => {
        if(message.data.event === 'learnStart') {
            dispatch(creator.updateStepContentShare(message.data.payload));
        }
        if(message.data.event === 'sendEvent') {
            dispatch(creator.updateExtContentShare(message.data));
        }
    });
};

const heathCheckHandler = (err, count, action, dispatch) => {
    if(err) {
        Toast.fail('접속 시, 오류가 발생하였습니다.');
        return;
    }
    dispatch(creator.healthCheckResult(count));
};

const errorHandler = (err, count, action, dispatch) => {
    if(err) {
        Toast.fail('접속 시, 오류가 발생하였습니다.');
        return;
    }
    if(count === 0) {
        Toast.fail('대상자가 연결 되어 있지 않습니다.');
        dispatch(creator.lessonConnectStatus(values.status.DISCONNECT));
        return;
    }
};

const initialize = (socket, emit, dispatch, isReconnect, resource) => {
    emit('login', {authToken, actorId});

    const rtc = makeRTC(socket, resource);

    dispatch(creator.initRTC(rtc));

    eventsWithDispatch(rtc, emit, dispatch, isReconnect);

    return rtc;
};

const destroy = (rtc) => {
    // TODO: RTC 객체 해제에 대한 처리가 필요함.
};

export const socket = (socket) => {

    return (action, emit, dispatch) => {
        switch(action.type)	 {
            case type.SOCKET_DISCONNECT:
                Toast.fail('화상 연결이 비정상적으로 종료되었습니다.');
                Toast.info('재연결을 시도합니다.', 10);

                destroy(currentRtc);

                dispatch(creator.disconnect());
                break;
            case type.SOCKET_RECONNECT:
                // msg-server를 재기동하더라도 일반적인 connection은 물려 있으나,
                // 판서 그림은 공유 되지 않음
                Toast.success('재연결중입니다.');
                currentRtc = initialize(socket, emit, dispatch, true);
                break;
            case type.SOCKET_CONNECT:
                // 중요: 삭제불가
                actorId = action.payload.actorId;
                currentRtc = initialize(socket, emit, dispatch, false, action.payload.localResource);
                break;
            case type.SOCKET_EMIT_TALK:
                emit('message', {type: 'message', ...action.payload.item});
                break;
            case type.RTC_HEALTH_CHECK:
                emit('message', {...action.payload.item}, (err, count) => heathCheckHandler(err, count, action, dispatch));
                break;
            case type.RTC_LESSON_CONNECT:
                emit('message', {...action.payload.item}, (err, count) => errorHandler(err, count, action, dispatch));
                break;
            case type.RTC_LESSON_DISCONNECT:
                emit('message', {...action.payload.item});
                break;
            case type.RTC_CAMERA_CHANGE:
                emit('message', {...action.payload.item});
                dispatch(creator.didChangeCamera(action.payload.camera));
                break;
            case type.RTC_CAMERA_QUALITY_CHANGE:
                emit('message', {...action.payload.item});
                dispatch(creator.didChangeCameraQuality(action.payload.quality));
                break;
            case type.RTC_AUDIO_CONFIG_CHANGE:
                emit('message', {...action.payload.item});
                break;
            case type.RTC_POINT_SEND:
                emit('message', {...action.payload.item});
                dispatch(creator.didSendPoint(action.payload.point));
                break;
            case type.RTC_CONTENT_SHARE_START:
                emit('message', {...action.payload.item});
                dispatch(creator.didStartContentShare(action.payload.shared));
                break;
            case type.RTC_CONTENT_SHARE_FINISH:
                emit('message', {...action.payload.item});
                dispatch(creator.didFinishContentShare());
                break;
            case type.RTC_MANUAL_RECORD_CHANGE:
                emit('message', {...action.payload.item});
                break;
            case type.RTC_SKETCHER_CHANGE:
                emit('message', {...action.payload.item});
                break;
            case type.RTC_CONNECT:
                emit('message', {...action.payload.item});
                break;
            case type.RTC_DISCONNECT:
                emit('message', {...action.payload.item});
                break;
            default:
                break;
        }
    };
};
