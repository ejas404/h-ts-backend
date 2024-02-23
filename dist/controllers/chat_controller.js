var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import chatsCollection from "../models/chat_model.js";
import { socketUsers } from "../config/socket.js";
export const sendImage = asyncHandler((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiver } = JSON.parse(request.body.chat);
    const { sender } = request.body;
    const reciever_id = new mongoose.Types.ObjectId(receiver);
    const message = request.file.path;
    const newChat = yield chatsCollection.create({ sender, receiver: reciever_id, message, contentType: "IMAGE" });
    if (socketUsers.has(receiver)) {
        console.log('socket user exists');
        const socket = socketUsers.get(receiver);
        socket.emit('reply', newChat);
    }
    response.json({ newChat, success: 'image send successfully' });
}));
