Commands Used:- 
1)First of all created server.js file.This server.js is server file of our project.Its same as i create app.js in my other nodejs project.here have named it server.js coz when i run it on heroku using heroku open command then internally it runs node server.js and hence have to keep the name of file as server.js instead of app.js
2)Did 'npm init' in ZoomCloneUsingNodejs project to initialize our nodejs app.So now package.json file will be created in our ZoomCloneUsingNodejs proj.
3)Now we need to install express js so did:- 'npm install express'
4)Now go to your server.js file to initialize this express project.
5)Now install nodemon for autorefresh the app on any chnages done so that you don't need to restart the app everytime some change is done.To install nodemon do:- npm install -g nodemon.
6)To run the app:- nodemon server.js
7)Now create our first ejs file namely room.js.So create folder view and then inside it create room.ejs.
8)Now install ejs,so do:- 'npm install ejs'
9)Now we need that each room on zoom clone need to have their own id i.e unique id so for that we will be using uuid.TO install it:- 'npm install uuid'.
10)Now have created the path app.get("/:room",(req,res)=>{}); to go to the room with mentioned room id.
11)Next step is that we want to create the architecture from which we can see our own video.So for that,first create public folder and create script.js file inside public folder.In this script.js,all your global js code will be kept.Also wrote app.use(express.static('public')); in server.js folder so for every static file you will use in your ejs whether it may be script file,css,image file,etc then it will go and search it in public folder.
12)Now we will use navigator.mediaDevices.getUserMedia in our script.js file bcoz this gives us lots of abilities to get video and audio output from chrome.Also getUserMedia is promise so it will be either resolved or rejected.
13)After video is properly playing,then created style.css to properly style it
14)Next Thing is to include socket.io into our app.The socket.io is used for real time communication.So if two person wants to communicate then they both need to be in same channel in socket.io .Socket is the library but it use web sockets which are very famous for asynchronous real time communication so socket.io gives use real time engine for communication.Now the web socket is like internet protocol but whats diff between http and sockets is as a client you can only make a request to the server and server can only respond,so in http server cannot send request to client but with socket io the server can send response as well as request to client and same goes for client as well.hence with socket io server doesn't have to wait for the request of client to arrive to start a communication.So thats why socket io is good for real time coz it does create the channel/tube so that mesg or traffic can go through from it.To install socket.io :- 'npm install socket.io' and then import it in your server.js file and then import it in your room.ejs file as well as in script.js file.
15)Now after setting up socket.io,next step is to identify all the user connected in the room specifically and to identify rach user in the specific room we need something that is called peer to peer.So for that we will use peerjs of WebRtc to send the streams between different user of that room. WebRTC allows the web browsers and mobile applications to communicate together in real time whereas PeerJS wraps the browser's WebRTC implementation to provide a compelete,configurable and easy to use peer to peer communication API.So through PeerJS you can communicate through video as well as audio calls.Now to install PeerJs:- 'npm install peer'.
16)After completing all the functionalities,we will now deploy our project on heroku.To install heroku:- npm install -g heroku.
17)Also after installing heroku,lets first push this code on git,for that first do:- 'git init' and now we have to create .gitignore file in which we will include name of all files and folders that we don't want to push on git .Then do git add . and then git commit -m 'mesg' and now you don't need to push it as bcoz we dont have created any branch yet (if you want to push it you can do afterwards also as commit will save all changes in your local storage),  you can direcly go on typing following commands:-
-heroku create(this command will deploy your app)
-git push heroku master	
-heroku ps:scale web=1 (This command does not deploy the app. It starts it, after you have deployed.
			When you deploy your application, heroku creates a "slug". A runnable zipped version of your app which is then stored. You can then start 			"dynos", which take your current slug and start it on one of heroku's servers.
		Running heroku ps:scale web=1 will scale your app to one running dyno, basically meaning you have one server running your app currently.
		If you deploy your app again, a new slug will be generated and stored, and your currently running dynos will be destroyed, to be replaced by new ones 		with the new version of your code.)
-heroku open(to open app in web browser)
-heroku logs --tail (If any error occured and app didn't started on browser then you can check logs using this command)
-heroku apps :- to see all your heroku apps
-heroku apps:destroy appname:- to destroy app
everytime you make any change to your code then run following commands:- git add . ,git commit -m 'mesg' , git push heroku master,heroku ps:scale web=1

URL:- https://afternoon-taiga-49612.herokuapp.com/61e10d77-1ddd-49e3-9955-31a28ebdb261

18)Peerjs has ability to create connection between different users using web rtc.
19)For you to get multiple videos, you must connect to a network (local network, internet, or just turn on your PC hotspot) this is because webrtc work over a network.
20)  Peer.connections[peerId][0].close()


WebRTC vs WebSockets:- https://bloggeek.me/webrtc-vs-websockets/
https://peerjs.com/




----------------------Using Simple Peer---------------------------------
-npm install simple-peer