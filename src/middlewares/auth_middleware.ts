import asyncHandler from "express-async-handler"
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import AdminCollection from "../models/admin_model.ts"
import { JWTDecoded, JWTHeadersRequest } from "types/auth_type.ts";
import { NextFunction } from "express";
import { AdminReqData } from "types/admin_type.ts";
import { StatusCodeRes } from "types/express_req_res.ts";

export const isAuthenticated = asyncHandler(async (req : JWTHeadersRequest, res : StatusCodeRes, next : NextFunction) => {
    let token;
    token = req.headers.authorization;
    if (token) {
        try {
            const decoded : JWTDecoded | string | JwtPayload  = jwt.verify(token, process.env.JWT_SECRET as Secret) as JWTDecoded
            req.admin = await AdminCollection.findById(decoded.userId).select('-password') as AdminReqData
            next();
        } catch (error) {
            res.status(401) 
            throw new Error("not authorized, invalid token");
        }
    } else {
        res.status(401)
        throw new Error("not authorized, no token");
    }
});