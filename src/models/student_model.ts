import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { StudentModelType, StudentType } from 'types/student_type'

const Schema = mongoose.Schema


//admin schema datas
const studentSchema = new Schema <StudentModelType>({
    name : {type:String, required:true},
    password : {type:String, required:true},
    email : {type:String, required:true},
    profile : {type:String},
    role : {type : String , default : 'Student'},
    twofactor : {type : Boolean},
    isBlocked : {type : Boolean, default : false},
    isDommyPass : {type : Boolean},
    contact : {type : String}
})

//user schema


studentSchema.methods.checkPassword = async function (pwd : string){
    return await bcrypt.compare(pwd,this.password)
}

studentSchema.pre('save', async function (next){
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const studentCollection = mongoose.model('student',studentSchema)

export default studentCollection