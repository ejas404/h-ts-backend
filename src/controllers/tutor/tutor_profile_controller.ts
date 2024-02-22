import asyncHandler from "express-async-handler"
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import * as fs from 'fs'
import tutorCollection from "../../models/tutor_model.js";
import { TutorEducationDetails, TutorType } from "../../types/tutor_type.js";
import { Request, Response } from "express";
import { JWTTutorReq } from "../../types/express_req_res.js";
import { isString } from "../../type_check/string.js";




export const getProfile = asyncHandler(async (req : Request, res : Response) => {
  
    const tutorReq = req as JWTTutorReq

    const userData = await tutorCollection.findOne({ email: tutorReq.tutor.email }, { password: 0 })
    res.status(200).json(userData)
})

export const updateProfile = asyncHandler(async (req : Request, res : Response) => {

    const tutorReq = req as JWTTutorReq

    const { name } = req.body

    if(!isString(name)) throw new Error('invalid name');

    const userData = await tutorCollection.findOneAndUpdate(
        {
            email: tutorReq.tutor.email
        },
        {
            $set: { name }
        })

    
        res.status(200).json({success: true, message: 'profile updated successfully'}
    )
})

export const resetPassword = asyncHandler(async (req : Request, res : Response) => {

    const tutorReq = req as JWTTutorReq
    const { currentPassword, newPassword } = req.body
    const userData = await tutorCollection.findOne({ email: tutorReq.tutor.email })


    if (userData && (await bcrypt.compare(currentPassword, userData.password))) {
        userData.password = newPassword
        await userData.save()
        res.status(200).json({ success: true, message: 'password updated successfully' })
    } else {
        throw new Error('password does not matches')
    }

})

export const updateEducation = asyncHandler(async (req : Request, res : Response) => {

    const tutorReq = req as JWTTutorReq
    const { university, stream, year, country } = req.body

    const educationDetails :TutorEducationDetails  = {
        ed_id: uuidv4(),
        university,
        stream,
        country,
        year: Number(year)
    }

    const tutorData = await tutorCollection.findOne({ email: tutorReq.tutor.email }) as TutorType

    if (tutorData.education) {
        tutorData.education.push(educationDetails)
    } else {
        tutorData.education = [educationDetails]
    }
    await tutorData.save()

    res.json({ educationDetails })
})



export const updatePic = asyncHandler(async (req : Request, res : Response) => {

    const tutorReq = req as JWTTutorReq

    const { email } = tutorReq.tutor
    let tutor = await tutorCollection.findOne({ email }) as TutorType

    if(!tutorReq.file)throw new Error('multer error need request file');
    if(!tutorReq.file.path) throw  new Error('multer error');
    
    if (tutor.profile) {
        fs.unlink(tutor.profile, (err) => {
            if (err) throw new Error('profile image is not deleted');
        })
    }

    tutor.profile = tutorReq.file.path
    tutor.save()

    res.json({ msg: 'profile image upadted successfully',path : tutorReq.file.path})
})


export const updateTags = asyncHandler(async (req : Request,res : Response)=>{

    const tutorReq = req as JWTTutorReq
    const { email } = tutorReq.tutor
    const {tag , list}: { tag :string, list: string} = req.body

    if(!tag || !list) throw new Error('Invalid request') ; 
    const tagList : string [] = JSON.parse(list)

    if(Array.isArray(tagList)){ 
        let tutor = await tutorCollection.findOne({ email }) as TutorType

        if(tag in tutor) tutor[tag] = tagList ;
        else throw new Error(`provided tag key is wrong ${tag}`);    
        
        await tutor.save()
        
        res.json({msg : 'successfully updated', tutorTag : {tag , list :  tagList}})
    }else{
        throw new Error('Invalid request')
    }
})


export const deleteEducation = asyncHandler(async (req : Request,res: Response)=>{

    const tutorReq = req as JWTTutorReq

    const { email } = tutorReq.tutor
    const {id} = req.params

    if(!id) throw new Error('id is not found')
    let tutor = await tutorCollection.findOne({ email }) as TutorType

    const education = tutor.education as TutorEducationDetails[]

    if(!education) throw new Error('No education details have founded');

    let toDelete ; 
    tutor.education = education.filter((each)=> {
        if(each.ed_id === id){
            toDelete = each
        }else{
            return each
        }
    } )

    if(!toDelete) throw new Error('education data is not founded')

    await tutor.save()

    res.json({toDelete})

})
