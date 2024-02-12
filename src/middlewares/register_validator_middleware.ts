

import z from 'zod';
import { NextFunction, Response, Request } from 'express'
import asyncHandler from 'express-async-handler'
import tutorCollection from '../models/tutor_model'
import studentCollection from '../models/student_model'
import { JWTStudentReq, JWTTutorReq } from '../types/express_req_res'

export const registerValidator = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userReq = req as JWTStudentReq | JWTTutorReq
    const { email, password, name } = req.body

    const authCred = z.object({
        name  :z.string(),
        email: z.string().email({ message: 'enter a valid email' }),
        password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/, "enter a valid password")
    })

    const check = authCred.safeParse({ email, password })
    if(!check.success) throw new Error('enter valid details');

    const url = req.originalUrl.includes('tutor')
    let user;
    if (url) {
        user = await tutorCollection.isExists(email);
    } else {
        user = await studentCollection.isExists(email);
    }

    if (user)throw new Error("User already exists.");

    next()
})