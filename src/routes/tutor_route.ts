import express from 'express'
import * as tutorCtrl from '../controllers/tutor/tutor_auth_controller.js'
import * as tutorProfCtrl from '../controllers/tutor/tutor_profile_controller.js'
import * as tutorCourseCtrl from '../controllers/tutor/tutor_course_controller.js'

import * as connCtrl from '../controllers/tutor/tutor_connection_controller.js'
import * as categoryCtrl from '../controllers/category_controller.js'
import * as videoCtrl from '../controllers/video_controller.js'
import * as adminCourseCtrl from '../controllers/admin/admin_course_controller.js'

import { isTutorAuthenticated, isTutorBlocked } from '../middlewares/auth_middleware.js'
import { coverUpload, tutorUpload } from '../config/multer.js'
import multer from 'multer'
import { authValidator } from '../middlewares/auth_validator_middleware.js'
import { registerValidator } from '../middlewares/register_validator_middleware.js'

const upload = multer()

export const tutorRouter = express.Router()

tutorRouter.post('/login',authValidator,tutorCtrl.login)
tutorRouter.post('/register',registerValidator,tutorCtrl.register)

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
tutorRouter.put('/update-course/:id', tutorCourseCtrl.updateCourse)

tutorRouter.get('/connections',connCtrl.getTutorConnections)
tutorRouter.get('/get-messages/:id',connCtrl.getMessages)

tutorRouter.get('/course/:id',  adminCourseCtrl.getSingleCourse)
tutorRouter.put('/course-cover/:id',coverUpload.single('cover'), adminCourseCtrl.updateCourseCover)

tutorRouter.put('/add-video',upload.array('file',1), videoCtrl.addVideo)
tutorRouter.get('/get-course-videos/:id',videoCtrl.getCourseVidoes)
tutorRouter.get('/get-video/:id',videoCtrl.getVideo)

tutorRouter.post('/add-section',videoCtrl.addSection)

tutorRouter.get('/category', categoryCtrl.getCategories)
tutorRouter.get('/sub-category', categoryCtrl.getSubCategories)
tutorRouter.post('/add-category', categoryCtrl.addCategory)
tutorRouter.post('/add-sub-category', categoryCtrl.addSubCategory)
