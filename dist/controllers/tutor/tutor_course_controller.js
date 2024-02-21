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
import { isNumber } from "../../type_check/number";
import { isString } from "../../type_check/string";
import mongoose from "mongoose";
export const getCourses = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const tutorCourses = yield courseCollection.find({ tutor: tutorReq.tutor._id });
    res.json({ tutorCourses });
}));
export const requestCourse = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const { title, description, fee } = req.body;
    const courseFee = Number(fee);
    if (!isString(title))
        throw new Error('invalid title');
    if (!isString(description))
        throw new Error('invalid description');
    if (!isNumber(courseFee))
        throw new Error('invalid course price');
    const newCourse = yield courseCollection.create({
        fee: courseFee,
        tutor: tutorReq.tutor._id,
        title,
        description,
        isTutorMade: true,
        isAvailable: false,
        isApproved: false,
        request: 'Pending'
    });
    res.json({ newCourse });
}));
export const updateCourse = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, fee, description } = req.body;
    const _id = new mongoose.Types.ObjectId(id);
    const tutor = new mongoose.Types.ObjectId(req.tutor._id);
    const course = yield courseCollection.findOne({ _id, tutor });
    if (!course)
        throw new Error('no course found with the given id');
    let courseFee = Number(fee);
    if (!isString(title))
        throw new Error('invalid title');
    if (!isString(description))
        throw new Error('invalid description');
    if (!isNumber(courseFee))
        throw new Error('invalid course price');
    course.title = title;
    course.fee = courseFee;
    course.description = description;
    yield course.save();
    const updatedCourse = yield courseCollection.findById(id).populate('tutor', 'name');
    res.json({ updatedCourse });
}));
