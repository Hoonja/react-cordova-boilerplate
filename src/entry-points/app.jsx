import React, { Component } from 'react';
import VideoPhone from '../containers/VideoPhone.jsx';

export default class App extends Component {
  render() {
    return (
      <div>
        <div>
          <h3>VideoPhone sample</h3>
        </div>
        <VideoPhone />
      </div>
    );
  }
}
