import mongoose from "mongoose";

const Schema = mongoose.Schema


const subCategorySchema = new Schema({
    name : {type : String, required : true, unique : true},
    category : {type : mongoose.Types.ObjectId, ref : 'courseCategory'},
    description : {type : mongoose.Types.ObjectId, required : true},
    isDeleted : {type : Boolean , default : false}
})


const subCategoryCollection = mongoose.model('subCategory', subCategorySchema)

export default subCategoryCollection;