//@ts-nocheck

import http from "http";
import { BASE_URL } from "../utility/constants";
import { Server } from 'socket.io';
import { UserSocketModel } from "../types/socket_type";
import { addChat } from "../utility/add_chat";

export const configSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: BASE_URL
        },
    });

    let users = [];

    io.on('connection', (socket) => {
        const userSocket = socket as UserSocketModel
        console.log('user connected')
        users = users.filter(each => each.user_id !== undefined)
        console.log(users)

        io.use((socket, next) => {
            const userSocket = socket as UserSocketModel
            const user_id = userSocket.handshake.query.user_id
            if (!user_id) {
                return next(new Error("invalid username"));
            }

            socket.user_id = user_id as string

            //check the user is existing and remove him
            const check = checkUserExist(users, user_id,socket);
            if(!check){
                users.push({
                    id: socket.id,
                    user_id: socket.user_id,
                });
            }
            

            next()
        })

        userSocket.on('msg', data => {
            const res = users.filter(each => each.user_id === data.receiver)[0]
            if (res) {
                console.log('res printing',res)
                addChat(userSocket.user_id, data.receiver, data.message)
                    .then((response) => {
                        userSocket.broadcast.to(res.id).emit('reply', response)
                    }).catch(e => {
                        console.log(e)
                    })
            }
        })

        userSocket.onAny((event, ...args) => {
            console.log(event, args);
        });



        userSocket.on('disconnect', () => {
            console.log('a user disconnected!');
        });

    })


}

function checkUserExist(users: { id: string, user_id: string }[], user_id, socket) {
    for (let each of users) {
        if(each.user_id === user_id){
            const temp = each.id;
            each.id = socket.id;      
            return temp;
        } 
        
    }
    return false;
}





// for (let [id, socket] of io.of("/").sockets) {
//     users.push({
//         id: id,
//         user_id: socket.user_id,
//     });
// }