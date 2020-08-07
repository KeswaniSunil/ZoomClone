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

io.on('connection',socket=>{
    socket.on("Join-Room",(roomId,userId)=>{
        // console.log("Room Joined");
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('User-Connected',userId);
        //socket.on will listen for the mesg and when you press enter then it will recieve it:-
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message);
        })
    })
});

//To make server run on localhost and on 3030 port:- 
server.listen(process.env.PORT||3030)
