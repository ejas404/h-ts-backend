import mongoose from "mongoose";

const Schema = mongoose.Schema

const sectionSchema = new Schema({
    course : {type : Schema.Types.ObjectId, ref : 'course', required : true},
    title : {type : String, required : true},
    description : {type : Text, required : true}
})

const sectionCollection = mongoose.model('section', sectionSchema)

export default sectionCollection