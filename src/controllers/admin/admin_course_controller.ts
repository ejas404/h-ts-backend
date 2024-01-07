import asyncHandler from "express-async-handler"
import courseCollection from "../../models/course_model.ts"
import tutorCollection from "../../models/tutor_model.ts"
import * as fs from 'fs'
import { RequestWithFile} from "types/express_req_res.ts"
import { CourseResponseType } from "types/course_type.ts"
import { isString } from "type_check/string.ts"
import { isNumber } from "type_check/number.ts"

export const addCourse = asyncHandler(async(req,res)=>{

    const {title , fee , tutor , description } = req.body

    let courseFee = Number(fee)
    let courseTitle = title
    let courseDesc = description
    let tutorId = tutor

    const newCourse = await courseCollection.create({
        title : courseTitle,
        fee : courseFee,
        description : courseDesc,
        tutor : tutorId
    })

    res.json({newCourse})
})



export const getCourses = asyncHandler(async(req,res)=>{
    const courseDetails = await courseCollection.find({isDeleted : false}).populate('tutor', 'name')
    const tutorIds = await courseCollection.distinct('tutor')
    
    const tutorCourses = await tutorCollection.find({_id : {$in : tutorIds}}, {name : 1})
    
    res.json({courseDetails, tutorCourses})
})

// have to correct the req : any-----------------
export const updateCourseCover = asyncHandler ( async(req : any,res) =>{
    const id = req.params.id 
    if(typeof(id) !== 'string') return;
    const course = await courseCollection.findById(id) as CourseResponseType

    if(!course) throw new Error('No course with provided id')

    if(!req.file.path){
        throw  new Error('multer error')
    }

    if(course.cover){
        fs.unlink(course.cover,(err)=>{
            if(err) throw new Error('profile image is not deleted');
        })
    }
    
    course.cover = req.file.path
    course.save()

    res.json({ msg : 'profile image upadted successfully', path : req.file.path})

})

// single course view page controller

export const getSingleCourse = asyncHandler(async(req,res)=>{
    console.log('inside get single course')
    const {id} = req.params
    
    const courseDetails = await courseCollection.findById(id).populate('tutor','name')

    if(!courseDetails) throw new Error('no course matches the id')

    res.json({courseDetails})
})

// course updation controller

export const updateCourse = asyncHandler(async(req,res)=>{

    console.log('from update course')
    const {id} = req.params
    const {title , fee , tutor , description } = req.body

    const course = await courseCollection.findById(id)

    if(!course) throw new Error('invalid course id');

    let courseFee = Number(fee)

    if(!isString(title)) throw new Error ('invalid title')
    if(!isString(description)) throw new Error ('invalid description')
    if(!isString(tutor)) throw new Error ('invalid tutor id')
    if(!isNumber(courseFee)) throw new Error('invalid course price')
    

    course.title = title
    course.fee = courseFee
    course.description = description
    course.tutor = tutor

    await course.save()

    const updatedCourse = await courseCollection.findById(id).populate('tutor', 'name')
    

    res.json({updatedCourse})
})


// admin side course approval controller

export const courseApprove = asyncHandler(async(req,res)=>{


    const {id} = req.params
    
    const course = await courseCollection.findById(id) as CourseResponseType

    if(!course) throw new Error('No course with provided id')

    course.isApproved = true 
    course.request = 'Approved'

    await course.save()  

    const updatedCourse = await courseCollection.findById(id).populate('tutor', 'name')   

    res.json({ courseDetails : updatedCourse})
})

