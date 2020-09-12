const express=require ('express');
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const {v4:uuidv4}=require('uuid');
const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{
    debug:true
});



app.set('view engine','ejs');
app.use(express.static('public'));
app.use("/peerjs",peerServer);

app.get("/",(req,res)=>{
    // res.status(200).send("Hello world");
    // res.render('room');
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room",(req,res)=>{
    res.render('room',{roomId:req.params.room});
});

//This will run everytime someone connects to our webpage
io.on('connection',socket=>{
    //socket variable is object on which user is connecting to.
    //First event i have kept that socket will listen to when someone gets connected is 'Join-Room' 
    socket.on("Join-Room",(roomId,userId)=>{
        // console.log("Room Joined");
        socket.join(roomId);
        //Sending broadcast message to all other users of room.It will not be broadcast to current User.Just to all other users of room
        socket.to(roomId).broadcast.emit('User-Connected',userId);
        //socket.on will listen for the mesg and when you press enter then it will recieve it:-
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message);
        })
        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('User-Disconnected',userId);            
        })
    })
});

//To make server run on localhost and on 3030 port:- 
server.listen(process.env.PORT||3030)
