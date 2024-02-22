import { NextFunction } from "express"
import { JWTStudentReq, JWTTutorReq } from "../types/express_req_res.js"
import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import tutorCollection from "../models/tutor_model.js"
import studentCollection from "../models/student_model.js"

export const imageChatValidator = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    const req = request as unknown as JWTStudentReq | JWTTutorReq
    const { receiver } = JSON.parse(req.body.chat)

    if (!req.file) throw new Error('multer error no request file');
    if (!req.file.path) throw new Error('multer error') ;

    let isExist;
    let sender;
    if ((req as JWTStudentReq).user) {
        sender = (req as JWTStudentReq).user._id
        isExist = await tutorCollection.findById(receiver)
    }

    if ((req as JWTTutorReq).tutor) {
        sender = (req as JWTTutorReq).tutor._id
        isExist = await studentCollection.findById(receiver)
    }

    if(!isExist) throw new Error('invalid receiver id')

    request.body.sender = sender

    next()
})