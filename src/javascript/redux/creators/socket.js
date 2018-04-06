import {socket as type} from '../types';

export const connect = (params) => {
    return {
        type: type.SOCKET_CONNECT,
        payload: {
            ...params
        }
    }
};
export const disconnect = () => {
    return {
        type: type.SOCKET_DISCONNECTED,
        payload: {
        }
    }
};

export const checked = (item) => {
    return {
        type: type.SOCKET_ON_CHECKED,
        payload: {
            item
        }
    }
};

export const checkedTalk = (room) => {
    return {
        type: type.SOCKET_TALK_CHECKED,
        payload: {
            room
        }
    }
};

export const emit = () => {
    return {
        type: type.SOCKET_EMIT,
        payload: {
        }
    }
};

export const emitTalk = (item) => {
    return {
        type: type.SOCKET_EMIT_TALK,
        payload: {
            item
        }
    }
};

export const initWorker = (worker) => {
    return {
        type: type.MEDIA_WORKER_INIT,
        payload: {
            worker
        }
    }
};
export const initTalk = (talk) => {
    return {
        type: type.SOCKET_TALK_INIT,
        payload: {
            talk
        }
    }
};


export const initRTC = (rtc, resource) => {
    return {
        type: type.RTC_INIT,
        payload: {
            rtc,
            resource
        }
    }
};

export const localStream = (local) => {
    return {
        type: type.RTC_LOCAL_STREAM,
        payload: {
            local
        }
    }
};

export const lessonConnectStatus = (status) => {
    return {
        type: type.RTC_LESSON_CONNECT_STATUS,
        payload: {
            status
        }
    }
};

export const healthCheck = (item) => {
    return {
        type: type.RTC_HEALTH_CHECK,
        payload: {
            item
        }
    }
};
export const healthCheckResult = (healthCheck) => {
    return {
        type: type.RTC_HEALTH_CHECK_RESULT,
        payload: {
            healthCheck
        }
    }
};

export const lessonConnect = (item) => {
    return {
        type: type.RTC_LESSON_CONNECT,
        payload: {
            item
        }
    }
};

export const lessonDisconnect = (item) => {
    return {
        type: type.RTC_LESSON_DISCONNECT,
        payload: {
            item
        }
    }
};

export const appendRemote = (video, peer) => {
    return {
        type: type.RTC_REMOTE_APPEND,
        payload: {
            remote: {
                [peer.id] : {video, peer}
            }
        }
    }
};

export const removeRemote = (video, peer) => {
    return {
        type: type.RTC_REMOTE_REMOVE,
        payload: {
            remote: peer.id
        }
    }
};

export const changeCamera = (item, camera) => {
    return {
        type: type.RTC_CAMERA_CHANGE,
        payload: {
            item,
            camera
        }
    }
};

export const changeLocalResource = (localResource) => {
    return {
        type: type.RTC_LOCAL_RESOURCE_CHANGE,
        payload: {
            localResource
        }
    }
};

export const changeCameraQuality = (item, quality) => {
    return {
        type: type.RTC_CAMERA_QUALITY_CHANGE,
        payload: {
            item,
            quality
        }
    }
};

export const didChangeCamera = (camera) => {
    return {
        type: type.RTC_CAMERA_DID_CHANGE,
        payload: {
            camera
        }
    }
};

export const didChangeCameraQuality = (quality) => {
    return {
        type: type.RTC_CAMERA_QUALITY_DID_CHANGE,
        payload: {
            quality
        }
    }
};

export const willChangeAudioConfig = (audioConfig) => {
    return {
        type: type.RTC_AUDIO_CONFIG_WILL_CHANGE,
        payload: {
            audioConfig
        }
    }
};

export const changeAudioConfig = (item) => {
    return {
        type: type.RTC_AUDIO_CONFIG_CHANGE,
        payload: {
            item
        }
    }
};

export const sendPoint = (item, point) => {
    return {
        type: type.RTC_POINT_SEND,
        payload: {
            item,
            point
        }
    }
};

export const didSendPoint = (point) => {
    return {
        type: type.RTC_POINT_DID_SEND,
        payload: {
            point
        }
    }
};

export const changeRecord = (cmd) => {
    return {
        type: type.RTC_MANUAL_RECORD_CHANGE,
        payload: {
            cmd
        }
    }
};

export const startContentShare = (item, shared) => {
    return {
        type: type.RTC_CONTENT_SHARE_START,
        payload: {
            item,
            shared
        }
    }
};

export const finishContentShare = (item) => {
    return {
        type: type.RTC_CONTENT_SHARE_FINISH,
        payload: {
            item
        }
    }
};

export const updateStepContentShare = (item) => {
    return {
        type: type.RTC_LOCAL_SHARE_DID_UPDATE_STEP,
        payload: {
            item
        }
    }
};

export const updateExtContentShare = (item) => {
    return {
        type: type.RTC_LOCAL_SHARE_DID_UPDATE_EXT,
        payload: {
            item
        }
    }
};

export const didStartContentShare = (shared) => {
    return {
        type: type.RTC_CONTENT_SHARE_DID_START,
        payload: {
            shared
        }
    }
};

export const didFinishContentShare = () => {
    return {
        type: type.RTC_CONTENT_SHARE_DID_FINISH,
        payload: {

        }
    }
};

export const addCanvas = (stream) => {
    return {
        type: type.RTC_CANVAS_ADD,
        payload: {
            stream
        }
    }
};

// export const didAddCanvas = (rtc, stream) => {
//     return {
//         type: type.RTC_CANVAS_DID_ADD,
//         payload: {
//             rtc,
//             stream
//         }
//     }
// };

export const changeWorkspace = (workspace) => {
    return {
        type: type.RTC_CANVAS_WORKSPACE_CHANGE,
        payload: {
            workspace
        }
    }
};

export const changeSketcher = (item) => {
    return {
        type: type.RTC_SKETCHER_CHANGE,
        payload: {
            item
        }
    }
};

export const changeSketcherWithoutAck = (item) => {
    return {
        type: type.RTC_SKETCHER_NO_ACK_CHANGE,
        payload: {
            item
        }
    }
};

export const rtcConnect = (item) => {
    return {
        type: type.RTC_CONNECT,
        payload: {
            item
        }
    }
};
export const rtcConnectStatus = (status) => {
    return {
        type: type.RTC_CONNECT_STATUS,
        payload: {
            status
        }
    }
};

export const rtcDisconnect = (item) => {
    return {
        type: type.RTC_DISCONNECT,
        payload: {
            item
        }
    }
};

export const rtcVideoCallState = (callState, item) => {
    return {
        type: type.RTC_VIDEO_CALL_STATE,
        payload: {
            callState,
            item
        }
    }
};
