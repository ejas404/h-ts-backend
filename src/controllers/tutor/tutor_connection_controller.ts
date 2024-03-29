import mongoose from "mongoose"
import asyncHandler from "express-async-handler"
import courseCollection from "../../models/course_model.js"
import enrollCollection from "../../models/course_enroll_model.js"
import studentCollection from "../../models/student_model.js"
import chatsCollection from "../../models/chat_model.js"
import orderCollection from "../../models/order_model.js"

export const getTutorConnections =  asyncHandler(async(req : any  ,res )=>{
    const tutor_id = new mongoose.Types.ObjectId(req.tutor._id)
    const courseDetails = await courseCollection.find({tutor : tutor_id},{_id : 1})
    const courseList = courseDetails.map(each => each._id)

    const getEnrolls = await enrollCollection.find({course : {$in : courseList }})
    const enidList = getEnrolls.map(each => each.enid)
    const userList = await orderCollection.find({enid : {$in : enidList}}).distinct('user')
    const connList = await studentCollection.find({_id : {$in : userList}},{name : 1,profile : 1})

    res.json({connections : connList})
})

export const getMessages = asyncHandler(async (req: any, res) => {
    const user = new mongoose.Types.ObjectId(req.tutor._id)
    const reciever = new mongoose.Types.ObjectId(req.params.id)

    const getMessages = await chatsCollection
        .find(
            {
                $or:
                    [
                        { sender: user, receiver: reciever },
                        { sender: reciever, receiver: user }
                    ]
            })
    res.json(getMessages)
})