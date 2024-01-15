import mongoose from "mongoose";

const Schema = mongoose.Schema

const videoSchema = new Schema({
    section: { type: Schema.Types.ObjectId, ref: 'section', required: true },
    title: { type: String, required: true },
    description: { type: Text, required: true },
    url: { type: String, unique: true },
    position : {type : Number ,required : true}

})

const videoCollection = mongoose.model('video', videoSchema)

export default videoCollection