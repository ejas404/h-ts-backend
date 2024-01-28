import mongoose from 'mongoose'

const Schema = mongoose.Schema

const courseSchema = new Schema({
    title: { type: String, required: true },
    cover: { type: String },
    tutor: { type: Schema.Types.ObjectId, ref: 'tutor' },
    category : { type: Schema.Types.ObjectId, ref: 'categories' },
    subCategory : { type: Schema.Types.ObjectId, ref: 'subcategories' }
}
    
)


const upcomingCourseCollection = mongoose.model('upcomingCourse', courseSchema)

export default upcomingCourseCollection