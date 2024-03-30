
import courseCollection from "../models/course_model.js";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler"
import upcomingCourseCollection from "../models/upcoming_course_model.js";
import enrollCollection from "../models/course_enroll_model.js";
import mongoose from "mongoose";
import { enrollmentType } from "../types/course_enroll_type.js";


export const getCourses = asyncHandler(async (req: Request, res: Response) => {

    const page = Number(req.query);
    const courses = await courseCollection.find({
        isAvailable: true,
        isDeleted: false,
        isApproved: { $ne: false }
    }).populate('subCategory', 'name').skip((page -1) * 3).limit(3);

    const count = await courseCollection.countDocuments({
        isAvailable: true,
        isDeleted: false,
        isApproved: { $ne: false }
    })
    res.json({ courses , count})
})


export const getSingleCourse = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const courseDetails = await courseCollection.findById(id)
        .populate('tutor', 'name')
        .populate('category', 'name')

    if (!courseDetails) throw new Error('no course matches the id')
    res.json({ courseDetails })
})

export const upcomingCourses = asyncHandler(async (req, res) => {
    const upcomingCourses = await upcomingCourseCollection.find({})
    res.json({ upcomingCourses })
})

export const getRating = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = new mongoose.Types.ObjectId(id)
    const enrollList: enrollmentType[] = await enrollCollection.find({ course, isEnrolled: true })
    const count = enrollList.length;
    const rated = enrollList.filter(each => each.rating && each.rating > 0).length
    const rateValue = enrollList.reduce((acc, each) => each.rating ? acc+each.rating : 0, 0)
    const rating = rateValue/rated
    res.json({count,rating})
})





