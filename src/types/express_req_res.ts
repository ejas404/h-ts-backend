export interface StatusCodeRes extends Express.Response{
    status : (code : number) => any
}

export interface RequestWithPathParam extends Express.Request{
   params : {
    id : string
   }
}


