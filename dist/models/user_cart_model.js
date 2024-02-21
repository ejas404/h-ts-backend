import mongoose from "mongoose";
const Schema = mongoose.Schema;
const cartSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'student' },
    course: [{ type: mongoose.Types.ObjectId, ref: 'course', required: true }]
});
const cartCollection = mongoose.model('cart', cartSchema);
export default cartCollection;
