const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  // path: '/peerjs',
  host: '/',
  port: '3031'
})
const myVideo = document.createElement('video')
myVideo.muted = true;

const peersOnCall={}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('User-Connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('User-Disconnected', userId => {
    if(peersOnCall.userId){
      peersOnCall.userId.close();
    }
})

myPeer.on('open', id => {
  socket.emit('Join-Room', roomId, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close',()=>{
    video.remove();
  })
  peersOnCall.userId=call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}