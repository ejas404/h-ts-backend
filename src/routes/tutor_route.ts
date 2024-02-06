import express from 'express'
import * as tutorCtrl from '../controllers/tutor/tutor_auth_controller.ts'
import * as tutorProfCtrl from '../controllers/tutor/tutor_profile_controller.ts'
import * as tutorCourseCtrl from '../controllers/tutor/tutor_course_controller.ts'

import * as connCtrl from '../controllers/tutor/tutor_connection_controller.ts'
import * as categoryCtrl from '../controllers/category_controller.ts'
import * as videoCtrl from '../controllers/video_controller.ts'

import { isTutorAuthenticated, isTutorBlocked } from '../middlewares/auth_middleware.ts'
import { tutorUpload } from '../config/multer.ts'
import multer from 'multer'

const upload = multer()

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

tutorRouter.get('/connections',connCtrl.getTutorConnections)
tutorRouter.get('/get-messages/:id',connCtrl.getMessages)

tutorRouter.put('/add-video',upload.array('file',1), videoCtrl.addVideo)
tutorRouter.get('/get-course-videos/:id',videoCtrl.getCourseVidoes)
tutorRouter.get('/get-video/:id',videoCtrl.getVideo)

tutorRouter.post('/add-section',videoCtrl.addSection)

tutorRouter.get('/category', categoryCtrl.getCategories)
tutorRouter.get('/sub-category', categoryCtrl.getSubCategories)
tutorRouter.post('/add-category', categoryCtrl.addCategory)
tutorRouter.post('/add-sub-category', categoryCtrl.addSubCategory)
