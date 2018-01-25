import React, { Component } from 'react';

class Videos extends Component {
  componentDidMount() {

  }
  
  render() {
    return (
      <div className="row">
        <div id="vidbox-me" className="col-6">
          내 얼굴
        </div>
        <div id="vidbox-you" className="col-6">
          니 얼굴
        </div>
      </div>
    );
  }
}

export default Videos;
