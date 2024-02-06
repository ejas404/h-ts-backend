import asyncHandler from "express-async-handler"
import enrollCollection from "../../models/course_enroll_model"
import mongoose from "mongoose"
import { isCourseEnrolledHelper } from "../../utility/enroll_check_helper"

export const getEnrollList = asyncHandler( async (req : any,res)=>{
    const user = req.user
    const user_id = new mongoose.Types.ObjectId(user._id)
    const list = await enrollCollection.find({user : user_id}).populate('course','title subCategory cover').exec()
    res.json({list})
})


export const enrollStatus = asyncHandler(async(req,res)=>{
    const enid = req.params.id
    const check = await enrollCollection.findOne({enid})
    if(!check) throw new Error('invalid enroll id')

    res.json({ success : check.isEnrolled })
})

export const isCourseEnrolled = asyncHandler(async(req : any,res)=>{
    const course  =  req.params.id
    const user = req.user._id

    const check = await isCourseEnrolledHelper(course,user)
    if(!check) throw new Error('no enrollment found');

    res.json({ success : check })
})

export const addProgress = asyncHandler(async(req : any,res)=>{
    const {video_id, course_id} = req.body
    const course  =  new mongoose.Types.ObjectId(course_id)
    const user = new mongoose.Types.ObjectId(req.user._id)
    
    const check = await enrollCollection.findOne({user,course, isEnrolled : true })
    if(!check) throw new Error('no enrollment found')

    const proress = check.progress.slice()
    for(let each of proress){
        if(each.equals(video_id)) break;
    }

    check.progress.push(video_id)
    await check.save()

    res.json({ success : true })
})