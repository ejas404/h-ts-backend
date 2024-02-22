import { Request } from "express"
import { StudentType } from "./student_type.js"
import { TutorType } from "./tutor_type.js"
import { JWTAdminHeadersRequest } from "./auth_type.js"
import { AdminReqData } from "./admin_type.js"

export interface JWTStudentReq extends Request{
    user : StudentType

}

export interface JWTTutorReq extends Request{
    tutor : TutorType

}

export interface AdminJWT extends JWTAdminHeadersRequest{
    admin : AdminReqData
}

