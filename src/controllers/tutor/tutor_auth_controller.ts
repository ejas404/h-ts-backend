import asyncHandler from "express-async-handler"
import { Request, Response } from "express";
import { generateToken } from "../../utility/token.js"
import tutorCollection from "../../models/tutor_model.js";
import { AuthCredentials, SignUpDetails } from "../../types/auth_type.js";
import { TutorModelType } from "../../types/tutor_type.js";




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