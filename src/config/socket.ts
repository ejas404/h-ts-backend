
import http from "http";
import { Server } from 'socket.io';
import { UserSocketModel } from "../types/socket_type.js";
import { addChat } from "../utility/add_chat.js";


export const  socketUsers = new Map();

export const configSocket = (server: http.Server) => {
    const io = new Server(server, {cors: { origin: '*'}});

    io.use((socket, next) => {

        const user_id = socket.handshake.query.user_id
        if (!user_id) { return next(new Error("invalid user id from socket"))}

        (socket as UserSocketModel).user_id = user_id as string
        socketUsers.set(user_id,socket)    
        next()
    })

    io.on('connection', (socket) => {

        console.log('user connected')
      
        socket.on('msg', data => {
            addChat((socket as UserSocketModel).user_id, data.receiver, data.message)
            .then((response) => {
                const res = socketUsers.get(data.receiver)
                if (res) { socket.broadcast.to(res.id).emit('reply', response) }
            }).catch(e => {
                console.log(e)
            })    
        })

        socket.on('img',data => {
            
        })


        socket.on('disconnect', () => {
            console.log('a user disconnected!');
            socketUsers.delete((socket as UserSocketModel).user_id)
        });

    })


}

// function checkUserExist(users: { id: string, user_id: string }[], user_id, socket) {
//     for (let each of users) {
//         if(each.user_id === user_id){
//             const temp = each.id;
//             each.id = socket.id;      
//             return temp;
//         } 
        
//     }
//     return false;
// }





// for (let [id, socket] of io.of("/").sockets) {
//     users.push({
//         id: id,
//         user_id: socket.user_id,
//     });
// }