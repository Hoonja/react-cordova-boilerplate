
export const rtcStatus = {
    REMOTE_APPEND: 'remoteAppend',
    REMOTE_REMOVE: 'remoteRemove',
    MODE_ACTIVE: 'active',
    LOCAL_STREAM: 'localStream',
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CLOSE: 'close',
    ACCEPT: 'accept',
};

export const callStatus = {
    REQUEST: 'request',
    RECEIVED: 'received',
    CALL_WAIT: 'wait',
    CALLING: 'calling',
    CALL_END: 'called',
    CALL_CANCEL: 'cancel',
    CALL_FAIL: 'fail',
    CALL_REJECT: 'reject',
};

export const type = {
    CALL: 'CALL',
    CUSTOM: 'CUSTOM',
    CHAT: 'CHAT'
};

export const subtype = {
    ACCEPT: 'ACCEPT',
    CONNECT: 'REQUEST',
    DISCONNECT: 'QUIT',
    CAMERA: 'camera',
    POINT: 'point',
    SHARE: 'share',
    RECORD: 'vrecord',
    SKETCHER: 'chalkboard',
    MESSAGE: 'MSG'
};

const storageKey = {
    AUTH_TOKENNAME: '__MEMBER:AUTH_TOKENNAME:' + window.location.hostname.toLocaleUpperCase(),
    PUSH_IDS_IOS: '__PUSH:IDS_IOS',
};

const actorType = {
    parent: 2
};

const tabs = [
    { title: '아이디 로그인' },
    { title: '휴대폰번호 로그인' },
];

const reg = {
    mdn: /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/
};

export const talkType = {
    TextTalk:1,
    VoiceTalk:2,
    VideoTalk:3,
    TabletOnlyResponseTalk:4,
    TabletOnlyRequestTalk:5,
    AbsenceTalk:6,
    ComplimentTalk:7,
    ImageTalk:8,

    ScheduleAlarmTalk:9,
    LearningAlarmTalk:10,
    DeliveryAlarmTalk:11,

    SystemAlarmTalk: 99,
    RealtimeVoiceTalk: 102,
    RealtimeVideoTalk: 103

};


export default {
    callStatus,
    rtcStatus,
    type,
    subtype,
    storageKey,
    actorType,
    tabs,
    reg,
    talkType,
};
