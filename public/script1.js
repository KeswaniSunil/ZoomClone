// let Peer = require('simple-peer');
const socket = io.connect('/')
const videoGrid = document.getElementById('video-grid')


const myVideo=document.createElement('video');
myVideo.muted = true;
myVideo.setAttribute('id','userVideo');

const myPVideo=document.createElement('video');
// myPVideo.muted = true;
myPVideo.setAttribute('id','partnerVideo');

let myVideoStream;
let client = {};

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo,stream);
  myVideoStream=stream;
  socket.emit('NewClient');  
  console.log("Inside");
  //used to initialize a peer
  function InitPeer(type) {
      let peer = new SimplePeer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
      console.log("peer= "+peer);
      peer.on('stream', function (stream) {
        addVideoStream(myPVideo,stream);
      })
      //This isn't working in chrome; works perfectly in firefox.
      // peer.on('close', function () {
      //     document.getElementById("peerVideo").remove();
      //     peer.destroy()
      // })
      peer.on('data', function (data) {
          let decodedData = new TextDecoder('utf-8').decode(data)
          let peervideo = document.querySelector('#peerVideo')
          peervideo.style.filter = decodedData
      })
      return peer
  }

  //for peer of type init
  function MakePeer() {
      client.gotAnswer = false
      console.log("init peer");
      let peer = InitPeer('init')
      peer.on('signal', function (data) {
          if (!client.gotAnswer) {
              socket.emit('Offer', data)
          }
      })
      client.peer = peer
  }

  //for peer of type not init
  function FrontAnswer(offer) {
      console.log("non-init peer");
      let peer = InitPeer('notInit')
      peer.on('signal', (data) => {
          socket.emit('Answer', data)
      })
      peer.signal(offer)
      client.peer = peer
  }

  function SignalAnswer(answer) {
    client.gotAnswer = true
    let peer = client.peer
    peer.signal(answer)
  }

  function SessionActive() {
    document.write('Session Active. Please come back later')
  }

  function RemovePeer() {
    document.getElementById("partnerVideo").remove();
    // document.getElementById("muteText").remove();
    if (client.peer) {
        client.peer.destroy()
    }
  }
  socket.on('BackOffer', FrontAnswer)
  socket.on('BackAnswer', SignalAnswer)
  socket.on('SessionActive', SessionActive)
  socket.on('CreatePeer', MakePeer)
  socket.on('Disconnect', RemovePeer)
})
.catch(err => document.write(err));

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main_mute_button').innerHTML = html;
}

const playStop = () => {
  // console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  // console.log("Video info= "+ myVideoStream.getVideoTracks()[0]);
  // if (myVideoStream.getVideoTracks()[0].readyState==='live') {
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled = false;
    // myVideoStream.getVideoTracks()[0].stop();
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
    // myVideoStream.getVideoTracks()[0].start();
    // myVideoStream.start();
  }
}
const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}