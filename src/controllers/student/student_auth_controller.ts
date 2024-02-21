import asyncHandler from "express-async-handler"
import { Request, Response } from "express";
import { generateToken } from "../../utility/token"
import studentCollection from "../../models/student_model";
import { StudentModelType } from "../../types/student_type";



export const login = asyncHandler(async (req : Request, res : Response) => {
    
    const { email } = req.body;
    const user = await studentCollection.findOne({ email }) as StudentModelType

    let token = generateToken(res, user._id,'Student');
    let userDetails = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        isBlocked: user.isBlocked
    }
    
    res.status(201).json({
        user: userDetails,
        token: token
    })

})


export const register = asyncHandler(async (req : Request, res : Response) => {

    const { name, email, password } = req.body;
    const user = await studentCollection.create({ name, email, password });
    
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    })
})





