
const socket=io('/');
const videoGrid=document.getElementById('video-grid');
let peer=new Peer(null,{
    path:"/peerjs",
    host:"/",
    //in Dev:-
    // port:"3030"
    //In prod:-
    port:"443",
    proxied: true
});

const myVideo=document.createElement('video');
myVideo.muted=true;

let myVideoStream;

const peersOnCall={};
let myUserId;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
})
.then(stream=>{
    myVideoStream=stream;
    myVideo.setAttribute('id',myUserId);
    addVideoStream(myVideo,stream);
    peer.on('call',call=>{ 
      // console.log("On Call= "+call.peer);
      // console.log("Call Type= "+call.type);
      // for (const property in call) {
      //     console.log(`${property}: `);
      //   }
        // console.log("Inside 1");
        call.answer(stream);
        // console.log("Inside 2");
        peersOnCall[call.peer] = call;
        const video = document.createElement('video');
        video.setAttribute('id',call.peer);
        // console.log("Inside 3");        
        call.on('stream',userVideoStream =>{
          // console.log("userVideoStream= "+userVideoStream);
          // for (const property in userVideoStream) {
          //   console.log(`${property}: ${userVideoStream[property]}`);
          // }
            // console.log("Inside 4");            
            addVideoStream(video,userVideoStream);
            // console.log("Inside 5");   
            //for remove shareScreen Video element:- 
            video.setAttribute('class',userVideoStream.id);
            // video.setAttribute()
          // console.log(videoGrid);

        });
        // call.on('close',()=>{
        //   console.log("Closed");
        //   // video.remove();
        //   // peer.destroy();
        // })
        // console.log("Inside 6");
    });


    socket.on('User-Connected',(userId)=>{
      // console.log("User Connected= "+userId);
      //in Prod:-
        // connectToNewUser(userId,stream);
       //In Dev:-
        // user is joining
        setTimeout(() => {
          // user joined         
          connectToNewUser(userId, stream)
        }, 2000)
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
  document.getElementById(userId).remove();
  // if(peersOnCall[userId]){
  //   peersOnCall[userId].close();
  // }
  // let call=peersOnCall.map()
  // console.log(userId);
  // console.log("Disconnecting= "+userId);
  //OR
  // console.log(peer.connections[userId][0]);  
  // document.getElementById(userId).remove();
  // console.log(peer.connections[userId][0]);
  peer.connections[userId][0].close();  
})

// peer.on('disconnect',(userId)=>{
//   peer.connections[userId][0].close();
// })

peer.on('open',id=>{
    // myVideo.setAttribute('id',id);
    myUserId=id;
    // console.log("Peer id= "+id+" room= "+roomId);
    socket.emit('Join-Room',roomId,id);    
});

const connectToNewUser=(userId,stream)=>{
    // console.log("New User "+userId);
    const call=peer.call(userId,stream);
    // console.log("Inside 11");
    // console.log("Call= "+typeof call);
    const video = document.createElement('video');
    video.setAttribute('id',userId);
    // console.log("Inside 22"+ video);
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream );
        // console.log("Inside 33");
    });

    // console.log("Inside 44");
    // call.on('close',()=>{
    //   console.log("Closed");
    //   // video.remove();
    //   peer.destroy();
    // })
    peersOnCall[userId] = call;
}

const addVideoStream=(video,stream)=>{
  video.srcObject=stream;
  video.addEventListener('loadedmetadata',()=>{
      video.play();
  });
  videoGrid.append(video);
  // console.log("user Video");
}
// let displayMediaOptions = {
//   video: {
//     cursor: "always"
//   },
//   audio: false
// };
const shareScreen = async () => {
  let screenStream = null;
  
  try {
    screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    });
    const html = `
      <i class="unshare fa fa-arrow-circle-up"></i>
      <span>Unshare Screen</span>
    `
    document.querySelector('.main_share_button').innerHTML = html;
    // screenStream.setAttribute('id',"screenShared");
  } catch (err) {
    console.error("Error: " + err);
  }
  for (const property in peersOnCall) {
    peer.call(property, screenStream);
    // console.log(`${property}: ${peersOnCall[property]}`);
  }
  screenStream.oninactive =()=>{
    const html = `
      <i class="fa fa-arrow-circle-up"></i>
      <span>Share Screen</span>
  `
    document.querySelector('.main_share_button').innerHTML = html;
    // console.log(screenStream);
    socket.emit('removeShareScreen',screenStream.id); 
            

    // peer.call(property, screenStream);
  }
};

socket.on('remove', (screenStreamId) => {
  // console.log("Received= "+screenStreamId);
  // if(document.getElementById("screenShared")){
  //   document.getElementById("screenShared").remove();
  // }
    let elements = document.getElementsByClassName(screenStreamId);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
})

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