export interface AuthCredentials{
    email : string,
    password : string
}

export interface CookieResponse{
    httpOnly:boolean,
    secure : boolean,
    maxAge : number
}

export interface JWTResponse extends Express.Response{
    cookie(jwt : 'jwt',token : string, options : CookieResponse) : Express.Response
}