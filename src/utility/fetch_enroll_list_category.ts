import enrollCollection from "../models/course_enroll_model";
import { mongoId } from "../types/mongoose_type";

export const fetechEnrollCategory = async (user : mongoId) =>{
    const categoryObjList = await enrollCollection.aggregate([
        {
          $match: { user }
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