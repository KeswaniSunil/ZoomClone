const express=require ('express');
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const {v4:uuidv4}=require('uuid');

app.set('view engine','ejs');
app.use(express.static('public'));

app.get("/",(req,res)=>{
    // res.status(200).send("Hello world");
    // res.render('room');
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room",(req,res)=>{
    res.render('room',{roomId:req.params.room});
});

let clients = 0
io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        console.log("New Client");
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

//To make server run on localhost and on 3030 port:- 
server.listen(process.env.PORT||3030);