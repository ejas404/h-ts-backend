import express from 'express'
import * as adminCtrl from '../controllers/admin/admin_auth_controller.ts'
import * as dashCtrl from '../controllers/admin/admin_dashboard_controller.ts'
import * as adminCourseCtrl from '../controllers/admin/admin_course_controller.ts'
import * as courseCtrl from '../controllers/course_controller.ts'
import * as videoCtrl from '../controllers/video_controller.ts'
import { isAuthenticated } from '../middlewares/auth_middleware.ts'
import { coverUpload } from '../config/multer.ts'
import multer from 'multer'

const upload = multer()

export const adminRouter = express.Router()

adminRouter.post('/login', adminCtrl.postLogin)

adminRouter.use(isAuthenticated)
adminRouter.get('/users',  dashCtrl.getUsers)

adminRouter.delete('/users/:id', dashCtrl.deleteUser)
adminRouter.delete('/tutors/:id', dashCtrl.deleteTutor)

adminRouter.put('/users/block/:id',dashCtrl.blockUser)
adminRouter.put('/tutors/block/:id',dashCtrl.blockTutor)

adminRouter.put('/users/unblock/:id',dashCtrl.unblockUser)
adminRouter.put('/tutors/unblock/:id',dashCtrl.unblockTutor)

adminRouter.post('/add-course', adminCourseCtrl.addCourse)
adminRouter.get('/courses',  adminCourseCtrl.getCourses)
adminRouter.get('/course/:id',  adminCourseCtrl.getSingleCourse)
adminRouter.put('/update-course/:id', adminCourseCtrl.updateCourse)
adminRouter.put('/course-approve/:id', adminCourseCtrl.courseApprove)
adminRouter.put('/course-cover/:id', coverUpload.single('cover'), adminCourseCtrl.updateCourseCover)
adminRouter.put('/add-video',upload.array('file',1), videoCtrl.addVideo)

adminRouter.post('/add-section',videoCtrl.addSection)

adminRouter.get('/get-course-videos/:id',videoCtrl.getCourseVidoes)

adminRouter.get('/category', courseCtrl.getCategories)
adminRouter.post('/add-category', courseCtrl.addCategory)