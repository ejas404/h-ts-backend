import asyncHandler from "express-async-handler"
import { generateToken } from "../../utility/token.ts"
import tutorCollection from "../../models/tutor_model.ts";
import { AuthCredentials, SignUpDetails } from "types/auth_type.ts";
import { isString } from "../../type_check/string.ts";




export const login = asyncHandler(async (req, res) => {
    const { email, password } : AuthCredentials = req.body;

    const user = await tutorCollection.findOne({ email });
    if (user && (await user.checkPassword(password))) {
        let token = generateToken(res, user._id);
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
    } else {
        res.status(401);
        throw new Error("Invalid email or password.");
    }

})


export const register = asyncHandler(async (req, res) => {
    const { name, email, password } : SignUpDetails = req.body;

    if(!isString(name)) throw new Error('name is invalid')
    if(!isString(email)) throw new Error('email is invalid')
    if(!isString(password)) throw new Error('password is invalid')

    const userExists = await tutorCollection.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists.");
    }

    const user = await tutorCollection.create({ name, email, password });
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