import { IncomingHttpHeaders } from "http"
import { Jwt, JwtPayload } from "jsonwebtoken"
import { AdminReqData } from "./admin_type"

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

export interface JWTCookieResponse extends Express.Response{
    cookie(jwt : 'jwt',token : string, options : CookieResponse) : Express.Response
}


export interface JWTHeadersRequest extends Express.Request{
    admin ?: AdminReqData
    headers : IncomingHttpHeaders
}

export interface JWTDecoded extends JwtPayload{
    userId : string
}