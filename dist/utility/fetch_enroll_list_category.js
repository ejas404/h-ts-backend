var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import orderCollection from "../models/order_model.js";
import enrollCollection from "../models/course_enroll_model.js";
export const fetechEnrollCategory = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderCollection.find({ user });
    const enidList = order.map(each => each.enid);
    const categoryObjList = yield enrollCollection.aggregate([
        {
            $match: { enid: { $in: enidList } }
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
            $unwind: "$courseDetails"
        },
        {
            $lookup: {
                from: "subcategories",
                localField: "courseDetails.subCategory",
                foreignField: "_id",
                as: "subCatDetails"
            }
        },
        {
            $unwind: "$subCatDetails"
        },
        {
            $project: {
                _id: 0,
                "subCatDetails._id": 1,
                "subCatDetails.name": 1
            }
        }
    ]);
    return categoryObjList;
});
