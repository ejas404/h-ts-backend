var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cartCollection from "../models/user_cart_model";
// this function calculates the total amout of cart items in a user cart 
export const fetchCartTotal = (cartDetails) => {
    const total = cartDetails[0].course.reduce((acc, each) => {
        return acc + each.details[0].fee;
    }, 0);
    if (isNaN(total))
        return null;
    return total;
};
export const fetchCartItemList = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userCart = yield cartCollection.findOne({ user });
    let cartList;
    if (userCart) {
        cartList = userCart === null || userCart === void 0 ? void 0 : userCart.course;
    }
    else {
        cartList = [];
    }
    return cartList;
});
// this function will provide the user cart details
export const fetchCartDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartDetails = yield cartCollection.aggregate([
            {
                $match: {
                    user: id
                }
            },
            {
                $unwind: "$course"
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    course: {
                        course_id: "$course",
                        details: "$courseDetails"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    user: { $first: "$user" },
                    course: { $push: "$course" }
                }
            }
        ]);
        return cartDetails;
    }
    catch (e) {
        console.log(e);
        return (null);
    }
});
