import express from 'express'
import * as adminCtrl from '../controllers/admin/admin_auth_controller.ts'
// import * as dashCtrl from '../controllers/admin/dashboard.js'
// import * as courseCtrl from '../controllers/admin/course.js'
// import { isAuthenticated } from '../middlewares/auth_middlware.js'
// import { coverUpload } from '../config/multer.js'

export const adminRouter = express.Router()

adminRouter.post('/login', adminCtrl.postLogin)
