import { mongoId } from "./mongoose_type";

export interface enrollmentType{
    user : mongoId,
    course : mongoId,
    time : number,
    isEnrolled ?: boolean
}