 const express = require("express");
require("./db/mongoose");
const routesUser=require('./routes/usersRoutes');
const routesRoom=require('./routes/videoRoomRoutes');
const bodyParser = require("body-parser");
const cookieParser=require("cookie-parser");
const cors =require('cors');
const {Server} = require('socket.io');
const {v4: uuidv4} = require('uuid');
const Room = require('../projectBackend/models/roomModels')
const jwt = require('jsonwebtoken');
const User = require('./models/userModels');
const auth = require('./middleware/auth');




app = express();
app.use(cookieParser());


const http=require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    credentials:true,
    origin:"http://localhost:4200"
  }
})


io.on('connection', (socket) =>{
  
  console.log("user connected");
  

  const {rooms}=io.sockets.adapter;
  socket.on('create-room', (username) => {
    
    const roomId = uuidv4();
    const room=rooms.get(roomId);
    
    
    
    console.log({rooms}) 
    socket.join(roomId);
    const roomClients = io.sockets.adapter.rooms.get(roomId).size
    console.log('roomClients', roomClients);
    console.log({rooms})
    console.log('socket.id', socket.id);

    socket.emit('room-created', {roomId:roomId, peerId:socket.id});
    console.log("user created room", roomId);

  })

  socket.on('join-room', (event) => {
      
      
      socket.join(event.roomId);
     
      console.log("user", event.peerId, "joined room", event.roomId);
      console.log(event.username);

    

  })

  socket.on('list-of-users', (event) => {
    console.log(event.username);
    socket.broadcast.to(event.roomId).emit('list-of-users', event.username);
  })



  
  socket.on('ready', (event) => {
    console.log('user', event.senderId, 'ready to go in room', event.roomId);
    socket.broadcast.to(event.roomId).emit('ready', (event));
  })

  socket.on('ice-candidate', (event) => {
    
    console.log("Sending ice candidate event to peers in room", event.roomId, "from peer", event.senderId, "to peer", event.receiverId);
    socket.broadcast.to(event.receiverId).emit('ice-candidate', event);
  })
  
  socket.on('offer', (event) => {
    console.log('offer recieved and sending to all peers in room', event.roomId, 'from peer', event.senderId);
    socket.broadcast.to(event.receiverId).emit('offer', {
      offer: event.offer,
      senderId:event.senderId
    })
    
  })

  socket.on('answer', (event) => {
    console.log('sending to peers in room', event.roomId, ' from peer', event.senderId, 'to', event.receiverId);
    socket.broadcast.to(event.receiverId).emit('answer', {
      answer: event.answer,
      senderId: event.senderId
    });

  })

  socket.on('new-message', (event) => {
    console.log('in room', event.roomId, 'message is', event.message.text);
    io.sockets.to(event.roomId).emit('new-message', event.message);
  })
  

  socket.on('leave', (event) => {
    console.log('user', event.peerId, 'leaves the room');
    socket.leave(event.roomId);
    socket.broadcast.to(event.roomId).emit('leave', event);

  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    
    
  })
  

  
  
})


const corsConfig = {
  credentials:true,
  origin:true
};

app.use(cors(corsConfig));




require('dotenv').config();

app.use(bodyParser.json())




app.use('/app', routesUser);
app.use('/app', routesRoom);




http.listen(3000, () => {
  console.log("App is running on port 3000");
})




