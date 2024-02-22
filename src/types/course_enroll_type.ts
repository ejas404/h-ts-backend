import { mongoId } from "./mongoose_type.js";

export interface enrollmentType{
    enid : string
    course : mongoId
    rating ?: number
    isEnrolled ?: boolean
}