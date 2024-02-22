import orderCollection from "../models/order_model.js";
import enrollCollection from "../models/course_enroll_model.js";
import { mongoId } from "../types/mongoose_type.js";

export const fetechEnrollCategory = async (user : mongoId) =>{
    const order = await orderCollection.find({user})
    const enidList = order.map(each => each.enid)

    const categoryObjList = await enrollCollection.aggregate([
        {
          $match: { enid : {$in : enidList} }
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
            _id : 0,
            "subCatDetails._id": 1,
            "subCatDetails.name": 1
          }
        }
      ]);

       return categoryObjList
      
}