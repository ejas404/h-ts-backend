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
import studentCollection from '../models/student_model.js';
import tutorCollection from '../models/tutor_model.js';
export const authValidator = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userReq = req;
    const { email, password } = req.body;
    const authCred = z.object({
        email: z.string().email({ message: 'enter a valid email' }),
        password: z.string()
    });
    const check = authCred.safeParse({ email, password });
    if (!check.success)
        throw new Error('invalid email of password');
    const url = req.originalUrl.includes('tutor');
    let user;
    if (url) {
        user = yield tutorCollection.isExists(email);
    }
    else {
        user = yield studentCollection.isExists(email);
    }
    if (!user || !(yield user.checkPassword(password))) {
        res.status(401);
        throw new Error("Invalid email or password.");
    }
    if (user.isBlocked) {
        res.status(401);
        throw new Error('entry resticted connect support');
    }
    next();
}));
