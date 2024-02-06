import asyncHandler from "express-async-handler"
import { Request, Response } from "express";
import { getPopularCourses } from "../../utility/admin_dashboard_helper";

export const getPopular = asyncHandler(async (req : Request , res : Response)=>{
   const popularCourses = await getPopularCourses()
    if(popularCourses === false) {
        throw new Error ('failed to get poplar courses');
    }
    res.json({popularCourses})
})