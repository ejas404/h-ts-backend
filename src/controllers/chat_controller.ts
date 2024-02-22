import mongoose from "mongoose"
import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import chatsCollection from "../models/chat_model.js"
import { socketUsers } from "../config/socket.js"
import { Socket } from "socket.io"

export const sendImage = asyncHandler(async (request: Request, response: Response) => {
    const { receiver } = JSON.parse(request.body.chat)
    const { sender } = request.body
    const reciever_id = new mongoose.Types.ObjectId(receiver)
    const message = (request.file as any).path

    const newChat = await chatsCollection.create({ sender, receiver :reciever_id , message, contentType: "IMAGE" })
   
    if(socketUsers.has(receiver)){
        console.log('socket user exists')
        const socket : Socket = socketUsers.get(receiver)
        socket.emit('reply', newChat)
    }

    response.json({newChat,success : 'image send successfully'}) 
})