import asyncHandler from "express-async-handler"
import tutorCollection from "../../models/tutor_model.ts";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs'
import { TutorEducationDetails, TutorType } from "types/tutor_type.ts";




export const getProfile = asyncHandler(async (req : any, res) => {
    const userData = await tutorCollection.findOne({ email: req.tutor.email }, { password: 0 })
    res.status(200).json(userData)
})

export const updateProfile = asyncHandler(async (req : any, res) => {
    const { name, email, contact } = req.body

    const userData = await tutorCollection.findOneAndUpdate(
        {
            email: req.tutor.email
        },
        {
            $set: { name, email, contact }
        })

    
        res.status(200).json({success: true, message: 'profile updated successfully'}
    )
})

export const resetPassword = asyncHandler(async (req : any, res) => {
    const { currentPassword, newPassword } = req.body

    const userData = await tutorCollection.findOne({ email: req.tutor.email })


    if (userData && (await bcrypt.compare(currentPassword, userData.password))) {
        userData.password = newPassword
        await userData.save()
        res.status(200).json({ success: true, message: 'password updated successfully' })
    } else {
        throw new Error('password does not matches')
    }

})

export const updateEducation = asyncHandler(async (req : any, res) => {

    const { university, stream, year, country } = req.body

    const educationDetails :TutorEducationDetails  = {
        ed_id: uuidv4(),
        university,
        stream,
        country,
        year: Number(year)
    }

    const tutorData = await tutorCollection.findOne({ email: req.tutor.email }) as TutorType

    if (tutorData.education) {
        tutorData.education.push(educationDetails)
    } else {
        tutorData.education = [educationDetails]
    }
    await tutorData.save()

    res.json({ educationDetails })
})



export const updatePic = asyncHandler(async (req : any, res) => {

    const { email } = req.tutor
    let tutor = await tutorCollection.findOne({ email }) as TutorType

    if(!req.file.path){
        throw  new Error('multer error')
    }

    if (tutor.profile) {
        fs.unlink(tutor.profile, (err) => {
            if (err) throw new Error('profile image is not deleted');
        })
    }

    tutor.profile = req.file.path

    tutor.save()

    res.json({ msg: 'profile image upadted successfully',path : req.file.path})
})


export const updateTags = asyncHandler(async (req : any,res)=>{

    const { email } = req.tutor
    const {tag , list}: { tag :string, list: string} = req.body

    if(!tag || !list) throw new Error('Invalid request') ; 

    const tagList : string [] = JSON.parse(list)

    if(Array.isArray(tagList)){ 
        let tutor = await tutorCollection.findOne({ email }) as TutorType

        if(tag in tutor){
            tutor[tag] = tagList 

        }else{
            throw new Error(`provided tag key is wrong ${tag}`)
        } 
        
        await tutor.save()
        
        res.json({msg : 'successfully updated', tutorTag : {tag , list :  tagList}})
    }else{
        throw new Error('Invalid request')
    }
})


export const deleteEducation = asyncHandler(async (req : any,res)=>{
    const { email } = req.tutor
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
