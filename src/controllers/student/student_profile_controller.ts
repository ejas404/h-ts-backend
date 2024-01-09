import asyncHandler from "express-async-handler"
import { Response , Request } from "express";
import studentCollection from "../../models/student_model.ts";
import bcrypt from 'bcrypt'
import * as fs from 'fs'
import {StudentType } from "types/student_type.ts";
import { JWTStudentReq } from "types/express_req_res.ts";
import { threadId } from "worker_threads";



// request type has been assigned to any need to find the soulution to clear that


export const  getProfile = asyncHandler(async (req : any,res : Response)=>{
    const userData = await studentCollection.findOne(
        {
            email : req.user.email
        } ,
        {
            password : 0,
            twofactor : 0
        }) 

    res.status(200).json(userData)
})

export const  updateProfile = asyncHandler(async (req :Request,res : Response)=>{

    const studentReq = req as JWTStudentReq
    const {name , email, contact} = req.body
    
    const userData = await studentCollection.findOneAndUpdate({email : studentReq.user.email} ,{$set : {name,email,contact}})
    res.status(200).json({success : true, message : 'profile updated successfully'})
})

export const  resetPassword = asyncHandler(async (req : Request ,res : Response)=>{

    const studentReq = req as JWTStudentReq
    const {currentPassword , newPassword} = req.body
    
    const userData = await studentCollection.findOne({email : studentReq.user.email})

    if(userData && (await bcrypt.compare(currentPassword,userData.password))){
        userData.password = newPassword
        await userData.save()
        res.status(200).json({success : true, message : 'password updated successfully'})
    }else{
        throw new Error('password does not matches')
    }
   
})


export const updatePic = asyncHandler(async(req : Request,res : Response)=>{

    
    const studentReq = req as JWTStudentReq

    const {email} = studentReq.user
    let student = await studentCollection.findOne({email}) as StudentType

    if(!studentReq.file)throw new Error('multer error need request file')

    if(!studentReq.file.path){
        throw  new Error('multer error')
    }

    if(student.profile){
        fs.unlink(student.profile,(err)=>{
            if(err) throw new Error('profile image is not deleted');

            console.log('file removed successfully')
        })
    }
    
    student.profile = studentReq.file.path
    student.save()

    res.json({ msg : 'profile image upadted successfully', path : studentReq.file.path})
})


export const getProfileImage = asyncHandler((req : Request,res : Response)=>{

    const studentReq = req as JWTStudentReq

    if(studentReq.user.profile){
       return res.sendFile(studentReq.user.profile)
    }

    res.sendStatus(404)
})

