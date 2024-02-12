import mongoose, { Model } from "mongoose";
import { TutorModelType } from "./tutor_type";
import { StudentModelType } from "./student_type";

export type mongoId =  mongoose.Types.ObjectId

export interface UserModelExists<T> extends Model<T> {
    isExists(email: string): Promise<T | null>;
}
  