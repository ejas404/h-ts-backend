import mongoose from "mongoose";
const Schema = mongoose.Schema;
const courseEnrollSchema = new Schema({
    enid: { type: String, required: true },
    course: { type: mongoose.Types.ObjectId, ref: 'course', required: true },
    rating: { type: Number, default: 0 },
    isEnrolled: { type: Boolean, default: false },
    progress: [{ type: mongoose.Types.ObjectId, ref: 'video' }]
});
// export type enrollmentType = InferSchemaType<typeof courseEnrollSchema>
const enrollCollection = mongoose.model('enroll', courseEnrollSchema);
export default enrollCollection;
