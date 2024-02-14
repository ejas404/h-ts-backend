import asyncHandler from "express-async-handler"
import { Request, Response } from "express";
import { getPopularCourses } from "../../utility/admin_dashboard_helper";
import subCategoryCollection from "../../models/course_sub_category";
import orderCollection from "../../models/order_model";

export const getPopular = asyncHandler(async (req : Request , res : Response)=>{
   const popularCourses = await getPopularCourses()
    if(popularCourses === false) {
        throw new Error ('failed to get poplar courses');
    }
    res.json({popularCourses})
})

export const getChart = asyncHandler(async (req : Request , res : Response)=>{
    const chartList = await subCategoryCollection.aggregate([
        {$lookup : {from : "courses",localField : "_id",foreignField : "subCategory",as : "courseList"}},
        {$project : {name : 1, count : {$size : "$courseList"}}}
      ])

    const catName : string[] = []
    const catCount : number[] = []

    for(let each of chartList){
        if(each.count > 0){
            catName.push(each.name);
            catCount.push(each.count);
        }
    }

    const pieChart = {catName,catCount}

    const orders = await orderCollection.find({isPaid : true},{amountPayable : 1,createdAt : 1})
    console.log(orders)
    console.log('orders printed')
    res.json({pieChart,orders})
 })
 
 


