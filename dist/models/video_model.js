import mongoose from "mongoose";
const Schema = mongoose.Schema;
const videoSchema = new Schema({
    section: { type: Schema.Types.ObjectId, ref: 'section', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, unique: true, required: true },
    duration: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    isPaid: { type: Boolean }
});
const videoCollection = mongoose.model('video', videoSchema);
export default videoCollection;
