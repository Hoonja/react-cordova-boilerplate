import {values} from '../../commons/configs';
import {socket as creator} from '../creators';

const getUser = (security) => {
    return {
        actorId: security.actor.id || 7291,
        humanName : security.humanName || '정두훈'
    };
};
const getBaseMessage = (user, student) => {
    const roomId = `${user.actorId}_${student}`;
    return {fromName: user.humanName, fromActorId: user.actorId, roomId};
};

const getMessage = (student, message) => {
    return {to : student, message: JSON.stringify(message)};
};

const leaveRoom = (rtc) => {
    if(rtc) {
        console.log('leave room: ', rtc);
        rtc.stopLocalVideo();
        rtc.leaveRoom();
        rtc.dispose();
    }
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

export const connect = (params = null) => {
    return (dispatch, getState) => {
        const actorId = getState().security.actorId || 755;
        dispatch(creator.connect({actorId, ...params}));
    };
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

        dispatch(creator.emitTalk(getMessage(item.to, message)));
    };
};
const connectVideoCall = (dispatch, socket, user, student, useRelay, subType) => {
    const baseMessage = getBaseMessage(user, student);
    console.log('connectVideoCall', student);
    return joinRoom(socket.rtc, baseMessage.roomId)
      .then(() => {
          const message = {
              type: values.type.CALL, subtype: subType || values.subtype.CONNECT,
              ...baseMessage
          };
          if(useRelay) {
              message.classInfo.useRelay = true;
          }
          const params = {to : student, message: JSON.stringify(message)};
          dispatch(creator.rtcConnect(params));
      })
      .catch(err => {
          console.log('실패', err);
      });
};
const disconnectVideoCall = (dispatch, socket, user, student) => {
    const message = {
        type: values.type.CALL, subtype: values.subtype.DISCONNECT,
        ...getBaseMessage(user, student)
    };
    const params = {to : student, message: JSON.stringify(message)};

    dispatch(creator.rtcDisconnect(params));

    leaveRoom(socket.rtc);
};
export const updateVideoCallConnectStatus = (status, student, useRelay, subType) => {
    return (dispatch, getState) => {
        const {security, socket} = getState();
        const user = getUser(security);

        dispatch(creator.rtcConnectStatus(status));

        if(status === values.rtcStatus.CONNECT && student) {
            // NOTICE: 불안정 접속 방지 위함
            // disconnectVideoCall(dispatch, socket, user, student);
            connectVideoCall(dispatch, socket, user, student, useRelay, subType);
        } else if(status === values.rtcStatus.DISCONNECT && student) {
            disconnectVideoCall(dispatch, socket, user, student);
        } else if(status === values.rtcStatus.CLOSE) {
            console.log('close lesson room');
        }
    }
};

export const updateVideoCallStatus = (callStatus) => {
    return (dispatch) => {
        dispatch(creator.rtcVideoCallStatus(callStatus));
    }
}
