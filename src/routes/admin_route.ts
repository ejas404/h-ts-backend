import express from 'express'
import * as adminCtrl from '../controllers/admin/admin_auth_controller.ts'
import * as dashCtrl from '../controllers/admin/admin_dashboard_controller.ts'
import * as courseCtrl from '../controllers/admin/admin_course_controller.ts'
import { isAuthenticated } from '../middlewares/auth_middleware.ts'
import { coverUpload } from '../config/multer.ts'

export const adminRouter = express.Router()

adminRouter.post('/login', adminCtrl.postLogin)

adminRouter.use(isAuthenticated)
adminRouter.get('/users',  dashCtrl.getUsers)
adminRouter.put('/users/update', dashCtrl.editUser)

adminRouter.delete('/users/:id', dashCtrl.deleteUser)
adminRouter.delete('/tutors/:id', dashCtrl.deleteTutor)

adminRouter.put('/users/block/:id',dashCtrl.blockUser)
adminRouter.put('/tutors/block/:id',dashCtrl.blockTutor)

adminRouter.put('/users/unblock/:id',dashCtrl.unblockUser)
adminRouter.put('/tutors/unblock/:id',dashCtrl.unblockTutor)

adminRouter.post('/add-course', courseCtrl.addCourse)
adminRouter.get('/courses',  courseCtrl.getCourses)
adminRouter.put('/course-cover/:id', coverUpload.single('cover'), courseCtrl.updateCourseCover)
adminRouter.get('/course/:id',  courseCtrl.getSingleCourse)
adminRouter.put('/update-course/:id', courseCtrl.updateCourse)
adminRouter.put('/course-approve/:id', courseCtrl.courseApprove)
