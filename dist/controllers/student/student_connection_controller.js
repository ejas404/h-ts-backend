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
import tutorCollection from "../../models/tutor_model";
import chatsCollection from "../../models/chat_model";
import orderCollection from "../../models/order_model";
export const connectedTutors = asyncHandler((request, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req = request;
    const user = new mongoose.Types.ObjectId(req.user._id);
    const order = yield orderCollection.find({ user });
    const enidList = order.map(each => each.enid);
    const enrolledList = yield enrollCollection.find({ enid: { $in: enidList }, isEnrolled: true }).populate('course', 'tutor');
    const tutorList = enrolledList.map((each) => each.course.tutor);
    const getTutorDatas = yield tutorCollection.find({ _id: { $in: tutorList } }, { name: 1, profile: 1 });
    res.json({ connections: getTutorDatas });
}));
export const getMessages = asyncHandler((request, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req = request;
    const user = new mongoose.Types.ObjectId(req.user._id);
    const reciever = new mongoose.Types.ObjectId(req.params.id);
    const getMessages = yield chatsCollection
        .find({
        $or: [
            { sender: user, reciever: reciever },
            { sender: reciever, reciever: user }
        ]
    });
    res.json(getMessages);
}));
