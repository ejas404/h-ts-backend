import asyncHandler from "express-async-handler"
import courseCollection from "models/course_model.ts"
import { isNumber } from "type_check/number"
import { isString } from "type_check/string"


export const getCourses = asyncHandler(async (req : any,res)=>{
    const tutorCourses = await courseCollection.find({tutor : req.tutor._id})

    res.json({tutorCourses})
})

export const requestCourse = asyncHandler(async(req : any,res)=>{

    const {title , description , fee} = req.body
    
    const courseFee = Number(fee)
  
    if(!isString(title)) throw new Error ('invalid title')
    if(!isString(description)) throw new Error ('invalid description')
    if(!isNumber(courseFee)) throw new Error('invalid course price')


    const newCourse = await courseCollection.create({
        fee : courseFee,
        tutor : req.tutor._id,
        title,
        description,
        isTutorMade : true,
        isAvailable : false,
        isApproved : false
    })

    res.json({newCourse})
})
