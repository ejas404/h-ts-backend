import asyncHandler from 'express-async-handler'
import { uploadS3File } from '../utility/s3_uploader';
import { isString } from '../type_check/string';
import sectionCollection from '../models/section_model';
import mongoose from 'mongoose';
import { S3Response } from '../types/video_type';
import videoCollection from '../models/video_model';
import { isBoolean, isNumber } from '../type_check/number';


export const addVideo = asyncHandler(async (req: any, res) => {

    const file = req.files[0];
    let { title, section, description, isPaid} = JSON.parse(req.body.details)
    const { duration } = req.body

    const durationInNum = Number(duration)

    if (!isString(section)) throw new Error('invalid section value');
    if (!isString(title)) throw new Error('invalid title value');
    if (!isString(description)) throw new Error('invalid description value');
    if (!isNumber(durationInNum)) throw new Error('duration should be an integer');
    if (!isBoolean(isPaid)) isPaid = false;

    const s3Response = await uploadS3File(file) as S3Response

    const url = s3Response.Location

    const videoUpload = await videoCollection.create({
        title,
        section,
        description,
        url,
        isPaid,
        duration: Math.floor(durationInNum)
    })

    if (!videoUpload) throw new Error('failed to uplaod video');

    res.status(201).json({ msg: 'video added success fully' })

})


export const addSection = asyncHandler(async (req: any, res) => {
    const { course, title, description } = req.body

    if (!isString(course)) throw new Error('invalid course value');
    if (!isString(title)) throw new Error('invalid title value');
    if (!isString(description)) throw new Error('invalid description value');

    const isSectionAlready = await sectionCollection.findOne({ course, title: { $regex: title, $options: "i" } })
    if (isSectionAlready) throw new Error('section title already exists');

    const newSection = await sectionCollection.create({ title, course, description })
    if (!newSection) throw new Error('invalid section details')

    res.json({ msg: 'section added successfully' ,newSection})

})

export const getSections = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) throw new Error('invalid course id')

    const course_id = new mongoose.Types.ObjectId(id)

    const sections = await sectionCollection.find({ course: course_id })
    if (!sections) throw new Error('there is no sections for provided course')

    res.json({ sectionLists: sections })
})


export const getCourseVidoes = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) throw new Error('invalid course id')

    const course_id = new mongoose.Types.ObjectId(id)

    const courseVideoList = await sectionCollection.aggregate([
        {
            $match: {
                course: course_id
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: '_id',
                foreignField: 'section',
                pipeline: [{ $project: { url: 0 } }],
                as: 'courseVideos'
            }
        }
    ])

    if (!courseVideoList) throw new Error('could not find the course video list with the provided course id');

    res.json({ courseVideoList })


})

export const getVideo = asyncHandler(async (req,res)=>{
    const {id} = req.params

    const video = await videoCollection.findById(id)

    if(!video) throw new Error ('no video with provided id')
    if(video.isDeleted) throw new Error('vido is not available now')

    res.json({video})
})

