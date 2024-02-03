import http from "http";
import { BASE_URL } from "../utility/constants";
import { Server } from 'socket.io';
import { UserSocketModel } from "types/socket_type";

export const configSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: BASE_URL
        },
    });

    io.on('connection', (socket) => {
        const userSocket = socket as UserSocketModel
        console.log('user connected')

        io.use((socket, next) => {
            console.log('socket middle ware')
            const userSocket = socket as UserSocketModel
            const user_id = userSocket.handshake.query.user_id
            if (!user_id) {
                return next(new Error("invalid username"));
            }
    
            userSocket.user_id = user_id as string
            next()
        })

        userSocket.on('msg', msg => {
            io.emit('reply', socket.id, msg)
        })

        userSocket.onAny((event, ...args) => {
            console.log(event, args);
        });

        userSocket.on('disconnect', () => {
            console.log('a user disconnected!');
        });

    })

  
}