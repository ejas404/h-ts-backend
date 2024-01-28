import mongoose from "mongoose";

const Schema = mongoose.Schema


const subCategorySchema = new Schema({
    name : {type : String, required : true, unique : true},
    category : {type : mongoose.Types.ObjectId, ref : 'categories'},
    description : {type : String, required : true},
    isDeleted : {type : Boolean , default : false}
})


const subCategoryCollection = mongoose.model('subcategories', subCategorySchema)

export default subCategoryCollection;