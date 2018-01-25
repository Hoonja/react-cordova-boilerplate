import React, { Component } from 'react';

class Menu extends Component {
  connect = () => {
    if (this.props.onConnect) {
      this.props.onConnect();
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
        <div className="col-6">
          <button type="button" className="btn btn-primary" onClick={this.connect}>connect</button>
        </div>
        <div className="col-6">
          <button type="button" className="btn btn-danger" onClick={this.disconnect}>disconnect</button>
        </div>
      </div>
    );
  }
}

export default Menu;
