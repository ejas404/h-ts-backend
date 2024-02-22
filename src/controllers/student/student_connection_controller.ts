import mongoose from "mongoose"
import asyncHandler from "express-async-handler"
import { Request, Response } from "express";
import enrollCollection from "../../models/course_enroll_model.js"
import tutorCollection from "../../models/tutor_model.js"
import chatsCollection from "../../models/chat_model.js"
import { JWTStudentReq } from "../../types/express_req_res.js"
import orderCollection from "../../models/order_model.js";

export const connectedTutors = asyncHandler(async (request: Request, res : Response) => {
    
    const req = request as JWTStudentReq
    const user = new mongoose.Types.ObjectId(req.user._id)
    const order = await orderCollection.find({user})
    const enidList = order.map(each => each.enid)
    const enrolledList: any = await enrollCollection.find({ enid : {$in : enidList}, isEnrolled: true }).populate('course', 'tutor');
    const tutorList = enrolledList.map((each: { course: { tutor: any } }) => each.course.tutor)
    const getTutorDatas = await tutorCollection.find({ _id: { $in: tutorList } }, { name: 1, profile: 1 })

    res.json({ connections: getTutorDatas })
})


export const getMessages = asyncHandler(async (request: Request, res) => {
    const req = request as JWTStudentReq
    const user = new mongoose.Types.ObjectId(req.user._id)
    const reciever = new mongoose.Types.ObjectId(req.params.id)

    const getMessages = await chatsCollection
        .find(
            {
                $or:
                    [
                        { sender: user, receiver: reciever },
                        { sender: reciever, receiver: user }
                    ]
            })
    res.json(getMessages)
})