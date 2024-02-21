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
import enrollCollection from "../../models/course_enroll_model";
import mongoose from "mongoose";
import { isCourseEnrolledHelper } from "../../utility/enroll_check_helper";
import { isNumber } from "../../type_check/number";
import { isString } from "../../type_check/string";
import orderCollection from "../../models/order_model";
export const getEnrollList = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const user_id = new mongoose.Types.ObjectId(user._id);
    const order = yield orderCollection.find({ user: user_id });
    const enidList = order.map(each => each.enid);
    const list = yield enrollCollection.find({ enid: { $in: enidList }, isEnrolled: true }).populate('course', 'title subCategory cover').exec();
    res.json({ list });
}));
export const enrollStatus = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enid = req.params.id;
    const check = yield enrollCollection.findOne({ enid });
    if (!check)
        throw new Error('invalid enroll id');
    res.json({ success: check.isEnrolled });
}));
export const isCourseEnrolled = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = req.params.id;
    const user = req.user._id;
    const check = yield isCourseEnrolledHelper(course, user);
    res.json({ success: !!check });
}));
export const addProgress = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { video_id, course_id } = req.body;
    const course = new mongoose.Types.ObjectId(course_id);
    const user = new mongoose.Types.ObjectId(req.user._id);
    const check = yield enrollCollection.findOne({ user, course, isEnrolled: true });
    if (!check)
        throw new Error('no enrollment found');
    const proress = check.progress.slice();
    for (let each of proress) {
        if (each.equals(video_id))
            break;
    }
    check.progress.push(video_id);
    yield check.save();
    res.json({ success: true });
}));
export const getProgress = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const course = new mongoose.Types.ObjectId(id);
    const user = new mongoose.Types.ObjectId(req.user._id);
    const order = yield orderCollection.find({ user });
    const enidList = order.map(each => each.enid);
    const check = yield enrollCollection.findOne({ enid: { $in: enidList }, course, isEnrolled: true });
    if (check) {
        res.json({ progress: check.progress });
    }
}));
export const rateCourse = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { val, enid } = req.body;
    if (!isNumber(val))
        throw new Error('value should be number');
    if (!isString(enid))
        throw new Error('invalid enid');
    const checkEnroll = yield enrollCollection.findOne({ enid, isEnrolled: true });
    if (!checkEnroll)
        throw new Error('no enrollment found');
    checkEnroll.rating = val;
    yield checkEnroll.save();
    res.json({ msg: 'course rated successfully' });
}));
