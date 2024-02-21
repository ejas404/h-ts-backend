var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import enrollCollection from "../models/course_enroll_model";
import { fetchCartItemList } from "./cart_details_fetch";
import orderCollection from "../models/order_model";
export const isCourseEnrolledHelper = (course_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = new mongoose.Types.ObjectId(course_id);
        const user = new mongoose.Types.ObjectId(user_id);
        const order = yield orderCollection.find({ user });
        const enidList = order.map(each => each.enid);
        const isEnrolled = yield enrollCollection.findOne({ enid: { $in: enidList }, course, isEnrolled: true });
        console.log('is enrolled printing', isEnrolled);
        return !!isEnrolled;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
export const isCartItemsEnrolled = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartList = yield fetchCartItemList(user);
        const order = yield orderCollection.find({ user });
        const enidList = order.map(each => each.enid);
        const isEnrolled = yield enrollCollection.find({ enid: { $in: enidList }, course: { $in: cartList }, isEnrolled: true });
        return !!isEnrolled[0];
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
export const checkEnId = (enid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isEnid = yield enrollCollection.findOne({ enid });
        return !!isEnid;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
export const updateEnroll = (enid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield mongoose.startSession();
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const upate = yield enrollCollection.updateMany({ enid }, { $set: { isEnrolled: true } });
        }));
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
