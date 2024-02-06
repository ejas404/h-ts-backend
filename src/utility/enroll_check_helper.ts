import mongoose from "mongoose";
import enrollCollection from "../models/course_enroll_model";
import { mongoId } from "../types/mongoose_type";
import { fetchCartItemList } from "./cart_details_fetch";

export const isCourseEnrolledHelper = async (course_id : string, user_id: string) => {
    try {
        const course  =  new mongoose.Types.ObjectId(course_id)
        const user = new mongoose.Types.ObjectId(user_id)

        const isEnrolled = await enrollCollection.findOne({ user, course, isEnrolled: true })
        console.log('is enrolled printing', isEnrolled)
        return !!isEnrolled
    } catch (e) {
        console.log(e)
        return false;
    }
}

export const isCartItemsEnrolled = async (user: mongoId) => {
    try {
        const cartList = await fetchCartItemList(user)
        const isEnrolled = await enrollCollection.find({ user, course: { $in: cartList }, isEnrolled: true })
        return !!isEnrolled[0]
    } catch (e) {
        console.log(e)
        return false;
    }
}


export const checkEnId = async (enid: string) => {
    try {
        const isEnid = await enrollCollection.findOne({ enid })
        return !!isEnid
    } catch (e) {
        console.log(e)
        return false;
    }

}

export const updateEnroll = async (enid: string) => {
    try {
        const session = await mongoose.startSession()

        await session.withTransaction(async (): Promise<any> => {
            const upate = await enrollCollection.updateMany({ enid }, { $set: { isEnrolled: true } })
        })

        return true

    } catch (e) {
        console.log(e)
        return false;
    }

}