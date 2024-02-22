import courseCollection from "../models/course_model.js";
import { CourseResponseType } from "../types/course_type.js";

export const isCourseExist = async (obj :Partial<CourseResponseType> ) => {
    const {title , tutor, category, subCategory} = obj
    const isExist = await courseCollection.findOne({title,tutor,category, subCategory})
    return !!isExist
}