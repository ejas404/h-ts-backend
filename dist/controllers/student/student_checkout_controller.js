var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { isNumber } from "../../type_check/number.js";
import { fetchCartDetails, fetchCartTotal } from "../../utility/cart_details_fetch.js";
import courseCollection from "../../models/course_model.js";
import { enrollCartItems, enrollSingleCourse } from "../../utility/checkout_helper.js";
import { isCartItemsEnrolled, isCourseEnrolledHelper } from "../../utility/enroll_check_helper.js";
import orderCollection from "../../models/order_model.js";
export const checkOut = asyncHandler((request, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req = request;
    const { amount, isCart, course_id } = req.body;
    const user_id = new mongoose.Types.ObjectId(req.user._id);
    // this defines the order is for cart or single product
    let checkOutFor;
    if (!isNumber(amount))
        throw new Error('invalid amount');
    if (isCart === true) {
        const cartDetails = yield fetchCartDetails(user_id);
        if (!cartDetails)
            throw new Error('no cart has founded');
        const isCartEnrolled = yield isCartItemsEnrolled(user_id);
        if (isCartEnrolled)
            throw new Error('cart item have already enrolled');
        const total = fetchCartTotal(cartDetails);
        if (total === null)
            throw new Error('no cart total');
        if (total !== amount)
            throw new Error('amount does not matches');
        checkOutFor = 'cart';
    }
    else {
        const isEnrolledCourse = yield isCourseEnrolledHelper(course_id, req.user._id);
        if (isEnrolledCourse)
            throw new Error('course have already enrolled');
        const isExist = yield courseCollection.findById(course_id);
        if (!isExist)
            throw new Error('not such course exists');
        if (isExist.fee !== amount)
            throw new Error('amount does not matches');
        checkOutFor = 'single';
    }
    if (!checkOutFor)
        throw new Error('checkout method is not specified');
    let enid;
    if (checkOutFor === 'cart') {
        enid = yield enrollCartItems(user_id, amount);
        if (!enid)
            throw new Error('failed to enroll cart items try later');
    }
    if (checkOutFor === 'single') {
        enid = yield enrollSingleCourse(course_id, amount);
        if (!enid)
            throw new Error('failed to enroll course try later');
    }
    const order = yield orderCollection.create({
        user: user_id,
        total: amount,
        amountPayable: amount,
        enid,
        orderFrom: checkOutFor
    });
    const isEnrolled = amount === 0;
    // the course will be enrolled if the course is free
    if (isEnrolled) {
        res.json({ success: true, enid });
    }
    // if the course is paid will redirect to payment page
    res.redirect(`/api/student/payment?amount=${amount}&enrollId=${enid}`);
}));
