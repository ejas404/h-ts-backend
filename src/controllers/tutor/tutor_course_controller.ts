import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import courseCollection from "../../models/course_model.js"
import { isNumber } from "../../type_check/number.js"
import { isString } from "../../type_check/string.js"
import { JWTTutorReq } from "../../types/express_req_res.js"
import mongoose from "mongoose"


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
        isApproved : false,
        request : 'Pending'
    })

    res.json({newCourse})
})

export const updateCourse = asyncHandler(async (req: any, res: Response) => {

    const { id } = req.params
    const { title, fee, description } = req.body

    const _id  = new mongoose.Types.ObjectId(id)
    const tutor = new mongoose.Types.ObjectId(req.tutor._id)

    const course = await courseCollection.findOne({_id,tutor})
    if (!course) throw new Error('no course found with the given id');

    let courseFee = Number(fee);

    if (!isString(title)) throw new Error('invalid title');
    if (!isString(description)) throw new Error('invalid description');
    if (!isNumber(courseFee)) throw new Error('invalid course price');

    course.title = title
    course.fee = courseFee
    course.description = description
    await course.save()

    const updatedCourse = await courseCollection.findById(id).populate('tutor', 'name')

    res.json({ updatedCourse })
})


