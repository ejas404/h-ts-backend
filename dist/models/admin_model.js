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
const adminSchema = new Schema({
    password: { type: String, required: true },
    email: { type: String, required: true },
    twofactor: { type: Boolean },
    role: { type: String, default: 'Admin' },
});
//user schema
adminSchema.methods.checkPassword = function (pwd) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(pwd, this.password);
    });
};
const AdminCollection = mongoose.model('admin', adminSchema);
export default AdminCollection;
