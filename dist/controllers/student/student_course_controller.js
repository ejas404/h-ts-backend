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
import cartCollection from "../../models/user_cart_model.js";
import courseCollection from "../../models/course_model.js";
import { fetchCartDetails, fetchCartItemList, fetchCartTotal } from "../../utility/cart_details_fetch.js";
import { fetechEnrollCategory } from "../../utility/fetch_enroll_list_category.js";
import { isCourseEnrolledHelper } from "../../utility/enroll_check_helper.js";
export const addToCart = asyncHandler((request, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req = request;
    const { id } = req.params;
    const user_id = new mongoose.Types.ObjectId(req.user._id);
    const isCourseExist = yield courseCollection.findById(id);
    if (!isCourseExist)
        throw new Error('invalid course id');
    const cart = yield cartCollection.findOne({ user: user_id });
    // if cart exists add the course_id in the existing course list in cart
    const check = yield isCourseEnrolledHelper(id, req.user._id);
    if (check)
        throw new Error('course already enrolled');
    if (cart) {
        const courseList = cart.course;
        courseList.forEach(each => {
            if (each.equals(id))
                throw new Error('course have already added in the cart');
        });
        cart.course = [...courseList, isCourseExist._id];
        yield cart.save();
    }
    // else there is no cart new cart will be created
    else {
        const newCartItem = yield cartCollection.create({
            user: user_id,
            course: [isCourseExist._id]
        });
    }
    res.json({ msg: 'succsessfully added to cart' });
}));
export const removeFromCart = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user_id = new mongoose.Types.ObjectId(req.user._id);
    const isCourseExist = yield courseCollection.findById(id);
    if (!isCourseExist)
        throw new Error('invalid course id');
    const cart = yield cartCollection.findOne({ user: user_id });
    if (!cart)
        throw new Error('no cart exist for the user');
    const courseList = cart.course.slice();
    const filteredCourse = courseList.filter(each => {
        if (!each.equals(id)) {
            return each;
        }
        ;
    });
    cart.course = filteredCourse;
    yield cart.save();
    res.json({ msg: 'item removed from cart successfully' });
}));
export const getCartDetails = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = new mongoose.Types.ObjectId(req.user._id);
    const cartDetails = yield fetchCartDetails(user_id);
    if (!cartDetails || !cartDetails[0]) {
        res.json({ success: false });
    }
    else {
        const total = fetchCartTotal(cartDetails);
        if (total === null)
            throw new Error('no cart total');
        res.json({ success: true, cartItems: cartDetails[0].course, cartTotal: total });
    }
}));
export const cartList = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = new mongoose.Types.ObjectId(req.user._id);
    const cartList = yield fetchCartItemList(user_id);
    res.json({ cartList });
}));
export const getEnrollSubCat = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = new mongoose.Types.ObjectId(req.user._id);
    const subCatObj = yield fetechEnrollCategory(user_id);
    res.json({ subCatObj });
}));
