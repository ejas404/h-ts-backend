import mongoose from "mongoose";
import { Request } from "express";

export interface StudentType extends mongoose.Document{
    name: string;
    password: string;
    email: string;
    profile?: string;
    role: 'Student' ;
    twofactor?: boolean;
    isBlocked: boolean;
    contact?: string;
    isDommyPass ?: boolean
}


export interface StudentModelType extends StudentType{
    _id : mongoose.Types.ObjectId
    checkPassword : (pwd : string) => boolean
}

