import { Server } from 'socket.io';
import { addChat } from "../utility/add_chat";
export const socketUsers = new Map();
export const configSocket = (server) => {
    const io = new Server(server, { cors: { origin: '*' } });
    io.use((socket, next) => {
        const user_id = socket.handshake.query.user_id;
        if (!user_id) {
            return next(new Error("invalid user id from socket"));
        }
        socket.user_id = user_id;
        socketUsers.set(user_id, socket);
        next();
    });
    io.on('connection', (socket) => {
        console.log('user connected');
        socket.on('msg', data => {
            const res = socketUsers.get(data.receiver);
            if (res) {
                addChat(socket.user_id, data.receiver, data.message)
                    .then((response) => {
                    socket.broadcast.to(res.id).emit('reply', response);
                }).catch(e => {
                    console.log(e);
                });
            }
        });
        socket.on('disconnect', () => {
            console.log('a user disconnected!');
            socketUsers.delete(socket.user_id);
        });
    });
};
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
