import React, { Component } from 'react';

class Videos extends Component {
  turnOnCamera = () => {
    // console.log('[Videos] turnOnCamera');
    // navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true
    // })
    // .then(stream => {
    //   const myVidbox = document.querySelector('#vidbox-me');
    //   const vidSelf = document.createElement('VIDEO');
    //   vidSelf.autoplay = true;
    //   vidSelf.width = 180;
    //   vidSelf.height = 240;
    //   vidSelf.volume = 0;
    //   vidSelf.id = 'vidSelf';
    //   // var vidSelf = document.querySelector('#vid-self');
    //   if (vidSelf) {
    //     vidSelf.srcObject = stream;
    //     if (window.cordova && window.cordova.plugins && window.cordova.plugins.iosrtc) {
    //       window.cordova.plugins.iosrtc.refreshVideos();
    //     }
    //     myVidbox.appendChild(vidSelf);
    //   } else {
    //     console.error('Could not find the element for my video');
    //   }
    // })
    // .catch(err => {
    //   console.error(err);
    // });
  }

  addPeerVideo = (stream) => {

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
