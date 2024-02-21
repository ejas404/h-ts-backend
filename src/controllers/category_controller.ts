import { Request, Response } from "express";
import asyncHandler from "express-async-handler"
import { isString } from "../type_check/string";
import courseCategoryCollection from "../models/course_category";
import subCategoryCollection from "../models/course_sub_category";

export const getCategories = asyncHandler(async (req : Request , res : Response)=>{
    const categories = await courseCategoryCollection.find({})
    if(!categories) throw new Error ('no categories available');

    res.json({categories})
})

export const getSubCategories = asyncHandler(async (req : Request , res : Response)=>{
    const subCat = await subCategoryCollection.find({})
    if(!subCat) throw new Error ('no categories available');

    res.json({subCategories :subCat})
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

export const addSubCategory = asyncHandler (async (req : Request, res : Response)=>{
    const {title, description , category} = req.body

    const isCourseExist = await courseCategoryCollection.findById(category)
    if(!isCourseExist)throw new Error ('no course existing with provided id')
    
    if(isString(!title)) throw new Error ('invalid category title')
    const lowerTitle = title.toLowerCase()

    const newSubCategory = await subCategoryCollection.create({name : lowerTitle , description, category})
    
    res.json({newSubCategory})
})
