var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from "express-async-handler";
import { generateToken } from "../../utility/token.js";
import studentCollection from "../../models/student_model.js";
export const login = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield studentCollection.findOne({ email });
    let token = generateToken(res, user._id, 'Student');
    let userDetails = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        isBlocked: user.isBlocked
    };
    res.status(201).json({
        user: userDetails,
        token: token
    });
}));
export const register = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const user = yield studentCollection.create({ name, email, password });
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    });
}));
