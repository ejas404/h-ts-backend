import mongoose from "mongoose";


const Schema = mongoose.Schema


const chatSchema = new Schema({
    
    sender : {type : mongoose.Types.ObjectId, required : true},
    receiver : {type : mongoose.Types.ObjectId, required : true},
    message : {type : String,required : true},
    contentType : {type : String,enum : ["TEXT","IMAGE"],required : true}

},
{timestamps : true}
)


const chatsCollection = mongoose.model('chats', chatSchema)

export default chatsCollection;