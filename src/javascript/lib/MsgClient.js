import Emitter from 'wildemitter';
import SocketIO from 'socket.io-client';

const DEFAULT_URL_LOCAL = 'http://server.local.danbi:27070/users';
const DEFAULT_URL_REMOTE = 'https://msg.danbi.biz/users';
const DEFAULT_URL_PRODUCTION = 'https://msg.wink.co.kr/users';
export const MSG_TYPE = {
  call: 'CALL',
  noti: 'NOTI',
  chat: 'CHAT',
  custom: 'CUSTOM'
};
export const MSG_SUBTYPE = {
  msg: 'MSG',
  join: 'JOIN',
  leave: 'LEAVE',
  request: 'REQUEST',
  requestClass: 'REQUEST_C',
  reject: 'REJECT',
  accept: 'ACCEPT',
  quit: 'QUIT',
  quitClass: 'QUIT_C',
  study: 'STUDY'
};

let instance = null;

export class MsgClient extends Emitter {
  constructor(uri) {
    super();

    if (!instance) {
      instance = this;

      let _uri;
      if (uri && uri !== '') {
        _uri = uri;
      } else {
        if(window.wink_cordova_env === 'production') {
          _uri = DEFAULT_URL_PRODUCTION;
        } else if (process.env.NODE_ENV === 'development') {
          _uri = DEFAULT_URL_LOCAL;
        } else {
          _uri = DEFAULT_URL_REMOTE;
        }
      }

      this.socket = SocketIO(_uri || 'http://localhost:7070/users');
      this.uri = _uri;

      this.bindHandlers();
      console.log('[MsgClient] new instance created');
    } else {
      console.log('[MsgClient] return already created instance');
      // setTimeout(() => {
      //   instance.onConnect();
      // }, 0);
    }

    return instance;
  }

  bindHandlers() {
    function untitle(str) {
      return str.substr(0, 1).toLowerCase() + str.substr(1);
    }

    for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (name.indexOf('on') !== 0) {
        continue;
      }

      this.socket.on(untitle(name.substr(2)), this[name].bind(this));
    }
  }

  getConnection() {
    return this.socket;
  }

  onConnect() {
    this.isConnected = true;
    this.emit('connect');
  }

  onReconnect() {
    this.emit('reconnect');
  }

  onDisconnect() {
    this.isConnected = false;
    this.emit('disconnect');
  }

  onMessage(data) {
    this.emit('message', data);
  }

  login(authToken, actorId, actorName, callback) {
    callback = callback || (function () { });
    authToken = authToken || this.authToken;
    actorId = actorId || this.actorId;
    actorName = actorName || this.actorName;

    this.socket.emit('login', { authToken, actorId }, (err) => {
      if (err) return callback(err);

      this.authToken = authToken;
      this.actorId = actorId;
      this.actorName = actorName;
      this.isLogined = true;

      callback();
    });
  }

  logout() {
    if (this.isLogined) {
      this.socket.emit('logout', { id: this.actorId });
      this.isLogined = false;
      console.warn(`[MsgClient] logout called(actorId: ${this.actorId}).`);
    } else {
      console.warn('[MsgClient] logout called, but skipped(this.isLogined: false).');
    }
  }

  sendMessage(to, message, callback) {
    callback = callback || (function () { });

    this.socket.emit('message', { to: to, message: message }, (err, targetCount) => {
      if (callback) callback(err, targetCount);
    });
  }

  usePlugin(id) {
    this.socket.emit('usePlugin', { id: id });
  }

  stopPlugin(id) {
    this.socket.emit('stopPlugin', { id: id });
  }

  sendChatMessage(toActorId, roomId, message, sendPush = true) {
    const payload = JSON.stringify({
      type: MSG_TYPE.chat,
      subtype: MSG_SUBTYPE.msg,
      fromActorId: this.actorId,
      fromName: this.actorName,
      roomId,
      message
    });
    console.log('[MsgClient] sendChatMessage: ' + payload);

    this.sendMessage(toActorId, payload, (err, targetCount) => {
      if (targetCount === 0) {
        console.warn('[MsgClient] sendChatMessage: 메세지 수신자가 접속되어 있지 않습니다.');
      } else {
        console.log(`[MsgClient] sendChatMessage(targetCount: ${targetCount}, err: ${err})`);
      }
      if (sendPush) {
        this.sendPushNotification(toActorId, JSON.stringify({
          contents: {
            ko: this.actorName + ': ' + message.data.text,
            en: 'This push message is only for Korean.'
          },
          headings: {
            ko: '메세지 알림',
            en: 'Message'
          },
          data: {
            type: MSG_TYPE.chat,
            subtype: MSG_SUBTYPE.msg,
            fromActorId: this.actorId,
            fromName: this.actorName,
            roomId,
            message: message.data.text
          }
        }));
      }
    });
  }

  requestVConf(toActorId, roomId, callback) {
    const payload = JSON.stringify({
      type: MSG_TYPE.call,
      subtype: MSG_SUBTYPE.request,
      fromName: this.actorName,
      fromActorId: this.actorId,
      roomId
    });
    this.sendMessage(toActorId, payload, (err, targetCount) => {
      if (targetCount === 0) {
        console.warn('[MsgClient] requestVConf: 메세지 수신자가 접속되어 있지 않습니다.');
      }
      this.sendPushNotification(toActorId, JSON.stringify({
        contents: {
          ko: this.actorName + '님이 영상전화를 요청하셨습니다.',
          en: 'This push message is only for Korean.'
        },
        headings: {
          ko: '영상전화 알림',
          en: 'Message'
        },
        data: {
          type: MSG_TYPE.call,
          subtype: MSG_SUBTYPE.request,
          fromName: this.actorName,
          fromActorId: this.actorId,
          roomId,
          time: Date.now()
        }
      }));

      if (callback) callback(err, targetCount);
    });
  }

  requestVClass(toActorId, roomId, classInfo, callback) {
    const payload = JSON.stringify({
      type: MSG_TYPE.call,
      subtype: MSG_SUBTYPE.requestClass,
      fromName: this.actorName,
      fromActorId: this.actorId,
      roomId,
      classInfo
    });
    this.sendMessage(toActorId, payload, (err, targetCount) => {
      if (targetCount === 0) {
        console.warn('[MsgClient] requestVClass: 학생이 접속 상태가 아닙니다.');
        // this.sendPushNotification(toActorId, payload);
      }
      if (callback) callback(err, targetCount);
    });
  }

  acceptVConf(toActorId, roomId, callback) {
    const payload = JSON.stringify({
      type: MSG_TYPE.call,
      subtype: MSG_SUBTYPE.accept,
      fromName: this.actorName,
      fromActorId: this.actorId,
      roomId
    });
    this.sendMessage(toActorId, payload, (err, targetCount) => {
      if (targetCount === 0) {
        console.warn('[MsgClient] acceptVConf: 메세지 수신자가 접속되어 있지 않습니다.');
      }
      if (callback) callback(err, targetCount);
    });
  }

  rejectVConf(toActorId, roomId, callback) {
    const payload = JSON.stringify({
      type: MSG_TYPE.call,
      subtype: MSG_SUBTYPE.reject,
      fromName: this.actorName,
      fromActorId: this.actorId,
      roomId
    });
    this.sendMessage(toActorId, payload, (err, targetCount) => {
      if (targetCount === 0) {
        console.warn('[MsgClient] rejectVConf: 메세지 수신자가 접속되어 있지 않습니다.');
      }
      if (callback) callback(err, targetCount); //  수신 상대가 없음을 알림
    });
  }

  quitVConf(toActorId, roomId, callback) {
    const payload = JSON.stringify({
      type: MSG_TYPE.call,
      subtype: MSG_SUBTYPE.quit,
      fromName: this.actorName,
      fromActorId: this.actorId,
      roomId
    });
    this.sendMessage(toActorId, payload, (err, targetCount) => {
      if (targetCount === 0) {
        console.warn('[MsgClient] quitVConf: 메세지 수신자가 접속되어 있지 않습니다.');
      }
      if (callback) callback(err, targetCount); //  수신 상대가 없음을 알림
    });
  }

  quitVClass(toActorId, roomId, callback) {
    const payload = JSON.stringify({
      type: MSG_TYPE.call,
      subtype: MSG_SUBTYPE.quitClass,
      fromName: this.actorName,
      fromActorId: this.actorId,
      roomId
    });
    this.sendMessage(toActorId, payload, (err, targetCount) => {
      if (targetCount === 0) {
        console.warn('[MsgClient] quitVClass: 메세지 수신자가 접속되어 있지 않습니다.');
      }
      if (callback) callback(err, targetCount); //  수신 상대가 없음을 알림
    });
  }
}
