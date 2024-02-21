var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import courseCollection from "../models/course_model";
import asyncHandler from "express-async-handler";
import upcomingCourseCollection from "../models/upcoming_course_model";
import enrollCollection from "../models/course_enroll_model";
import mongoose from "mongoose";
export const getCourses = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield courseCollection.find({
        isAvailable: true,
        isDeleted: false,
        isApproved: { $ne: false }
    }).populate('subCategory', 'name');
    res.json({ courses });
}));
export const getSingleCourse = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const courseDetails = yield courseCollection.findById(id)
        .populate('tutor', 'name')
        .populate('category', 'name');
    if (!courseDetails)
        throw new Error('no course matches the id');
    res.json({ courseDetails });
}));
export const upcomingCourses = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const upcomingCourses = yield upcomingCourseCollection.find({});
    res.json({ upcomingCourses });
}));
export const getRating = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const course = new mongoose.Types.ObjectId(id);
    const enrollList = yield enrollCollection.find({ course, isEnrolled: true });
    const count = enrollList.length;
    const rated = enrollList.filter(each => each.rating && each.rating > 0).length;
    const rateValue = enrollList.reduce((acc, each) => each.rating ? acc + each.rating : 0, 0);
    const rating = rateValue / rated;
    res.json({ count, rating });
}));
