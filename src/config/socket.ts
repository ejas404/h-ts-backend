//@ts-nocheck

import http from "http";
import { BASE_URL } from "../utility/constants";
import { Server } from 'socket.io';
import { UserSocketModel } from "types/socket_type";
import chatsCollection from "models/chat_model";

export const configSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: BASE_URL
        },
    });

    io.on('connection', (socket) => {
        const userSocket = socket as UserSocketModel
        console.log('user connected')

        const users = [];

        io.use((socket, next) => {
            const userSocket = socket as UserSocketModel
            const user_id = userSocket.handshake.query.user_id
            if (!user_id) {
                return next(new Error("invalid username"));
            }

            userSocket.user_id = user_id as string
            next()
        })


        for (let [id, socket] of io.of("/").sockets) {
            users.push({
                id: id,
                user_id: socket.user_id,
            });
        }

        //todo: add the chat details in the chatcollection

        userSocket.on('msg', data => {
            const res = users.filter(each => each.user_id === data.reciever)[0]
            if (res) {
                socket.broadcast.to(res.id).emit('reply', data.text)
            }
        })

        // userSocket.onAny((event, ...args) => {
        //     console.log(event, args);
        // });

        userSocket.on('disconnect', () => {
            console.log('a user disconnected!');
        });

    })

    function setUser(socket: UserSocketModel, users: any[]) {



    }


}