import asyncHandler from "express-async-handler"
import { Request, Response } from "express";
import { generateToken } from "../../utility/token.ts"
import studentCollection from "../../models/student_model.ts";
import { isString } from "../../type_check/string.ts";



export const login = asyncHandler(async (req : Request, res : Response) => {
    const { email, password } = req.body;

    const user = await studentCollection.findOne({ email });
    console.log(user)
    if (!user || !(await user.checkPassword(password))) {
        res.status(401);
        throw new Error("Invalid email or password.");
    }

    if (user.isBlocked) {
        res.status(401)
        throw new Error('entry resticted connect support')
    }


    let token = generateToken(res, user._id);
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

    const userExists = await studentCollection.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists.");
    }

    if (!isString(name)) throw new Error('invalid name entered')
    if (!isString(email)) throw new Error('invalid email entered')
    if (!isString(password)) throw new Error('invalid password entered')

    const user = await studentCollection.create({ name, email, password });

    if (!user) {
        res.status(400);
        throw new Error("Invalid user data.");
    }

    generateToken(res, user._id);
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    })
})





