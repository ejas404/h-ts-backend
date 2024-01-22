
import courseCollection from "../models/course_model.ts";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler"
import { isString } from "../type_check/string.ts";
import courseCategoryCollection from "../models/course_category.ts";


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

export const getCategories = asyncHandler(async (req : Request , res : Response)=>{
    const categories = await courseCategoryCollection.find({})
    if(!categories) throw new Error ('no categories available');

    res.json({categories})
})

export const addCategory = asyncHandler (async (req : Request, res : Response)=>{
    const {title, description} = req.body
    
    if(isString(!title)) throw new Error ('invalid category title')
    const lowerTitle = title.toLowerCase()

    const isExist = await courseCategoryCollection.findOne({name :lowerTitle})
    if(isExist) throw new Error ('course name already exists')

    const newCategory = await courseCategoryCollection.create({name : lowerTitle , description})
    
    res.json({newCategory})
})

