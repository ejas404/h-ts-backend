import asyncHandler from "express-async-handler"
import courseCollection from "../../models/course_model.ts"
import { isNumber } from "../../type_check/number.ts"
import { isString } from "../../type_check/string.ts"
import { Request, Response } from "express"
import { JWTTutorReq } from "types/express_req_res.ts"


export const getCourses = asyncHandler(async (req : Request,res : Response)=>{

    const tutorReq = req as JWTTutorReq

    const tutorCourses = await courseCollection.find({tutor : tutorReq.tutor._id})

    res.json({tutorCourses})
})

export const requestCourse = asyncHandler(async(req : Request,res : Response)=>{

    const tutorReq = req as JWTTutorReq


    const {title , description , fee} = req.body
    
    const courseFee = Number(fee)
  
    if(!isString(title)) throw new Error ('invalid title')
    if(!isString(description)) throw new Error ('invalid description')
    if(!isNumber(courseFee)) throw new Error('invalid course price')


    const newCourse = await courseCollection.create({
        fee : courseFee,
        tutor : tutorReq.tutor._id,
        title,
        description,
        isTutorMade : true,
        isAvailable : false,
        isApproved : false
    })

    res.json({newCourse})
})
