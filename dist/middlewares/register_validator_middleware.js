var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import z from 'zod';
import asyncHandler from 'express-async-handler';
import tutorCollection from '../models/tutor_model';
import studentCollection from '../models/student_model';
export const registerValidator = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userReq = req;
    const { email, password, name } = req.body;
    const authCred = z.object({
        name: z.string(),
        email: z.string().email({ message: 'enter a valid email' }),
        password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/, "enter a valid password")
    });
    const check = authCred.safeParse({ email, password });
    if (!check.success)
        throw new Error('enter valid details');
    const url = req.originalUrl.includes('tutor');
    let user;
    if (url) {
        user = yield tutorCollection.isExists(email);
    }
    else {
        user = yield studentCollection.isExists(email);
    }
    if (user)
        throw new Error("User already exists.");
    next();
}));
