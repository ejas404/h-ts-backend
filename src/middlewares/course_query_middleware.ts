import { NextFunction } from "express";
import { Request,Response } from "express";
import asyncHandler from "express-async-handler"

export const  checkCourse = asyncHandler(async (req : Request,res : Response,next : NextFunction)=>{
   const page = req.query
   if(typeof(page) !== 'number'){
    req.query = 1 as any;
   }
   next()
})