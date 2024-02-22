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
import studentCollection from "../../models/student_model.js";
import tutorCollection from "../../models/tutor_model.js";
export const getUsers = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userlist = yield studentCollection.find({}, { password: 0 });
    const tutorlist = yield tutorCollection.find({}, { password: 0 });
    res.status(200).json({ userlist, tutorlist });
}));
export const deleteUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield studentCollection.findByIdAndDelete(id);
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email
    });
}));
export const blockUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield studentCollection.findById(id);
    if (user) {
        user.isBlocked = true;
        user.save();
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    }
    else {
        res.status(404);
        throw new Error("User not found.");
    }
}));
export const unblockUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield studentCollection.findById(id);
    if (user) {
        user.isBlocked = false;
        user.save();
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    }
    else {
        res.status(404);
        throw new Error("User not found.");
    }
}));
export const deleteTutor = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield tutorCollection.findByIdAndDelete(id);
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email
    });
}));
export const blockTutor = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield tutorCollection.findById(id);
    if (user) {
        user.isBlocked = true;
        user.save();
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    }
    else {
        res.status(404);
        throw new Error("User not found.");
    }
}));
export const unblockTutor = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield tutorCollection.findById(id);
    if (user) {
        user.isBlocked = false;
        user.save();
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    }
    else {
        res.status(404);
        throw new Error("User not found.");
    }
}));
