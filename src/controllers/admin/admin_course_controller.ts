import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import * as fs from 'fs'
import courseCollection from "../../models/course_model.js"
import tutorCollection from "../../models/tutor_model.js"
import { CourseResponseType } from "../../types/course_type.js"
import { isString } from "../../type_check/string.js"
import { isNumber } from "../../type_check/number.js"
import courseCategoryCollection from "../../models/course_category.js"
import subCategoryCollection from "../../models/course_sub_category.js"
import upcomingCourseCollection from "../../models/upcoming_course_model.js"
import { isCourseExist } from "../../utility/course_check.js"



export const addCourse = asyncHandler(async (req: any, res: Response) => {

    const file = req.file
    const { title, fee, tutor, description, category, subCategory } = JSON.parse(req.body.details)

    if (!file) throw new Error('Req file is undefined');
    if (!file.path) throw new Error('multer error');
    
    const courseFee = Number(fee)
    const isTutor = await tutorCollection.findById(tutor)
    if (!isTutor) throw new Error('invalid tutor id')

    const isCategory = await courseCategoryCollection.findById(category)
    if (!isCategory) throw new Error('invalid category id')

    const isSubCat = await subCategoryCollection.findById(subCategory)
    if (!isSubCat) throw new Error('invalid sub category id')

    if (!isString(title)) throw new Error('invalid title')
    if (!isString(description)) throw new Error('invalid description')
    if (!isNumber(courseFee)) throw new Error('invalid course price')

    const lowerTitle = title.toLowerCase()

    const newCourseObj = {
        title: lowerTitle,
        fee: courseFee,
        description,
        tutor,
        category,
        subCategory,
        cover: file.path
    }

    const isExists = await isCourseExist(newCourseObj)
    if (isExists) throw new Error('course already exist with these details')
    const addedCourse = await courseCollection.create(newCourseObj)

    const newCourse = await courseCollection.findById(addedCourse._id).populate('tutor')
    res.json({ newCourse })
})


export const addUpcoming = asyncHandler(async (req, res) => {

    console.log('add upcoming called')

    const file = req.file
    const { title, tutor, category, subCategory } = JSON.parse(req.body.details)
    if (!file) throw new Error('Req file is undefined')

    if (!file.path) {
        throw new Error('multer error')
    }

    const isTutor = await tutorCollection.findById(tutor)
    if (!isTutor) throw new Error('invalid tutor id')

    const isCategory = await courseCategoryCollection.findById(category)
    if (!isCategory) throw new Error('invalid category id')

    const isSubCat = await subCategoryCollection.findById(subCategory)
    if (!isSubCat) throw new Error('invalid sub category id')

    if (!isString(title)) throw new Error('invalid title')
    const lowerTitle = title.toLowerCase()

    const newCourseObj: Partial<CourseResponseType> = {
        title: lowerTitle,
        tutor,
        category,
        subCategory,
        cover: file.path
    }
    const isExists = await isCourseExist(newCourseObj)
    if (isExists) throw new Error('course already exist with these details')
    const newUpcoming = await upcomingCourseCollection.create(newCourseObj)

    res.json({ newUpcoming })

})



export const getCourses = asyncHandler(async (req: Request, res: Response) => {
    const courseDetails = await courseCollection.find({ isDeleted: false }).populate('tutor', 'name')
    const tutorIds = await courseCollection.distinct('tutor')

    const tutorCourses = await tutorCollection.find({ _id: { $in: tutorIds } }, { name: 1 })

    res.json({ courseDetails, tutorCourses })
})


// have to correct the req : any-----------------
export const updateCourseCover = asyncHandler(async (req: Request, res) => {

    const id = req.params.id
    if (typeof (id) !== 'string') return;

    const course = await courseCollection.findById(id) as CourseResponseType
    if (!course) throw new Error('No course with provided id')
    if (!req.file) throw new Error('Req file is undefined')

    if (!req.file.path) {
        throw new Error('multer error')
    }

    if (course.cover) {
        fs.unlink(course.cover, (err) => {
            if (err) throw new Error('course image is not deleted');
        })
    }

    course.cover = req.file.path
    course.save()

    res.json({ msg: 'profile image upadted successfully', path: req.file.path })

})

// single course view page controller

export const getSingleCourse = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params

    const courseDetails = await courseCollection.findById(id).populate('tutor', 'name')
    if (!courseDetails) throw new Error('no course matches the id')

    res.json({ courseDetails })
})

// course updation controller

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params
    const { title, fee, tutor, description } = req.body

    const course = await courseCollection.findById(id)
    if (!course) throw new Error('invalid course id');

    let courseFee = Number(fee)

    if (!isString(title)) throw new Error('invalid title')
    if (!isString(description)) throw new Error('invalid description')
    if (!isString(tutor)) throw new Error('invalid tutor id')
    if (!isNumber(courseFee)) throw new Error('invalid course price')

    course.title = title
    course.fee = courseFee
    course.description = description
    course.tutor = tutor
    await course.save()

    const updatedCourse = await courseCollection.findById(id).populate('tutor', 'name')

    res.json({ updatedCourse })
})


// admin side course approval controller

export const courseApprove = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params
    const course = await courseCollection.findById(id) as CourseResponseType
    if (!course) throw new Error('No course with provided id')
    course.isApproved = true
    course.request = 'Approved'
    await course.save()

    const updatedCourse = await courseCollection.findById(id).populate('tutor', 'name')

    res.json({ courseDetails: updatedCourse })
})

