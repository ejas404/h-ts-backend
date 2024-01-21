import mongoose from "mongoose";

const Schema = mongoose.Schema


const courseCategorySchema = new Schema({
    name : {type : String, required : true, unique : true},
    description : {type : mongoose.Types.ObjectId, required : true},
    isDeleted : {type : Boolean , default : false}
})


const courseCategoryCollection = mongoose.model('courseCategory', courseCategorySchema)

export default courseCategoryCollection;