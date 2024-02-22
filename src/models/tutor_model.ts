import mongoose, { Model } from 'mongoose'
import bcrypt from 'bcrypt'
import { TutorModelType} from '../types/tutor_type.js'
import { UserModelExists } from '../types/mongoose_type.js'

const Schema = mongoose.Schema


//admin schema datas
const tutorSchema = new Schema <TutorModelType>({
    name : {type:String, required:true},
    password : {type:String, required:true},
    email : {type:String, required:true},
    profile : {type : String},
    role : {type : String , default : 'Tutor', immutable : true},
    twofactor : {type : Boolean},
    isBlocked : {type : Boolean, default : false},
    contact : {type : String},
    education : [
        {
            ed_id : {type : String, required : true}, 
            university : {type : String, required : true},
            stream : {type : String, required : true},
            year : {type : Number, required : true},
            country : {type : String, required : true},
        }
    ],
    language :{type :  [String], default : ['eg : English']},
    teaches : {type :  [String], default : ['eg : Science']},
    field : {type :  [String], default : ['eg : Computer Science']},
})

//user schema

tutorSchema.statics = {
    isExists(email){
        return this.findOne({email})
                .then((res : TutorModelType)=>{
                    if(!res) throw({name : 'error.nouser',errMsg : 'ivalid email'});
                    return res;
                })
    }
}

tutorSchema.methods.checkPassword = async function (pwd : string){
    return await bcrypt.compare(pwd,this.password)
}


tutorSchema.pre('save', async function (next){
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const tutorCollection : UserModelExists<TutorModelType> = mongoose.model('tutor',tutorSchema) as UserModelExists<TutorModelType>

export default tutorCollection