
const socket=io('/');
const videoGrid=document.getElementById('video-grid');
let peer=new Peer(null,{
    path:"/peerjs",
    host:"/",
    //in Dev:-
    // port:"3030"
    //In prod:-
    port:"443"
});

const myVideo=document.createElement('video');
myVideo.muted=true;

let myVideoStream;

const peersOnCall={}

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
})
.then(stream=>{
  myVideoStream=stream;

    addVideoStream(myVideo,stream);
    
    peer.on('call',call=>{ 
        // console.log("Inside 1");
        call.answer(stream);
        // console.log("Inside 2");
        const video = document.createElement('video');
        // console.log("Inside 3");        
        call.on('stream',userVideoStream =>{
            // console.log("Inside 4");            
            addVideoStream(video,userVideoStream);
            // console.log("Inside 5");            
        });
        // console.log("Inside 6");
    });


    socket.on('User-Connected',(userId)=>{
      // console.log("Stream= "+stream);
      //in Dev:-
        connectToNewUser(userId,stream);
       //In Prod:-
        // // user is joining
        // setTimeout(() => {
        //   // user joined
        //   connectToNewUser(userId, stream)
        // }, 3000)
    })
    let text=$('#chat_message');
    $('html').keydown((e)=>{
      if(e.which == 13 && text.val().length!=0){
        // console.log("Message being sent to all other Users= "+ text.val());
        socket.emit('message',text.val());
        text.val('');
      }
    });

    socket.on("createMessage",message=>{
      // console.log("Message Came from server= "+message);
      $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
    });
});

socket.on('User-Disconnected', userId => {
  if(peersOnCall.userId){
    peersOnCall.userId.close();
  }
})

peer.on('open',id=>{
    // console.log("Peer id= "+id+" room= "+roomId);
    socket.emit('Join-Room',roomId,id);    
});

const connectToNewUser=(userId,stream)=>{
    // console.log("New User "+userId);
    const call=peer.call(userId,stream);
    // console.log("Inside 11");
    // console.log("Call= "+typeof call);
    const video = document.createElement('video')
    // console.log("Inside 22"+ video);
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream );
        // console.log("Inside 33");
    });
    // console.log("Inside 44");
    call.on('close',()=>{
      video.remove();
    })
    peersOnCall.userId=call;
}

const addVideoStream=(video,stream)=>{
  video.srcObject=stream;
  video.addEventListener('loadedmetadata',()=>{
      video.play();
  });
  videoGrid.append(video);
  // console.log("user Video");
}

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

const leave=()=>{

}