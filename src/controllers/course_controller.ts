
import courseCollection from "../models/course_model.ts";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler"


export const getCourses = asyncHandler(async (req : Request, res : Response) => {
    const courses = await courseCollection.find({
        isAvailable: true,
        isDeleted: false,
        isApproved : {$ne : false}
    });

    res.json({ courses })
})


export const getSingleCourse = asyncHandler(async(req : Request, res : Response)=>{
    const {id} = req.params
    
    const courseDetails = await courseCollection.findById(id).populate('tutor','name')
    if(!courseDetails) throw new Error('no course matches the id')

    res.json({courseDetails})
})




