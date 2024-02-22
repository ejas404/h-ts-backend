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
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import * as fs from 'fs';
import tutorCollection from "../../models/tutor_model.js";
import { isString } from "../../type_check/string.js";
export const getProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const userData = yield tutorCollection.findOne({ email: tutorReq.tutor.email }, { password: 0 });
    res.status(200).json(userData);
}));
export const updateProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const { name } = req.body;
    if (!isString(name))
        throw new Error('invalid name');
    const userData = yield tutorCollection.findOneAndUpdate({
        email: tutorReq.tutor.email
    }, {
        $set: { name }
    });
    res.status(200).json({ success: true, message: 'profile updated successfully' });
}));
export const resetPassword = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const { currentPassword, newPassword } = req.body;
    const userData = yield tutorCollection.findOne({ email: tutorReq.tutor.email });
    if (userData && (yield bcrypt.compare(currentPassword, userData.password))) {
        userData.password = newPassword;
        yield userData.save();
        res.status(200).json({ success: true, message: 'password updated successfully' });
    }
    else {
        throw new Error('password does not matches');
    }
}));
export const updateEducation = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const { university, stream, year, country } = req.body;
    const educationDetails = {
        ed_id: uuidv4(),
        university,
        stream,
        country,
        year: Number(year)
    };
    const tutorData = yield tutorCollection.findOne({ email: tutorReq.tutor.email });
    if (tutorData.education) {
        tutorData.education.push(educationDetails);
    }
    else {
        tutorData.education = [educationDetails];
    }
    yield tutorData.save();
    res.json({ educationDetails });
}));
export const updatePic = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const { email } = tutorReq.tutor;
    let tutor = yield tutorCollection.findOne({ email });
    if (!tutorReq.file)
        throw new Error('multer error need request file');
    if (!tutorReq.file.path)
        throw new Error('multer error');
    if (tutor.profile) {
        fs.unlink(tutor.profile, (err) => {
            if (err)
                throw new Error('profile image is not deleted');
        });
    }
    tutor.profile = tutorReq.file.path;
    tutor.save();
    res.json({ msg: 'profile image upadted successfully', path: tutorReq.file.path });
}));
export const updateTags = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const { email } = tutorReq.tutor;
    const { tag, list } = req.body;
    if (!tag || !list)
        throw new Error('Invalid request');
    const tagList = JSON.parse(list);
    if (Array.isArray(tagList)) {
        let tutor = yield tutorCollection.findOne({ email });
        if (tag in tutor)
            tutor[tag] = tagList;
        else
            throw new Error(`provided tag key is wrong ${tag}`);
        yield tutor.save();
        res.json({ msg: 'successfully updated', tutorTag: { tag, list: tagList } });
    }
    else {
        throw new Error('Invalid request');
    }
}));
export const deleteEducation = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorReq = req;
    const { email } = tutorReq.tutor;
    const { id } = req.params;
    if (!id)
        throw new Error('id is not found');
    let tutor = yield tutorCollection.findOne({ email });
    const education = tutor.education;
    if (!education)
        throw new Error('No education details have founded');
    let toDelete;
    tutor.education = education.filter((each) => {
        if (each.ed_id === id) {
            toDelete = each;
        }
        else {
            return each;
        }
    });
    if (!toDelete)
        throw new Error('education data is not founded');
    yield tutor.save();
    res.json({ toDelete });
}));
