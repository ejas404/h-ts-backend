import mongoose from "mongoose";

export interface CourseResponseType extends mongoose.Document{
    _id : mongoose.Types.ObjectId;
    title: string;
    description: string;
    cover?: string;
    fee: number;
    tutor: mongoose.Types.ObjectId | string;
    isAvailable: boolean;
    isApproved: boolean;
    isTutorMade: boolean;
    request: 'Pending' | 'Approved' | 'Cancelled';
    isDeleted: boolean;
  }


export interface SectionType extends mongoose.Document{
  title: string;
  description: string;
  course : mongoose.Types.ObjectId;
}

export interface VideoType extends mongoose.Document{
  title: string;
  description: string;
  section : mongoose.Types.ObjectId;
  url : string;
}
  