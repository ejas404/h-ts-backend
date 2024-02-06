import mongoose from "mongoose";
import enrollCollection from "../models/course_enroll_model";
import { mongoId } from "../types/mongoose_type";
import { fetchCartItemList } from "./cart_details_fetch";

export const isCourseEnrolled = async (course: mongoId, user: mongoId) => {
    const isEnrolled = await enrollCollection.findOne({ user, course, isEnrolled: true })
    console.log('is enrolled printing', isEnrolled)
    return !!isEnrolled
}

export const isCartItemsEnrolled = async (user: mongoId) => {
    const cartList = await fetchCartItemList(user)
    const isEnrolled = await enrollCollection.find({ user, course: { $in: cartList }, isEnrolled: true })
    return !!isEnrolled[0]
}


export const checkEnId = async (enid: string) => {
    const isEnid = await enrollCollection.findOne({ enid })
    return !!isEnid
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