import mongoose from "mongoose";
const Schema = mongoose.Schema;
const courseCategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
});
const courseCategoryCollection = mongoose.model('categories', courseCategorySchema);
export default courseCategoryCollection;
