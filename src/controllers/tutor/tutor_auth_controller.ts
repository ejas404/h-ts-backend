import asyncHandler from "express-async-handler"
import { generateToken } from "../../utility/token"
import tutorCollection from "../../models/tutor_model";
import { AuthCredentials, SignUpDetails } from "../../types/auth_type";
import { Request, Response } from "express";
import { TutorModelType } from "../../types/tutor_type";




export const login = asyncHandler(async (req : Request, res : Response) => {
    const { email } : AuthCredentials = req.body;

    const user = await tutorCollection.findOne({ email }) as TutorModelType;
   
        let token = generateToken(res, user._id,'Tutor');
        let userDetails = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        res.status(201).json({
            user: userDetails,
            token: token
        })

})


export const register = asyncHandler(async (req : Request, res : Response) => {
    
    const { name, email, password } : SignUpDetails = req.body;
    const user = await tutorCollection.create({ name, email, password });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    })

})