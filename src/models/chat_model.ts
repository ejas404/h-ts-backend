import mongoose from "mongoose";


const Schema = mongoose.Schema


const chatSchema = new Schema({
    
    sender : {type : mongoose.Types.ObjectId, required : true},
    reciever : {type : mongoose.Types.ObjectId, required : true},
    message : {type : String,required : true}

},
{timestamps : true}
)


const chatsCollection = mongoose.model('chats', chatSchema)

export default chatsCollection;