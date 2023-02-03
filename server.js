const http=require('http');
const express=require('express');

// creating Server

const app=express();
const server=http.createServer(app);
 // Assigning The Port To Server
const port=process.env.PORT || 3000;

// Using Static method of Express For Css, Icons,

app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});


const io=require("socket.io")(server);
var users={};
// when connection Event Is Occured We emitting New User joined Event 
io.on("connection",socket=>{

    socket.on("new-user-joined",(username)=>{
        // assigning Unique Id To Each Socket
        users[socket.id]=username;
        socket.broadcast.emit("user-joined",username);
        io.emit('user-list',users);
    });
 // When The dissconnect event Is occured We Delteing That Id And socket
    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected',user=users[socket.id]);
        delete users[socket.id];
        io.emit('user-list',users);
    });
//  When Message event Is Occuered We Sending Message
    socket.on('message',(data)=>{
        socket.broadcast.emit("message",data);
    })
});


// server Listen  
server.listen(port,()=>{
    console.log("server Is started At ",port);
});