import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { JWTResponse } from 'types/auth_type'

export const generateToken =   (res : JWTResponse , userId : mongoose.Types.ObjectId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET as string,{expiresIn:'30d'})

    res.cookie('jwt',token,{
        httpOnly:true,
        secure : process.env.NODE_ENV !== 'development',
        maxAge : 30 * 24 * 60 * 60 * 1000
    })

    return token
}