import express from 'express'
import * as tutorCtrl from '../controllers/tutor/tutor_auth_controller.ts'
import * as tutorProfCtrl from '../controllers/tutor/tutor_profile_controller.ts'
import * as tutorCourseCtrl from '../controllers/tutor/tutor_course_controller.ts'
import { isTutorAuthenticated, isTutorBlocked } from '../middlewares/auth_middleware.ts'
import { tutorUpload } from '../config/multer.ts'

export const tutorRouter = express.Router()

tutorRouter.post('/login', tutorCtrl.login)
tutorRouter.post('/register', tutorCtrl.register)

tutorRouter.use(isTutorAuthenticated, isTutorBlocked)
tutorRouter.get('/profile', tutorProfCtrl.getProfile)
tutorRouter.put('/update', tutorProfCtrl.updateProfile)
tutorRouter.put('/reset-password', tutorProfCtrl.resetPassword)
tutorRouter.put('/update-education',tutorProfCtrl.updateEducation)
tutorRouter.put('/update-pic',tutorUpload.single('profile'),tutorProfCtrl.updatePic)
tutorRouter.put('/update-tags',tutorProfCtrl.updateTags)
tutorRouter.delete('/delete-education/:id', tutorProfCtrl.deleteEducation)
tutorRouter.get('/courses', tutorCourseCtrl.getCourses)
tutorRouter.post('/request-course', tutorCourseCtrl.requestCourse)