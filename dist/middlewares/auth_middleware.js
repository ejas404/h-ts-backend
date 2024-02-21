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
import jwt from 'jsonwebtoken';
import AdminCollection from "../models/admin_model";
import studentCollection from "../models/student_model";
import tutorCollection from "../models/tutor_model";
export const isAuthenticated = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = (yield AdminCollection.findById(decoded.userId).select('-password'));
            if (!(req === null || req === void 0 ? void 0 : req.admin))
                throw new Error('invalid token');
            next();
        }
        catch (error) {
            res.status(401);
            throw new Error("not authorized, please login");
        }
    }
    else {
        res.status(401);
        throw new Error("not authorized, please login");
    }
}));
export const isStudentBlocked = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const studentReq = req;
    const { email } = studentReq.user;
    let student = yield studentCollection.findOne({ email });
    if (student && student.isBlocked) {
        res.status(401);
        throw new Error("enrtry restricted contact the authority");
    }
    next();
}));
export const isTutorBlocked = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const { email } = tutorReq.tutor;
    let tutor = yield tutorCollection.findOne({ email });
    if (tutor && tutor.isBlocked) {
        res.status(401);
        throw new Error("enrtry restricted contact the authority");
    }
    next();
}));
export const isStudentAuthenticated = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = (yield studentCollection.findById(decoded.userId).select('-password'));
            next();
        }
        catch (error) {
            res.status(401);
            throw new Error("not authorized, try later or connect help");
        }
    }
    else {
        res.status(401);
        throw new Error("not authorized, please login");
    }
}));
export const isTutorAuthenticated = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.tutor = (yield tutorCollection.findById(decoded.userId).select('-password'));
            next();
        }
        catch (error) {
            res.status(401);
            throw new Error("not authorized, invalid token");
        }
    }
    else {
        res.status(401);
        throw new Error("not authorized, no token");
    }
}));
