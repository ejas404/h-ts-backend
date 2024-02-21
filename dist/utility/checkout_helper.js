var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import enrollCollection from "../models/course_enroll_model";
import cartCollection from "../models/user_cart_model";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
export const enrollCartItems = (user_id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose.startSession();
    try {
        const userCart = yield cartCollection.findOne({ user: user_id });
        if (!userCart)
            throw new Error('no user cart');
        const enId = uuidv4();
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            userCart.course.forEach((each) => __awaiter(void 0, void 0, void 0, function* () {
                const obj = {
                    enid: enId,
                    course: each,
                };
                if (amount === 0) {
                    obj.isEnrolled = true;
                    userCart.course = [];
                    yield userCart.save();
                }
                yield enrollCollection.create(obj);
            }));
        }));
        return enId;
    }
    catch (e) {
        console.log(e);
        return false;
    }
    finally {
        yield session.endSession();
    }
});
export const enrollSingleCourse = (course_id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose.startSession();
    try {
        const enId = uuidv4();
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const obj = {
                enid: enId,
                course: course_id,
            };
            if (amount === 0) {
                obj.isEnrolled = true;
            }
            yield enrollCollection.create(obj);
        }));
        return enId;
    }
    catch (e) {
        console.log(e);
        return (false);
    }
    finally {
        yield session.endSession();
    }
});
