import mongoose from "mongoose";
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'student', required: true },
    enid: { type: String, required: true },
    total: { type: Number, required: true },
    amountPayable: { type: Number, required: true },
    orderFrom: { type: String, enum: ['cart', 'single'] },
    isPaid: { type: Boolean, default: false },
}, { timestamps: true });
const orderCollection = mongoose.model('order', orderSchema);
export default orderCollection;
