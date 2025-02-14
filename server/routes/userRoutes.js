import express from 'express'
import { getUserData, purchaseCourse, userEnrolledCourses } from './../Controllers/userController.js';

const userRouter = express.Router()

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)
userRouter.post('/purchase',purchaseCourse)

export default userRouter;