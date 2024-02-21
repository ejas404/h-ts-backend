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
import mongoose from "mongoose";
import enrollCollection from "../../models/course_enroll_model";
import studentCollection from "../../models/student_model";
import chatsCollection from "../../models/chat_model";
import orderCollection from "../../models/order_model";
export const getTutorConnections = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutor_id = new mongoose.Types.ObjectId(req.tutor._id);
    const courseDetails = yield courseCollection.find({ tutor: tutor_id }, { _id: 1 });
    const courseList = courseDetails.map(each => each._id);
    const getEnrolls = yield enrollCollection.find({ course: { $in: courseList } });
    const enidList = getEnrolls.map(each => each.enid);
    const userList = yield orderCollection.find({ enid: { $in: enidList } }).distinct('user');
    const connList = yield studentCollection.find({ _id: { $in: userList } }, { name: 1, profile: 1 });
    res.json({ connections: connList });
}));
export const getMessages = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new mongoose.Types.ObjectId(req.tutor._id);
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
