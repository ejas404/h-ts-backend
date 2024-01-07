import asyncHandler from "express-async-handler"
import studentCollection from "../../models/student_model.ts";
import bcrypt from 'bcrypt'
import * as fs from 'fs'
import { JWTStudentReq, StudentType } from "types/student_type.ts";


// request type has been assigned to any need to find the soulution to clear that


export const  getProfile = asyncHandler(async (req : any,res)=>{
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

export const  updateProfile = asyncHandler(async (req : JWTStudentReq | any,res)=>{
    const {name , email, contact} = req.body
    
    const userData = await studentCollection.findOneAndUpdate({email : req.user.email} ,{$set : {name,email,contact}})
    res.status(200).json({success : true, message : 'profile updated successfully'})
})

export const  resetPassword = asyncHandler(async (req : JWTStudentReq | any ,res)=>{
    const {currentPassword , newPassword} = req.body
    
    const userData = await studentCollection.findOne({email : req.user.email})

    if(userData && (await bcrypt.compare(currentPassword,userData.password))){
        userData.password = newPassword
        await userData.save()
        res.status(200).json({success : true, message : 'password updated successfully'})
    }else{
        throw new Error('password does not matches')
    }
   
})


export const updatePic = asyncHandler(async(req : any,res)=>{
    const {email} = req.user
    let student = await studentCollection.findOne({email}) as StudentType

    if(!req.file.path){
        throw  new Error('multer error')
    }

    if(student.profile){
        fs.unlink(student.profile,(err)=>{
            if(err) throw new Error('profile image is not deleted');

            console.log('file removed successfully')
        })
    }
    
    student.profile = req.file.path
    student.save()

    res.json({ msg : 'profile image upadted successfully', path : req.file.path})
})


export const getProfileImage = asyncHandler((req : JWTStudentReq | any,res)=>{
    if(req.user.profile){
       return res.sendFile(req.user.profile)
    }

    res.sendStatus(404)
})

