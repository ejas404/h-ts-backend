import { IncomingHttpHeaders } from "http"
import { Jwt, JwtPayload } from "jsonwebtoken"
import { AdminReqData } from "./admin_type"
import { Request, Response } from "express"
import { StudentModelType } from "./student_type"
import { TutorModelType } from "./tutor_type"

export interface AuthCredentials{
    email : string
    password : string
}

export interface SignUpDetails{
    name : string
    email : string
    password : string
}

export interface CookieResponse{
    httpOnly:boolean,
    secure : boolean,
    maxAge : number
}

export interface JWTCookieResponse {
    cookie(jwt : 'jwt',token : string, options : CookieResponse) : JWTCookieResponse;
}


export interface JWTAdminHeadersRequest extends Request{
    admin ?: AdminReqData
    headers : IncomingHttpHeaders
}

export interface JWTStudentHeadersRequest extends Request{
    user ?: StudentModelType
    headers : IncomingHttpHeaders
}

export interface JWTTutorHeadersRequest extends Request{
    tutor ?: TutorModelType
    headers : IncomingHttpHeaders
}

export interface JWTDecoded extends JwtPayload{
    userId : string
}