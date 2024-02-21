var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;
//admin schema datas
const tutorSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    profile: { type: String },
    role: { type: String, default: 'Tutor', immutable: true },
    twofactor: { type: Boolean },
    isBlocked: { type: Boolean, default: false },
    contact: { type: String },
    education: [
        {
            ed_id: { type: String, required: true },
            university: { type: String, required: true },
            stream: { type: String, required: true },
            year: { type: Number, required: true },
            country: { type: String, required: true },
        }
    ],
    language: { type: [String], default: ['eg : English'] },
    teaches: { type: [String], default: ['eg : Science'] },
    field: { type: [String], default: ['eg : Computer Science'] },
});
//user schema
tutorSchema.statics = {
    isExists(email) {
        return this.findOne({ email })
            .then((res) => {
            if (!res)
                throw ({ name: 'error.nouser', errMsg: 'ivalid email' });
            return res;
        });
    }
};
tutorSchema.methods.checkPassword = function (pwd) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(pwd, this.password);
    });
};
tutorSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            next();
        }
        const salt = yield bcrypt.genSalt(10);
        this.password = yield bcrypt.hash(this.password, salt);
    });
});
const tutorCollection = mongoose.model('tutor', tutorSchema);
export default tutorCollection;
