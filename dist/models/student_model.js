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
const studentSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    profile: { type: String },
    role: { type: String, default: 'Student' },
    twofactor: { type: Boolean },
    isBlocked: { type: Boolean, default: false },
    isDommyPass: { type: Boolean },
    contact: { type: String }
});
//user schema
studentSchema.methods.checkPassword = function (pwd) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(pwd, this.password);
    });
};
studentSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            next();
        }
        const salt = yield bcrypt.genSalt(10);
        this.password = yield bcrypt.hash(this.password, salt);
    });
});
studentSchema.statics = {
    isExists(email) {
        return this.findOne({ email })
            .then((res) => {
            if (!res)
                throw ({ name: 'error.nouser', errMsg: 'ivalid email' });
            return res;
        });
    }
};
const studentCollection = mongoose.model('student', studentSchema);
export default studentCollection;
