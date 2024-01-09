import { Request } from "express"
import { StudentType } from "./student_type"
import { TutorType } from "./tutor_type"
import { JWTAdminHeadersRequest } from "./auth_type"
import { AdminReqData } from "./admin_type"

export interface JWTStudentReq extends Request{
    user : StudentType

}

export interface JWTTutorReq extends Request{
    tutor : TutorType

}

export interface AdminJWT extends JWTAdminHeadersRequest{
    admin : AdminReqData
}

