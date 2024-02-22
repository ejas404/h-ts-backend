var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from 'express-async-handler';
import { uploadS3File } from '../utility/s3_uploader.js';
import { isString } from '../type_check/string.js';
import sectionCollection from '../models/section_model.js';
import mongoose from 'mongoose';
import videoCollection from '../models/video_model.js';
import { isBoolean, isNumber } from '../type_check/number.js';
export const addVideo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.files[0];
    let { title, section, description, isPaid } = JSON.parse(req.body.details);
    const { duration } = req.body;
    const durationInNum = Number(duration);
    if (!isString(section))
        throw new Error('invalid section value');
    if (!isString(title))
        throw new Error('invalid title value');
    if (!isString(description))
        throw new Error('invalid description value');
    if (!isNumber(durationInNum))
        throw new Error('duration should be an integer');
    if (!isBoolean(isPaid))
        isPaid = false;
    const s3Response = yield uploadS3File(file);
    const url = s3Response.Location;
    const videoUpload = yield videoCollection.create({
        title,
        section,
        description,
        url,
        isPaid,
        duration: Math.floor(durationInNum)
    });
    if (!videoUpload)
        throw new Error('failed to uplaod video');
    res.status(201).json({ msg: 'video added success fully' });
}));
export const addSection = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course, title, description } = req.body;
    if (!isString(course))
        throw new Error('invalid course value');
    if (!isString(title))
        throw new Error('invalid title value');
    if (!isString(description))
        throw new Error('invalid description value');
    const isSectionAlready = yield sectionCollection.findOne({ course, title: { $regex: title, $options: "i" } });
    if (isSectionAlready)
        throw new Error('section title already exists');
    const newSection = yield sectionCollection.create({ title, course, description });
    if (!newSection)
        throw new Error('invalid section details');
    res.json({ msg: 'section added successfully', newSection });
}));
export const getSections = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('invalid course id');
    const course_id = new mongoose.Types.ObjectId(id);
    const sections = yield sectionCollection.find({ course: course_id });
    if (!sections)
        throw new Error('there is no sections for provided course');
    res.json({ sectionLists: sections });
}));
export const getCourseVidoes = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('invalid course id');
    const course_id = new mongoose.Types.ObjectId(id);
    const courseVideoList = yield sectionCollection.aggregate([
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
    ]);
    if (!courseVideoList)
        throw new Error('could not find the course video list with the provided course id');
    res.json({ courseVideoList });
}));
export const getVideo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const video = yield videoCollection.findById(id);
    if (!video)
        throw new Error('no video with provided id');
    if (video.isDeleted)
        throw new Error('vido is not available now');
    res.json({ video });
}));
