import courseCollection from "../models/course_model";
import { CourseResponseType } from "../types/course_type";

export const isCourseExist = async (obj :Partial<CourseResponseType> ) => {
    const {title , tutor, category, subCategory} = obj
    const isExist = await courseCollection.findOne({title,tutor,category, subCategory})
    return !!isExist
}