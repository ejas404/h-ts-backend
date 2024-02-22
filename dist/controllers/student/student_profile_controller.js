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
import bcrypt from 'bcrypt';
import * as fs from 'fs';
import studentCollection from "../../models/student_model.js";
// request type has been assigned to any need to find the soulution to clear that
export const getProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield studentCollection.findOne({
        email: req.user.email
    }, {
        password: 0,
        twofactor: 0
    });
    res.status(200).json(userData);
}));
export const updateProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentReq = req;
    const { name, email, contact } = req.body;
    const userData = yield studentCollection.findOneAndUpdate({ email: studentReq.user.email }, { $set: { name, email, contact } });
    res.status(200).json({ success: true, message: 'profile updated successfully' });
}));
export const resetPassword = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentReq = req;
    const { currentPassword, newPassword } = req.body;
    const userData = yield studentCollection.findOne({ email: studentReq.user.email });
    if (userData && (yield bcrypt.compare(currentPassword, userData.password))) {
        userData.password = newPassword;
        yield userData.save();
        res.status(200).json({ success: true, message: 'password updated successfully' });
    }
    else {
        throw new Error('password does not matches');
    }
}));
export const updatePic = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentReq = req;
    const { email } = studentReq.user;
    let student = yield studentCollection.findOne({ email });
    if (!studentReq.file)
        throw new Error('multer error need request file');
    if (!studentReq.file.path) {
        throw new Error('multer error');
    }
    if (student.profile) {
        fs.unlink(student.profile, (err) => {
            if (err)
                throw new Error('profile image is not deleted');
            console.log('file removed successfully');
        });
    }
    student.profile = studentReq.file.path;
    student.save();
    res.json({ msg: 'profile image upadted successfully', path: studentReq.file.path });
}));
export const getProfileImage = asyncHandler((req, res) => {
    const studentReq = req;
    if (studentReq.user.profile) {
        return res.sendFile(studentReq.user.profile);
    }
    res.sendStatus(404);
});
