import mongoose from "mongoose";

const Schema = mongoose.Schema


const courseEnrollSchema = new Schema({
    user: {type : mongoose.Types.ObjectId, ref : 'student', required : true},
    course : {type : mongoose.Types.ObjectId, ref : 'course', required : true},
    time : {type : Date, required : true},
    rating : {type : Number, default : 0},
    progress : [
        {
            section : {type : mongoose.Types.ObjectId, ref : 'section'},
            progressCount : {type : Number}
        }
    ],
    isEnrolled : {type : Boolean, default : false}
})


const courseEnrollCollection = mongoose.model('enroll', courseEnrollSchema)

export default courseEnrollCollection;