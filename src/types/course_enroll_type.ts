import { mongoId } from "./mongoose_type";

export interface enrollmentType{
    enid : string
    course : mongoId
    rating ?: number
    isEnrolled ?: boolean
}