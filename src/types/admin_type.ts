import mongoose from "mongoose"
import { JWTHeadersRequest } from "./auth_type"

export interface AdminModelType{
    email : string,
    password : string,
    twofactor : boolean,
    role : 'Admin',
    checkPassword : (pwd : string) => boolean
}

export interface AdminResponseType{
    name : string,
    email : string,
    role : 'Admin',
}

export interface AdminReqData{
    _id : mongoose.Types.ObjectId
    email : string,
    twofactor : boolean,
    role : 'Admin',
}


export interface AdminJWT extends JWTHeadersRequest{
    admin : AdminReqData
}