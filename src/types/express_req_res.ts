export interface StatusCodeRes extends Express.Response{
    status : (code : number) => any
}

export interface RequestWithPathParam extends Express.Request{
   params : {
    id : string
   }
}


export interface RequestWithFile extends Express.Request{
    file : {
        path ?: string
    }
}