
import asyncHandler from "express-async-handler"
import studentCollection from "../../models/student_model.ts";
import tutorCollection from "../../models/tutor_model.ts";
import { StudentModelType } from "types/student_type.ts";
import { TutorDeleteRes, TutorModelType } from "types/tutor_type.ts";


export const getUsers = asyncHandler(async (req, res) => {
    const userlist = await studentCollection.find({}, { password: 0 });
    const tutorlist = await tutorCollection.find({}, { password: 0 })
    res.status(200).json({ userlist, tutorlist });
})



export const editUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await studentCollection.findOne({ email });

    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        });

    } else {
        res.status(404);
        throw new Error("User not found.");
    }
})


export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user : StudentModelType = await studentCollection.findByIdAndDelete(id) as unknown as StudentModelType
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    res.status(200).json({
        _id : user._id,
        name: user.name,
        email: user.email
    });
});


export const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await studentCollection.findById(id);
    if (user) {

        user.isBlocked = true
        user.save()


        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});


export const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await studentCollection.findById(id);
    if (user) {

        user.isBlocked = false
        user.save()


        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});


export const deleteTutor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await tutorCollection.findByIdAndDelete(id) as unknown as TutorModelType

    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }
    res.status(200).json({
        tutor: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    });
});


export const blockTutor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await tutorCollection.findById(id);
    if (user) {

        user.isBlocked = true
        user.save()


        res.status(200).json({
            tutor: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});


export const unblockTutor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await tutorCollection.findById(id);
    if (user) {

        user.isBlocked = false
        user.save()


        res.status(200).json({
            tutor: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});



