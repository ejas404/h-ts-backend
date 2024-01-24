import express from 'express'
import * as studentCtrl from '../controllers/student/student_auth_controller.ts'
import * as studentProfCtrl from '../controllers/student/student_profile_controller.ts'
import * as studentCourseCtrl from '../controllers/student/student_course_controller.ts'
import * as videoCtrl from '../controllers/video_controller.ts'
import { isStudentAuthenticated, isStudentBlocked } from '../middlewares/auth_middleware.ts'
import {studentUpload} from '../config/multer.ts'


export const studentRouter = express.Router()

studentRouter.post('/register', studentCtrl.register)
studentRouter.post('/login', studentCtrl.login)
// studentRouter.get('/otp/:email',studentCtrl.getOtp)

studentRouter.use(isStudentAuthenticated,isStudentBlocked)
studentRouter.get('/profile', studentProfCtrl.getProfile)
studentRouter.put('/update', studentProfCtrl.updateProfile)
studentRouter.put('/reset-password', studentProfCtrl.resetPassword)
studentRouter.put('/update-pic',studentUpload.single('profile'),studentProfCtrl.updatePic)
studentRouter.get('/profile-image', studentProfCtrl.getProfileImage)

studentRouter.get('/get-video/:id',videoCtrl.getVideo)

studentRouter.put('/add-to-cart/:id',studentCourseCtrl.addToCart)
studentRouter.get('/cart',studentCourseCtrl.getCartDetails)