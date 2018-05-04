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

export const rtcVideoCallStatus = (callStatus) => {
    return {
        type: type.RTC_VIDEO_CALL_STATUS,
        payload: {
            callStatus
        }
    }
};
