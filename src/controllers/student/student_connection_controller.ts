import asyncHandler from "express-async-handler"
import enrollCollection from "../../models/course_enroll_model"
import mongoose from "mongoose"
import tutorCollection from "../../models/tutor_model"

export const connectedTutors = asyncHandler(async(req : any,res) => {
    const user = new mongoose.Types.ObjectId(req.user._id)
    const enrolledList : any = await enrollCollection.find({user, isEnrolled : true}).populate('course','tutor');
    const tutorList =  enrolledList.map((each: { course: { tutor: any } }) => each.course.tutor)
    const getTutorDatas = await tutorCollection.find({_id : {$in : tutorList}},{name : 1,profile : 1})

    res.json({connections : getTutorDatas})
})