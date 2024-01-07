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
  