import express from 'express'
import * as studentCtrl from '../controllers/student/student_auth_controller.js'
import * as studentProfCtrl from '../controllers/student/student_profile_controller.js'
import * as studentCourseCtrl from '../controllers/student/student_course_controller.js'
import * as videoCtrl from '../controllers/video_controller.js'
import * as checkoutCtrl from '../controllers/student/student_checkout_controller.js'
import * as paymentCtrl from '../controllers/student/student_payment_controller.js'
import * as enrollCtrl from '../controllers/student/student_enrollment_controller.js'
import * as connectionCtrl from '../controllers/student/student_connection_controller.js'
import * as oauthCtrl from '../controllers/oauth_controller.js'
import { isStudentAuthenticated, isStudentBlocked } from '../middlewares/auth_middleware.js'
import {studentUpload} from '../config/multer.js'
import { authValidator } from '../middlewares/auth_validator_middleware.js'
import { registerValidator } from '../middlewares/register_validator_middleware.js'


export const studentRouter = express.Router()

studentRouter.post('/register',registerValidator, studentCtrl.register)
studentRouter.post('/login',authValidator, studentCtrl.login)
studentRouter.get('/oauth',oauthCtrl.googleAuthenticate)

// studentRouter.get('/otp/:email',studentCtrl.getOtp)

studentRouter.use(isStudentAuthenticated,isStudentBlocked)
studentRouter.get('/profile', studentProfCtrl.getProfile)
studentRouter.put('/update', studentProfCtrl.updateProfile)
studentRouter.put('/reset-password', studentProfCtrl.resetPassword)
studentRouter.put('/update-pic',studentUpload.single('profile'),studentProfCtrl.updatePic)
studentRouter.get('/profile-image', studentProfCtrl.getProfileImage)

studentRouter.get('/get-video/:id',videoCtrl.getVideo)

studentRouter.put('/add-to-cart/:id',studentCourseCtrl.addToCart)
studentRouter.delete('/cart/remove/:id',studentCourseCtrl.removeFromCart)
studentRouter.get('/cart-list',studentCourseCtrl.cartList)
studentRouter.get('/cart',studentCourseCtrl.getCartDetails)


studentRouter.post('/checkout', checkoutCtrl.checkOut)
studentRouter.get('/payment',paymentCtrl.payment)
studentRouter.get('/payment/status/:id',paymentCtrl.paymentStatus)

studentRouter.get('/enroll-list', enrollCtrl.getEnrollList)
studentRouter.get('/enroll-cat', studentCourseCtrl.getEnrollSubCat)
studentRouter.get('/enroll-status/:id', enrollCtrl.enrollStatus)
studentRouter.get('/course-enroll/:id', enrollCtrl.isCourseEnrolled)
studentRouter.put('/rate-enrollment', enrollCtrl.rateCourse)

studentRouter.post('/add-progress', enrollCtrl.addProgress)
studentRouter.get('/get-progress/:id',enrollCtrl.getProgress)

studentRouter.get('/connections',connectionCtrl.connectedTutors)
studentRouter.get('/get-messages/:id',connectionCtrl.getMessages)




