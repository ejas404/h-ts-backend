import chatsCollection from "../models/chat_model.js";
import mongoose from "mongoose";

export const addChat = async (sender_id : string,reciever_id : string,message : string)=> {
    try{
        const sender = new mongoose.Types.ObjectId(sender_id)
        const receiver = new mongoose.Types.ObjectId(reciever_id)
        
        const newChat = await chatsCollection.create({sender,receiver,message,contentType : "TEXT"})
        return newChat
    }catch(e : any){
        throw new Error(e)
    }
}

