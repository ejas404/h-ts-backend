

import z from 'zod';
import { NextFunction, Response, Request } from 'express'
import asyncHandler from 'express-async-handler'
import studentCollection from '../models/student_model'
import { JWTStudentReq, JWTTutorReq } from '../types/express_req_res'
import tutorCollection from '../models/tutor_model'

export const authValidator = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userReq = req as JWTStudentReq | JWTTutorReq
    const { email, password } = req.body

    const authCred = z.object({
        email: z.string().email({ message: 'enter a valid email' }),
        password: z.string()
    })

    const check = authCred.safeParse({ email, password })
    if(!check.success) throw new Error('invalid email of password');

    const url = req.originalUrl.includes('tutor')
    let user;
    if (url) {
        user = await tutorCollection.isExists(email);
    } else {
        user = await studentCollection.isExists(email);
    }

    if (!user || !(await user.checkPassword(password))) {
        res.status(401);
        throw new Error("Invalid email or password.");
    }

    if (user.isBlocked) {
        res.status(401)
        throw new Error('entry resticted connect support')
    }

    next()
})