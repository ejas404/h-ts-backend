import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { AdminModelType } from '../types/admin_type'

const Schema = mongoose.Schema


//admin schema datas
const adminSchema = new Schema <AdminModelType> ({
    password : {type:String, required:true},
    email : {type:String, required:true},
    twofactor : {type : Boolean},
    role : {type : String , default : 'Admin'},

})

//user schema


adminSchema.methods.checkPassword = async function (pwd : string){
    return await bcrypt.compare(pwd,this.password)
}



const AdminCollection = mongoose.model('admin',adminSchema)

export default AdminCollection