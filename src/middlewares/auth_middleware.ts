import asyncHandler from "express-async-handler"
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import AdminCollection from "../models/admin_model.ts"
import { JWTDecoded, JWTAdminHeadersRequest, JWTStudentHeadersRequest, JWTTutorHeadersRequest } from "../types/auth_type.ts";
import { NextFunction } from "express";
import { AdminReqData } from "../types/admin_type.ts";
import { Response , Request} from "express";
import studentCollection from "../models/student_model.ts";
import tutorCollection from "../models/tutor_model.ts";
import { StudentModelType } from "types/student_type.ts";
import { TutorModelType } from "types/tutor_type.ts";
import { JWTStudentReq, JWTTutorReq } from "types/express_req_res.ts";

export const isAuthenticated = asyncHandler(async (req : JWTAdminHeadersRequest, res : Response, next : NextFunction) => {
    let token;
    token = req.headers.authorization;
    if (token) {
        try {
            const decoded : JWTDecoded | string | JwtPayload  = jwt.verify(token, process.env.JWT_SECRET as Secret) as JWTDecoded
            req.admin = await AdminCollection.findById(decoded.userId).select('-password') as AdminReqData
            next();
        } catch (error) {
            res.status(401) 
            throw new Error("not authorized, invalid token");
        }
    } else {
        res.status(401)
        throw new Error("not authorized, no token");
    }
});

export const  isStudentBlocked = asyncHandler(async (req : Request,res : Response,next : NextFunction)=>{
    const studentReq = req as JWTStudentReq

    const {email} = studentReq.user

    let student = await studentCollection.findOne({email})
    if(student && student.isBlocked){  
            res.status(401);
            throw new Error("enrtry restricted contact the authority");
    }
    next()
})

export const  isTutorBlocked = asyncHandler(async (req : Request,res : Response,next : NextFunction)=>{
    const tutorReq = req as JWTTutorReq

    const {email} = tutorReq.tutor
    let tutor = await tutorCollection.findOne({email})
    if(tutor && tutor.isBlocked){  
            res.status(401);
            throw new Error("enrtry restricted contact the authority");
    }
    next()
})


export const isStudentAuthenticated = asyncHandler(async (req : JWTStudentHeadersRequest, res : Response, next  :NextFunction) => {
    let token;
    token = req.headers.authorization;
    if (token) {
        try {
            const decoded : JWTDecoded | string | JwtPayload  = jwt.verify(token, process.env.JWT_SECRET as Secret) as JWTDecoded
            req.user = await studentCollection.findById(decoded.userId).select('-password') as StudentModelType
            next();
        } catch (error) {
            res.status(401);
            throw new Error("not authorized, invalid token");
        }
    } else {
        res.status(401);
        throw new Error("not authorized, no token");
    }
});


export const isTutorAuthenticated = asyncHandler(async (req : JWTTutorHeadersRequest, res : Response, next : NextFunction) => {
    let token;
    token = req.headers.authorization;
    if (token) {
        try {
            const decoded  : JWTDecoded | string | JwtPayload  = jwt.verify(token, process.env.JWT_SECRET as Secret) as JWTDecoded
            req.tutor = await tutorCollection.findById(decoded.userId).select('-password') as TutorModelType
            next();
        } catch (error) {
            res.status(401);
            throw new Error("not authorized, invalid token");
        }
    } else {
        res.status(401);
        throw new Error("not authorized, no token");
    }
});
