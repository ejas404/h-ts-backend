import { mongoId } from "./mongoose_type";

export interface enrollmentType{
    enid : string
    user : mongoId
    course : mongoId
    time : number
    rating ?: number
    isEnrolled ?: boolean
}