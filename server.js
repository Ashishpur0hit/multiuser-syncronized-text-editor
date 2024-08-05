import express from 'express';
import http from 'http';
import path  from 'path';
import { Server } from 'socket.io';
import ACTIONS from './src/actions.js';
import { fileURLToPath } from 'url';

const app=express();
const server = http.createServer(app);
const io = new Server(server,{
    cors :{ 
        origin : 'http://localhost:5173',
    }
})

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);



// app.use(express.static('dist'));
// app.use((req, res, next) => {
//     res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

const userSocketMap={};

function getAllConnectedClients(roomId){
    const ClientsInRoom =  Array.from(io.sockets.adapter.rooms.get(roomId) || []);
   
    const array = ClientsInRoom.map((socketId)=>{
        return {
            socketId:socketId,
            username : userSocketMap[socketId]
        }
    })

    return array;
}

app.get('/',(request,responce)=>{
    responce.send('Hello World')});

    app.get('/getUsers',(request,responce)=>{
        const id = request.query.roomId;
        const ans = getAllConnectedClients(id);
        responce.json({
            list : ans
        });
    })

io.on('connection',(socket)=>{
    console.log(`Connection Successfull with ${socket.id}`);


    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        userSocketMap[socket.id]=username;
        
        console.log(roomId);
        socket.join(roomId);
        const clientsList = getAllConnectedClients(roomId);
        console.log(clientsList);
        io.to(roomId).emit(ACTIONS.JOINED,{list: clientsList ,username : userSocketMap[socket.id] , socketId:socket.id});
        
    });


    socket.on(ACTIONS.CODE_CHANGE,(data)=>{
        socket.to(data.roomId).emit(ACTIONS.CODE_CHANGE,{code : data.code});
    })


    socket.on(ACTIONS.SYNC_CODE,(data)=>{
        socket.to(data.socketId).emit(ACTIONS.CODE_CHANGE,{code : data.code});
    })



    socket.on('disconnecting',()=>{
        const rooms=[...socket.rooms];

        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{socketId : socket.id , username:userSocketMap[socket.id]});
        });

        delete userSocketMap[socket.id];
        socket.leave();
    })
});


server.listen(3000,()=>{
    console.log('Server is Running Succesfully on Port 3000' );
})


