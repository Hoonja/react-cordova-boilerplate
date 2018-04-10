import localforage from 'localforage';

import {socket as type} from '../types';
import {values} from '../../commons/configs'

const workspace = {
    color: '#FF6900',
    weight: 20,
    mode: 'draw',
    needToClear: false,
    use: false,
    text: {x:0, y:0, size:20}
};

const initialState = {
    status: 'closed',
    localResource: {
        audioConfig: values.audioConfig.default
    },
    remote: {},
    record: {},
    message: {},
    talk: {},
    camera: values.camera.FACE,
    point: 0,
    quality: 'high',
    canvas: {workspace},
    shared: undefined
};

const getMessage = (message) => {
    try {
        return JSON.parse(message);
    }
    catch (err) {
        return message;
    }
};

const getTalk = (state, message) => {
    const newTalk = {...state.talk};
    // 중요 : state에서는 기 등록된 객체를 사용하는 것이 아니라, 새로운 것을 만들어 사용해야 한다.
    const room = message.message.roomId;
    if(!newTalk[room]) {
        newTalk[room] = [message];
    } else {
        newTalk[room] = [...newTalk[room], message];
    }
    return {...state, talk: newTalk};
};

export const socket = (state = initialState, action) => {
    let newMessage;
    switch(action.type)	 {
        case type.SOCKET_DISCONNECTED:
            return {...state, remote : {}};
        case type.SOCKET_ON:
            const message = {message: getMessage(action.message), lastModified: new Date()};

            if(message.message.type !== values.type.CHAT) {
                newMessage = {...state.message};
                // 중요 : state에서는 기 등록된 객체를 사용하는 것이 아니라, 새로운 것을 만들어 사용해야 한다.
                if(!newMessage[action.from]) {
                    newMessage[action.from] = [message];
                } else {
                    newMessage[action.from] = [...newMessage[action.from], message];
                }
                return {...state, message: newMessage};
            }

            const results = getTalk(state, message);

            localforage.setItem('talk', results.talk);

            return results;
        case type.SOCKET_ON_CHECKED:
            newMessage = {...state.message};
            if(action.payload.item instanceof Object) {
                delete newMessage[action.payload.item.target];
            } else {
                delete newMessage[action.payload.item];
            }
            return {...state, message: newMessage};

        case type.SOCKET_TALK_CHECKED:
            newMessage = {...state.talk};
            if(action.payload.room) {
                delete newMessage[action.payload.room];
            }

            localforage.setItem('talk', newMessage);

            return {...state, talk: newMessage};
        case type.MEDIA_WORKER_INIT:
            return {...state, ...action.payload};
        case type.SOCKET_TALK_INIT:
            return {...state, ...action.payload};
        case type.RTC_INIT:
            return {...state, ...action.payload};
        case type.RTC_HEALTH_CHECK_RESULT:
            return {...state, ...action.payload};
        case type.RTC_LOCAL_STREAM:
            return {...state, ...action.payload};
        case type.RTC_LOCAL_RESOURCE_CHANGE:
            return {...state, localResource: {...state.localResource, ...action.payload.localResource}};
        case type.RTC_LESSON_CONNECT_STATUS:
            return {...state, ...action.payload, camera: values.camera.FACE, point: 0, shared: undefined};
        case type.RTC_REMOTE_APPEND:
            return {...state, remote : {...state.remote, ...action.payload.remote}, rtcStatus: values.rtcStatus.REMOTE_APPEND};
        case type.RTC_REMOTE_REMOVE:
            delete state.remote[action.payload.remote];
            return {...state, remote : {...state.remote}, rtcStatus: values.rtcStatus.REMOTE_REMOVE};
        case type.RTC_CAMERA_DID_CHANGE:
            return {...state, ...action.payload};
        case type.RTC_CAMERA_QUALITY_DID_CHANGE:
            return {...state, ...action.payload};
        case type.RTC_POINT_DID_SEND:
            return {...state, point: state.point + action.payload.point};
        case type.RTC_CONTENT_SHARE_DID_START:
            return {...state, shared: {...state.shared, ...action.payload.shared, query:{...action.payload.shared.query}}};
        case type.RTC_CONTENT_SHARE_DID_FINISH:
            return {...state, shared: undefined};
        case type.RTC_LOCAL_SHARE_DID_UPDATE_STEP:
            return {...state, shared: {...state.shared, query: {tabNo: action.payload.item.contentStep}}};
        case type.RTC_LOCAL_SHARE_DID_UPDATE_EXT:
            return {...state, shared: {...state.shared, ext: {...action.payload.item}}};
        // case type.RTC_CANVAS_DID_ADD:
        //     return {...state, canvas: {...state.canvas, rtc: action.payload.rtc, stream: action.payload.stream}};
        case type.RTC_CANVAS_WORKSPACE_CHANGE:
            return {...state, canvas: {...state.canvas, workspace: {...state.canvas.workspace, ...action.payload.workspace}}};
        case type.RTC_MANUAL_RECORD_CHANGE:
            return {...state, record: {...state.record, ...action.payload}};
        case type.RTC_AUDIO_CONFIG_WILL_CHANGE:
            return {...state, localResource: {...state.localResource, audioConfig: action.payload.audioConfig}};
        case type.RTC_CONNECT_STATUS:
            return {...state, ...action.payload, camera: values.camera.FACE, point: 0, shared: undefined};
        case type.RTC_VIDEO_CALL_STATUS:
            return {...state, ...action.payload};
        default:
            return state;
    }
}
