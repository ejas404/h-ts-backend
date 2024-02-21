import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const courseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    cover: { type: String },
    fee: { type: Number, requrired: true },
    tutor: { type: Schema.Types.ObjectId, ref: 'tutor' },
    category: { type: Schema.Types.ObjectId, ref: 'categories' },
    subCategory: { type: Schema.Types.ObjectId, ref: 'subcategories' },
    isAvailable: { type: Boolean, default: true },
    isApproved: { type: Boolean },
    isTutorMade: { type: Boolean, default: false },
    request: { type: String, enum: ['Pending', 'Cancelled', 'Approved'] },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});
const courseCollection = mongoose.model('course', courseSchema);
export default courseCollection;
