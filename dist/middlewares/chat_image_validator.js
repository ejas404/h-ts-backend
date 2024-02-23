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
import tutorCollection from "../models/tutor_model.js";
import studentCollection from "../models/student_model.js";
export const imageChatValidator = asyncHandler((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const req = request;
    const { receiver } = JSON.parse(req.body.chat);
    if (!req.file)
        throw new Error('multer error no request file');
    if (!req.file.path)
        throw new Error('multer error');
    let isExist;
    let sender;
    if (req.user) {
        sender = req.user._id;
        isExist = yield tutorCollection.findById(receiver);
    }
    if (req.tutor) {
        sender = req.tutor._id;
        isExist = yield studentCollection.findById(receiver);
    }
    if (!isExist)
        throw new Error('invalid receiver id');
    request.body.sender = sender;
    next();
}));
