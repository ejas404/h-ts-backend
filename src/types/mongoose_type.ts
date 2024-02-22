import mongoose, { Model } from "mongoose";


export type mongoId =  mongoose.Types.ObjectId

export interface UserModelExists<T> extends Model<T> {
    isExists(email: string): Promise<T | null>;
}
  