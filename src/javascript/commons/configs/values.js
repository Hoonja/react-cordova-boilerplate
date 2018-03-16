export const format = {
    FULL_DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm',
    DATE_FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm',
    TIME_FORMAT_SEC : 'HH:mm:ss',
    DAY_FORMAT: 'ddd',
};

export const modal = {
    visible: true,
    footer: null,
    wrapClassName: 'web-lessons',
    width: 1808,
    maskClosable: false,
    closable: false,
    style:{ top: 62 }
    // style:{ top: 20 }
};

export const status = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CLOSE: 'close'
};

export const type = {
    CALL: 'CALL',
    CUSTOM: 'CUSTOM',
    CHAT: 'CHAT'
};

export const subtype = {
    ACCEPT: 'ACCEPT',
    CONNECT: 'REQUEST_C',
    DISCONNECT: 'QUIT_C',
    CAMERA: 'camera',
    POINT: 'point',
    SHARE: 'share',
    RECORD: 'vrecord',
    SKETCHER: 'chalkboard',
    MESSAGE: 'MSG'
};

export const cmd = {
    CONVERTING: 'converting', // mp4 상태 전환용
    START: 'start',
    DID_START: 'start-ok',
    ERR_START: 'start-error',
    STOP: 'stop',
    DID_STOP: 'stop-ok',
    ERR_STOP: 'stop-error',
    DONE_STOP: 'vrecord-result',
    PLAY: 'play',
    PAUSE: 'pause',

    OPEN: 'open',
    CLOSE: 'close',
    WILL_DRAW: 'beginDrawing',
    DRAWING: 'updateDrawing',
    MULTIPLE_DRAWING: 'updateDrawings',
    DID_DRAW: 'endDrawing',
    COLOR: 'setPenColor',
    WEIGHT: 'setPenWeight',
    TEXT: 'drawText',
    DRAW_MODE: 'setDrawerMode',
    ERASE_MODE: 'setEraserMode',
    CLEAR: 'clear',
    UNDO: 'undo'
};

export const camera = {
    FACE: 'face',
    BOOK: 'text'
};

export const media = {
    WINK: 'media-wink',
    VIDEO: 'media-video',
    IMAGE: 'media-image',
    AUDIO: 'media-audio',
    PDF: 'media-pdf',
    WEB: 'media-web'
};

export const progress = {
    '한글': 'K',
    '수학': 'M',
    '파닉스': 'E_P',
    '스토리영어': 'E_S'
};

export const quality = {
    BEST: 'best',
    HIGH: 'high',
    MIDDLE: 'middle',
    LOW: 'low'
};

export const qualityOptions = [
    {id: 'best', label: '최상'},
    {id: 'high', label: '상'},
    {id: 'middle', label: '중'},
    {id: 'low', label: '하'},
];

export const mediaResource = {
    AUDIO_INPUT: 'audioinput',
    AUDIO_OUTPUT: 'audiooutput',
    VIDEO_INPUT: 'videoinput',
};

export const point = 5;

export const AUTO_SAVE_INTERVAL = 120 * 1000;
//https://github.com/muaz-khan/RecordRTC/issues/344
// export const AUTO_SAVE_INTERVAL = 360 * 1000;

const serverUrl = {
    local: 'http://127.0.0.1:27070/users',
    staging: 'https://msg.danbi.biz/users',
    service: 'https://msg.wink.co.kr/users'
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

export default {
    format,
    modal,
    status,
    type,
    subtype,
    cmd,
    camera,
    media,
    // format,
    progress,
    quality,
    qualityOptions,
    point,
    mediaResource,
    AUTO_SAVE_INTERVAL,
    storageKey,
    actorType,
    tabs,
    reg
};
