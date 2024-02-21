var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AdminCollection from "../../models/admin_model";
import asyncHandler from "express-async-handler";
import { generateToken } from "../../utility/token";
// admin authentication handling functions
export const postLogin = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield AdminCollection.findOne({ email });
    if (!admin || !(yield admin.checkPassword(password))) {
        throw new Error('invalid id or password');
    }
    const token = generateToken(res, admin._id, 'Admin');
    const userDetails = { name: 'Admin', email: admin.email, role: 'Admin' };
    res.status(200).json({
        success: true,
        token,
        user: userDetails
    });
}));
export const register = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield AdminCollection.create({ email: 'admin456@gmail.com', password: 'admin456' });
}));
