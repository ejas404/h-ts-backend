var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import enrollCollection from "../models/course_enroll_model.js";
export const getPopularCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getCourses = yield enrollCollection.aggregate([
            { $group: { _id: "$course", count: { $sum: 1 } } },
            { $lookup: { from: 'courses', localField: "_id", foreignField: "_id", as: "course" } },
            { $sort: { count: -1 } },
            { $limit: 3 },
            { $unwind: "$course" },
            { $lookup: { from: "tutors", localField: "course.tutor", foreignField: "_id", as: "tutorDetails" } },
            { $lookup: { from: "subcategories", localField: "course.subCategory", foreignField: "_id", as: "subcat" } },
            { $project: { "count": 1, course: 1, "tutorDetails.name": 1, "subcat.name": 1 } },
            { $unwind: "$tutorDetails" },
            { $unwind: "$subcat" }
        ]);
        return getCourses;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
