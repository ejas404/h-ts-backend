import enrollCollection from "../models/course_enroll_model";
import cartCollection from "../models/user_cart_model";
import mongoose from "mongoose";
import { CartItem } from "../types/cart_type";
import { enrollmentType } from "../types/course_enroll_type";
import { mongoId } from "../types/mongoose_type";
import { v4 as uuidv4 } from 'uuid';


export const enrollCartItems = async (user_id : mongoId, amount : number) => {
    const session = await mongoose.startSession()
    try{
        const userCart = await cartCollection.findOne({user : user_id})
        if(!userCart) throw new Error('no user cart');

        const enId = uuidv4();

        await session.withTransaction( async () : Promise<any> => {   
            userCart.course.forEach( async (each : CartItem) => {

                const obj : enrollmentType = {
                    enid : enId,
                    course : each.course_id,
                }

                if(amount === 0){
                    obj.isEnrolled = true
                    userCart.course = []
                    await userCart.save()
                }
                await enrollCollection.create(obj)
            })
        })
       
        return enId 

    }catch(e){
        console.log(e)
        return false
    }finally{
        await session.endSession()
    }
    
}


export const enrollSingleCourse = async (course_id : mongoId ,amount : number)=>{
    const session = await mongoose.startSession()
    try{

        const enId = uuidv4();

        await session.withTransaction( async ()=>{
            
            const obj : enrollmentType = {
                enid : enId,
                course : course_id,
            }

            if(amount === 0){
                obj.isEnrolled = true
            }
            await enrollCollection.create(obj)
        })

        return enId

    }catch(e){
        console.log(e)
        return(false)
    }finally{
        await session.endSession()
    }
}