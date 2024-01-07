import mongoose from "mongoose";

export interface StudentType extends mongoose.Document{
    name: string;
    password: string;
    email: string;
    profile?: string;
    role: 'Student' ;
    twofactor?: boolean;
    isBlocked: boolean;
    contact?: string;
}


export interface StudentModelType extends StudentType{
    _id : mongoose.Types.ObjectId
    checkPassword : (pwd : string) => boolean
}

export interface JWTStudentReq extends Express.Request{
    user : StudentType

}