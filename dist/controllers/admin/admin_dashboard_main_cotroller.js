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
import { getPopularCourses } from "../../utility/admin_dashboard_helper.js";
import subCategoryCollection from "../../models/course_sub_category.js";
import orderCollection from "../../models/order_model.js";
export const getPopular = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const popularCourses = yield getPopularCourses();
    if (popularCourses === false) {
        throw new Error('failed to get poplar courses');
    }
    res.json({ popularCourses });
}));
export const getChart = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chartList = yield subCategoryCollection.aggregate([
        { $lookup: { from: "courses", localField: "_id", foreignField: "subCategory", as: "courseList" } },
        { $project: { name: 1, count: { $size: "$courseList" } } }
    ]);
    const catName = [];
    const catCount = [];
    for (let each of chartList) {
        if (each.count > 0) {
            catName.push(each.name);
            catCount.push(each.count);
        }
    }
    const pieChart = { catName, catCount };
    const orders = yield orderCollection.find({ isPaid: true }, { amountPayable: 1, createdAt: 1 });
    res.json({ pieChart, orders });
}));
