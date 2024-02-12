import mongoose from "mongoose";
import { mongoId } from "./mongoose_type";

export interface TutorType extends mongoose.Document{
    name: string;
    password: string;
    email: string;
    profile?: string;
    role:'Tutor';
    education ?: TutorEducationDetails[]; 
    twofactor?: boolean;
    isBlocked: boolean;
    contact?: string;
    language: string[];
    teaches: string[];
    field: string[];
    [key : string] : any
}

export interface TutorModelType extends TutorType{
    _id : mongoId;
    checkPassword : (pwd : string) => boolean;
}

export interface TutorDeleteRes extends mongoose.Document{
    _id : mongoId | string;
    name: string;
    email: string;
}

export interface TutorEducationDetails{
    ed_id : string,
    university : string,
    stream : string,
    year : number,
    country : string
}
