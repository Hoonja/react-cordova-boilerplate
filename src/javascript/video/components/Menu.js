import React, { Component } from 'react';

const serverUrl = {
  local: 'http://127.0.0.1:27070/users',
  staging: 'https://msg.danbi.biz/users',
  service: 'https://msg.wink.co.kr/users'
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.serverUrl = serverUrl.local;
    this.roomId = 'apptest-room-1';
    this.actorId = 10001;
    this.actorName = 'tester' + this.actorId;
  }

  setServerUrl = e => {
    console.log('[menu] setServerUrl', e.target.value);
    this.serverUrl = e.target.value;
  }

  setRoomId = e => {
    this.roomId = e.target.value;
  }

  setActorId = e => {
    this.actorId = e.target.value;
  }

  setActorName = e => {
    this.actorName = e.target.value;
  }

  connect = () => {
    if (this.props.onConnect) {
      this.props.onConnect(this.serverUrl, this.roomId, this.actorId, this.actorName);
    }
  }

  disconnect = () => {
    if (this.props.onDisconnect) {
      this.props.onDisconnect();
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <label>서버 선택</label>
          <select className="selectpicker" defaultValue={serverUrl.local} onChange={this.setServerUrl}>
            <option value={serverUrl.local} defaultValue>로컬 서버</option>
            <option value={serverUrl.staging} >스테이징 서버</option>
            <option value={serverUrl.service}>서비스 서버</option>
          </select>
        </div>
        <div className="col">
          <label>방번호</label>
          <input type="text" defaultValue={this.roomId} onChange={this.serRoomId} />
        </div>
        <div className="col">
          <label>ActorId</label>
          <input type="text" defaultValue={this.actorId} onChange={this.setActorId} />
        </div>
        <div className="col">
          <label>ActorName</label>
          <input type="text" defaultValue={this.actorName} onChange={this.setActorName} />
        </div>
        <div className="col">
          <button type="button" className="btn btn-primary" onClick={this.connect}>connect</button>
        </div>
        <div className="col">
          <button type="button" className="btn btn-danger" onClick={this.disconnect}>disconnect</button>
        </div>
      </div>
    );
  }
}

export default Menu;
