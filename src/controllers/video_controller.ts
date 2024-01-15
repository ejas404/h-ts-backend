import asyncHandler from 'express-async-handler'
import { uploadS3File } from '../utility/s3_uploader.ts';
import { isString } from '../type_check/string.ts';
import sectionCollection from '../models/section_model.ts';


export const addVideo = asyncHandler( async (req : any,res)=>{
    const file = req.files[0];

  

   const s3Response = await uploadS3File(file)

   console.log('s3 response new upload printed')
   console.log(s3Response)
})


export const addSection = asyncHandler(async(req : any, res)=>{
    const {course , title , description} = req.body

    if(!isString(course)) throw new Error('invalid course value');
    if(!isString(title)) throw new Error('invalid title value');
    if(!isString(description)) throw new Error('invalid description value');

    const newSection = await sectionCollection.create({title, course,description})

    if(!newSection) throw new Error('invalid section details')

    res.json({msg : 'section added success fully'})

})

