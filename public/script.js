//This all things are explained in video from 46th minute
//If you have any doubt how socket.io is working then go on to their site,all my code is same as  of their.
//If you have any doubt how PeerJs is working then go on to their site,all my code is same as  of their.


const socket=io('/');
const videoGrid=document.getElementById('video-grid');
let peer=new Peer(null,{
    path:"/peerjs",
    host:"/",
    // port:"3030"
    port:443
});

const myVideo=document.createElement('video');
myVideo.muted=true;



const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    });
    videoGrid.append(video);
    console.log("user Video");
}

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
})
.then(stream=>{
  myVideoStream=stream;

    //to show user video on browser after his camera is connected:-
    addVideoStream(myVideo,stream);
    
    peer.on('call',call=>{ 
        console.log("Inside 1");
        call.answer(stream);
        console.log("Inside 2");
        const video = document.createElement('video');
        console.log("Inside 3");        
        call.on('stream',userVideoStream =>{
            console.log("Inside 4");            
            addVideoStream(video,userVideoStream);
            console.log("Inside 5");            
        });
        console.log("Inside 6");
    });


    //Now sending request to connect this specific user to room id specified on socket.emit()
    socket.on('User-Connected',(userId)=>{
      console.log("Stream= "+stream);
        connectToNewUser(userId,stream);
    })
    //Now for messaging we will use jquery.As we included bootstarp so jquery is also included as it comes as js file when 
    //you include all js file for bootstrap
    let text=$('#chat_message');
    $('html').keydown((e)=>{
      if(e.which == 13 && text.val().length!=0){
        console.log("Message being sent to all other Users= "+ text.val());
        socket.emit('message',text.val());
        text.val('');
      }
    });

    socket.on("createMessage",message=>{
      console.log("Message Came from server= "+message);
      $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
    });
});

peer.on('open',id=>{
    //this id is for the specific person connecting to the room,so if 4 ppl are in room then 4 peer id will be
    //geenrated i.e 1 for each user.This id is generated automatically by peerjs
    console.log("Peer id= "+id+" room= "+roomId);

    //Now this specific user wants to join troom now,so for that:-
    socket.emit('Join-Room',roomId,id);    
});

const connectToNewUser=(userId,stream)=>{
    console.log("New User "+userId);
    //here we will use peer to connect to our other user joined in the room.
    //So to call the other user we need to type all the below code from 61 to 68 line.
    const call=peer.call(userId,stream);
    console.log("Inside 11");
    console.log("Call= "+typeof call);
    //creating video element to show the video of any other user that connected in the room.So in every user screen this function 
    //will be called for every other person in room except current user and this video element will be created for all other user in curren user's
    //screen except current user coz for current user we already have created video screen i.e on line 31
    const video = document.createElement('video')
    console.log("Inside 22"+ video);
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream );
        console.log("Inside 33");
    });
    console.log("Inside 44");
    //Now to answer the call of user,the code is written on line number 33
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
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
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