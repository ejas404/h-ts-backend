import jwt, { Secret } from 'jsonwebtoken'
import mongoose from 'mongoose'
import { JWTCookieResponse } from '../types/auth_type'

export const generateToken =   (res : JWTCookieResponse , userId : mongoose.Types.ObjectId, role : string)=>{
    const token = jwt.sign({userId, role}, process.env.JWT_SECRET as Secret,{expiresIn:'30d'})

    res.cookie('jwt',token,{
        httpOnly:true,
        secure : process.env.NODE_ENV !== 'development',
        maxAge : 30 * 24 * 60 * 60 * 1000
    })

    return token
}