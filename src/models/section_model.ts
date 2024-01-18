import mongoose from "mongoose";

const Schema = mongoose.Schema

const sectionSchema = new Schema({
    course : {type : Schema.Types.ObjectId, ref : 'course', required : true},
    title : {type : String, required : true},
    description : {type : String, required : true},
    isDeleted : {type : Boolean , default : false}
})

const sectionCollection = mongoose.model('section', sectionSchema)

export default sectionCollection