import asyncHandler from "express-async-handler"
import courseCollection from "../../models/course_model"
import mongoose from "mongoose"
import enrollCollection from "../../models/course_enroll_model"
import studentCollection from "../../models/student_model"

export const getTutorConnections =  asyncHandler(async(req : any  ,res )=>{
    const tutor_id = new mongoose.Types.ObjectId(req.tutor._id)
    const courseDetails = await courseCollection.find({tutor : tutor_id},{_id : 1})
    const courseList = courseDetails.map(each => each._id)

    const getEnrolls = await enrollCollection.find({course : {$in : courseList }})
    const enrolledUser = getEnrolls.map(each => each.user)
    const connList = await studentCollection.find({_id : {$in : enrolledUser}},{name : 1,profile : 1})

    res.json({connections : connList})
   
})