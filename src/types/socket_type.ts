import { Socket } from "socket.io";

export interface UserSocketModel extends Socket{
    user_id : string
}