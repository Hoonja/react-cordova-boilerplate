// import message from 'antd/lib/message';
import ReactGA from 'react-ga';
import { Toast } from 'antd-mobile';

import {values, service} from '../../commons/configs';
import {socket as creator} from '../creators';

let intervalId;
let sketchBuffer;

const setGa = (label, action = '', value = null) => {
    ReactGA.event({
        category: 'Redux-Socket',
        label,
        action: label
        // action: '' + action + (typeof value === "object") ? JSON.stringify(value) : value,
        // value: (typeof value === "object") ? JSON.stringify(value) : value
    });
};

const sendSketcherData = (dispatch, student) => {
    const message = {
        type: values.type.CUSTOM, subtype: values.subtype.SKETCHER,
        chalkboardInfo: {cmd: values.cmd.MULTIPLE_DRAWING, data: sketchBuffer}
    };
    dispatch(creator.changeSketcher(getMessage(student, message)));
    sketchBuffer = [];
};

const isValidateConnection = (getState) => {
    const {socket} = getState();
    if(socket.status !== values.status.CONNECT) {
        Toast.fail('연결된 화상수업이 없습니다.', 1)
        return false;
    }
    return true;
};

const isLowCanvasType = (getState) => {
    const {socket} = getState();
    return socket.canvas.workspace.low;
};

const getUser = (security, student) => {
    const classroom = service.getValue(student, 'sdata.classroomDetails', [])
        .find(item => item.sdata_TeacherDetail.id === security.actorId);

    const subjectTagName = service.getValue(classroom, 'subjectTagName', '한글・수학・영어');

    return {
        actorId: security.actorId || 755,
        humanName : security.humanName || '단비티쳐',
        subjectTagName: subjectTagName === '한글・수학・영어' ? '체험 수업' : subjectTagName
    };
};

const getUrl = (url, urlType, query, cmd = values.cmd.PLAY) => {
    let newUrl = url;
    if(urlType === values.media.WINK) {
        newUrl = `${url}?tab_no=${query.tabNo || 1}&step_no=${query.stepNo || 1}&sub_no=${query.subNo || 1}`;
    }
    const obj = {Url: newUrl, type: urlType};

    if(urlType === values.media.VIDEO) {
        obj.cmd = cmd;
    }

    return obj
};
const getBaseMessage = (user, student) => {
    const roomId = `${user.actorId}_${student}`;
    return {fromName: user.humanName, fromActorId: user.actorId, roomId};
};

const getMessage = (student, message) => {
    return {to : student, message: JSON.stringify(message)};
};

const disconnectLesson = (dispatch, socket, user, student) => {
    const message = {
        type: values.type.CALL, subtype: values.subtype.DISCONNECT,
        ...getBaseMessage(user, student)
    };
    const params = {to : student, message: JSON.stringify(message)};

    dispatch(creator.lessonDisconnect(params));

    leaveRoom(socket.rtc);

    if(socket.canvas.rtc) {
        leaveRoom(socket.canvas.rtc);
    }
};
const connectLesson = (dispatch, socket, user, student, useRelay) => {
    const baseMessage = getBaseMessage(user, student);
    return joinRoom(socket.rtc, baseMessage.roomId)
        .then(() => {
            const message = {
                type: values.type.CALL, subtype: values.subtype.CONNECT,
                classInfo: {name: '', subjects: [user.subjectTagName], profileImg: ''},
                ...baseMessage
            };
            if(useRelay) {
                message.classInfo.useRelay = true;
            }
            const params = {to : student, message: JSON.stringify(message)};
            dispatch(creator.lessonConnect(params));
        })
        .catch(err => {
            console.log('실패', err);
        });
};

const leaveRoom = (rtc) => {
    rtc.leaveRoom();
};
const joinRoom = (rtc, id) => {
    return new Promise((resolve, reject) => {
        rtc.joinRoom(id, (err) => {
            if(err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

const getCameraInfo = (camera, quality) => {
    let width, height;
    if(values.camera.FACE === camera) {
        width = 487;
        height= 650;
        return {name: camera, width, height};
    } else {
        switch (quality) {
            case values.quality.BEST:
                width = 1600;
                height= 900;
                break;
            case values.quality.HIGH:
                width = 1280;
                height= 720;
                break;
            case values.quality.MIDDLE:
                width = 960;
                height= 540;
                break;
            case values.quality.LOW:
                width = 640;
                height= 360;
                break;
            default:
                width = 1280;
                height= 720;
        }
        return {name: camera, width, height}
    }
};

export const initWorker = (worker) => {
    return (dispatch, getState) => {
        setGa('initWorker');
        dispatch(creator.initWorker(worker));
    }
};

export const initTalk = (talks) => {
    return (dispatch, getState) => {
        dispatch(creator.initTalk(talks));
    }

};

export const connect = () => {
    return (dispatch, getState) => {
        const actorId = getState().security.actorId || 755;
        setGa('connect', actorId);
        dispatch(creator.connect(actorId));
    };
};

export const checked = (item) => {
    return (dispatch) => {
        dispatch(creator.checked(item));
        return Promise.resolve();
    }
};

export const checkedTalk = (room) => {
    return (dispatch) => {
        dispatch(creator.checkedTalk(room));
        return Promise.resolve();
    }
};

export const emit = () => {
    return (dispatch) => {
        dispatch(creator.emit());
    };
};

export const emitTalk = (item) => {
    return (dispatch, getState) => {
        const {security} = getState();
        const user = getUser(security);

        const message = {
            type: values.type.CHAT, subtype: values.subtype.MESSAGE,
            ...getBaseMessage(user, null),
            roomId: item.room,
            message: {room: item.room, data: {text: item.text}}
        };

        // setGa('emitTalk', item.to, message);
        dispatch(creator.emitTalk(getMessage(item.to, message)));
    };
};

export const healthCheck = (student) => {
    return (dispatch) => {
        const message = {
            type: values.type.CALL, subtype: 'HEALTH_CHECK',
        };
        const params = {to : student, message: JSON.stringify(message)};
        dispatch(creator.healthCheck(params));
    }
};

export const updateLessonConnectStatus = (status, student, item, useRelay) => {
    return (dispatch, getState) => {
        const {security, socket} = getState();
        const user = getUser(security, item);

        setGa('updateLessonConnectStatus', status, student);
        dispatch(creator.lessonConnectStatus(status));

        if(status === values.status.CONNECT && student) {
            // NOTICE: 불안정 접속 방지 위함
            disconnectLesson(dispatch, socket, user, student);
            connectLesson(dispatch, socket, user, student, useRelay);
        } else if(status === values.status.DISCONNECT && student) {
            disconnectLesson(dispatch, socket, user, student);
        } else if(status === values.status.CLOSE) {
            console.log('close lesson room');
        }
    }
};
//resource
export const changeLocalResource = (resource) => {
    return (dispatch, getState) => {
        dispatch(creator.changeLocalResource(resource));
    };
};

export const changeCamera = (camera, student) => {
    return (dispatch, getState) => {
        if(!isValidateConnection(getState)) {
            return;
        }
        const {security, socket} = getState();
        const user = getUser(security);

        const message = {
            type: values.type.CUSTOM, subtype: values.subtype.CAMERA,
            cameraInfo: getCameraInfo(camera, socket.quality),
            ...getBaseMessage(user, student)
        };
        setGa('changeCamera', values.subtype.CAMERA, student);
        dispatch(creator.changeCamera(getMessage(student, message), camera));
    };
};

export const changeCameraQuality = (quality, student) => {
    return (dispatch, getState) => {
        // if(!isValidateConnection(getState)) {
        //     return;
        // }
        const {security, socket} = getState();
        const user = getUser(security);

        const message = {
            type: values.type.CUSTOM, subtype: values.subtype.CAMERA,
            cameraInfo: getCameraInfo(socket.camera, quality),
            ...getBaseMessage(user, student)
        };
        // setGa('changeCamera', values.subtype.CAMERA, student);
        dispatch(creator.changeCameraQuality(getMessage(student, message), quality));
    };
};

export const sendPoint = (point, student) => {
    return (dispatch, getState) => {
        const {security} = getState();
        if(!isValidateConnection(getState)) {
            return;
        }
        const user = getUser(security);

        const message = {
            type: values.type.CUSTOM, subtype: values.subtype.POINT,
            point,
            ...getBaseMessage(user, student)
        };
        setGa('sendPoint', values.subtype.POINT, point);
        dispatch(creator.sendPoint(getMessage(student, message), point));
    };
};

export const changeRecord = (cmd) => {
    return (dispatch, getState) => {
        if(!isValidateConnection(getState)) {
            return;
        }
        setGa('changeRecord', cmd);
        dispatch(creator.changeRecord(cmd));
    };
};

export const startContentShare = (student, url, urlType, tabNo = 1, cmd) => {
    return (dispatch, getState) => {
        if(!isValidateConnection(getState)) {
            return;
        }
        const message = {
            type: values.type.CUSTOM, subtype: values.subtype.SHARE,
            contentsInfo: {visible: true, ...getUrl(url, urlType, {tabNo}, cmd)}
        };
        setGa('startContentShare', values.subtype.SHARE, {url, urlType, query:{tabNo}});
        dispatch(creator.startContentShare(getMessage(student, message), {url, urlType, query:{tabNo}}));
    };
};
export const startReviewContentShare = (student, url, urlType, query, cmd) => {
    return (dispatch, getState) => {
        if(!isValidateConnection(getState)) {
            return;
        }
        const message = {
            type: values.type.CUSTOM, subtype: values.subtype.SHARE,
            contentsInfo: {visible: true, ...getUrl(url, urlType, query, cmd)}
        };
        setGa('startReviewContentShare', values.subtype.SHARE,  {url, urlType, query});
        dispatch(creator.startContentShare(getMessage(student, message), {url, urlType, query}));
    };
};

export const finishContentShare = (student) => {
    return (dispatch, getState) => {
        if(!isValidateConnection(getState)) {
            return;
        }
        const message = {
            type: values.type.CUSTOM, subtype: values.subtype.SHARE,
            contentsInfo: {visible: false}
        };
        setGa('finishContentShare', values.subtype.SHARE);
        dispatch(creator.finishContentShare(getMessage(student, message)));
    };
};

export const changeWorkspace = (workspace) => {
    return (dispatch, getState) => {
        setGa('changeWorkspace', 'workspace', workspace);
        dispatch(creator.changeWorkspace(workspace));
    }
};

export const changeSketcher = (student, cmd, data) => {
    return (dispatch, getState) => {
        if(!isValidateConnection(getState)) {
            return;
        }
        const message = {
            type: values.type.CUSTOM, subtype: values.subtype.SKETCHER,
            chalkboardInfo: {cmd, data}
        };

        if(isLowCanvasType(getState)) {
            if(cmd === values.cmd.WILL_DRAW) {
                dispatch(creator.changeSketcher(getMessage(student, message)));
                sketchBuffer = [];
                clearInterval(intervalId);
                intervalId = setInterval(() => sendSketcherData(dispatch, student), 500)
            } else if(cmd === values.cmd.DID_DRAW) {
                sendSketcherData(dispatch, student);
                clearInterval(intervalId);
                dispatch(creator.changeSketcher(getMessage(student, message)));
            } else {
                dispatch(creator.changeSketcher(getMessage(student, message)));
            }
        } else {
            dispatch(creator.changeSketcher(getMessage(student, message)));
        }
    }
};

export const changeSketcherWithoutAck = (cmd, data) => {
    return (dispatch, getState) => {
        const {socket} = getState();
        if(isLowCanvasType(getState)) {
            if(Array.isArray(sketchBuffer)) {
                sketchBuffer.push(data);
            }
        } else {
            const message = {
                type: values.type.CUSTOM, subtype: values.subtype.SKETCHER,
                chalkboardInfo: {cmd, data}
            };
            socket.rtc.sendCustomMessage(JSON.stringify(message));
        }
    }
};
