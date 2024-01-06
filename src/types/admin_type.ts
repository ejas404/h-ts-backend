export interface AdminModelType{
    email : string,
    password : string,
    twofactor : boolean,
    role : 'Admin',
    checkPassword : (pwd : string) => boolean
}

export interface AdminResponseType{
    name : string,
    email : string,
    role : 'Admin',
}