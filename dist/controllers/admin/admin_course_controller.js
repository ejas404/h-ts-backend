var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from "express-async-handler";
import courseCollection from "../../models/course_model";
import tutorCollection from "../../models/tutor_model";
import * as fs from 'fs';
import { isString } from "../../type_check/string";
import { isNumber } from "../../type_check/number";
import courseCategoryCollection from "../../models/course_category";
import subCategoryCollection from "../../models/course_sub_category";
import upcomingCourseCollection from "../../models/upcoming_course_model";
import { isCourseExist } from "../../utility/course_check";
export const addCourse = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { title, fee, tutor, description, category, subCategory } = JSON.parse(req.body.details);
    if (!file)
        throw new Error('Req file is undefined');
    if (!file.path)
        throw new Error('multer error');
    const courseFee = Number(fee);
    const isTutor = yield tutorCollection.findById(tutor);
    if (!isTutor)
        throw new Error('invalid tutor id');
    const isCategory = yield courseCategoryCollection.findById(category);
    if (!isCategory)
        throw new Error('invalid category id');
    const isSubCat = yield subCategoryCollection.findById(subCategory);
    if (!isSubCat)
        throw new Error('invalid sub category id');
    if (!isString(title))
        throw new Error('invalid title');
    if (!isString(description))
        throw new Error('invalid description');
    if (!isNumber(courseFee))
        throw new Error('invalid course price');
    const lowerTitle = title.toLowerCase();
    const newCourseObj = {
        title: lowerTitle,
        fee: courseFee,
        description,
        tutor,
        category,
        subCategory,
        cover: file.path
    };
    const isExists = yield isCourseExist(newCourseObj);
    if (isExists)
        throw new Error('course already exist with these details');
    const addedCourse = yield courseCollection.create(newCourseObj);
    const newCourse = yield courseCollection.findById(addedCourse._id).populate('tutor');
    res.json({ newCourse });
}));
export const addUpcoming = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('add upcoming called');
    const file = req.file;
    const { title, tutor, category, subCategory } = JSON.parse(req.body.details);
    if (!file)
        throw new Error('Req file is undefined');
    if (!file.path) {
        throw new Error('multer error');
    }
    const isTutor = yield tutorCollection.findById(tutor);
    if (!isTutor)
        throw new Error('invalid tutor id');
    const isCategory = yield courseCategoryCollection.findById(category);
    if (!isCategory)
        throw new Error('invalid category id');
    const isSubCat = yield subCategoryCollection.findById(subCategory);
    if (!isSubCat)
        throw new Error('invalid sub category id');
    if (!isString(title))
        throw new Error('invalid title');
    const lowerTitle = title.toLowerCase();
    const newCourseObj = {
        title: lowerTitle,
        tutor,
        category,
        subCategory,
        cover: file.path
    };
    const isExists = yield isCourseExist(newCourseObj);
    if (isExists)
        throw new Error('course already exist with these details');
    const newUpcoming = yield upcomingCourseCollection.create(newCourseObj);
    res.json({ newUpcoming });
}));
export const getCourses = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseDetails = yield courseCollection.find({ isDeleted: false }).populate('tutor', 'name');
    const tutorIds = yield courseCollection.distinct('tutor');
    const tutorCourses = yield tutorCollection.find({ _id: { $in: tutorIds } }, { name: 1 });
    res.json({ courseDetails, tutorCourses });
}));
// have to correct the req : any-----------------
export const updateCourseCover = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (typeof (id) !== 'string')
        return;
    const course = yield courseCollection.findById(id);
    if (!course)
        throw new Error('No course with provided id');
    if (!req.file)
        throw new Error('Req file is undefined');
    if (!req.file.path) {
        throw new Error('multer error');
    }
    if (course.cover) {
        fs.unlink(course.cover, (err) => {
            if (err)
                throw new Error('course image is not deleted');
        });
    }
    course.cover = req.file.path;
    course.save();
    res.json({ msg: 'profile image upadted successfully', path: req.file.path });
}));
// single course view page controller
export const getSingleCourse = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const courseDetails = yield courseCollection.findById(id).populate('tutor', 'name');
    if (!courseDetails)
        throw new Error('no course matches the id');
    res.json({ courseDetails });
}));
// course updation controller
export const updateCourse = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, fee, tutor, description } = req.body;
    const course = yield courseCollection.findById(id);
    if (!course)
        throw new Error('invalid course id');
    let courseFee = Number(fee);
    if (!isString(title))
        throw new Error('invalid title');
    if (!isString(description))
        throw new Error('invalid description');
    if (!isString(tutor))
        throw new Error('invalid tutor id');
    if (!isNumber(courseFee))
        throw new Error('invalid course price');
    course.title = title;
    course.fee = courseFee;
    course.description = description;
    course.tutor = tutor;
    yield course.save();
    const updatedCourse = yield courseCollection.findById(id).populate('tutor', 'name');
    res.json({ updatedCourse });
}));
// admin side course approval controller
export const courseApprove = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const course = yield courseCollection.findById(id);
    if (!course)
        throw new Error('No course with provided id');
    course.isApproved = true;
    course.request = 'Approved';
    yield course.save();
    const updatedCourse = yield courseCollection.findById(id).populate('tutor', 'name');
    res.json({ courseDetails: updatedCourse });
}));
