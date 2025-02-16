import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../Controllers/educatorController.js'
import { protectEducator } from './../middlewares/authMiddlewares.js';
import upload from './../configs/multer.js';

const educatorRoute = express.Router()

// add educator role
educatorRoute.get('/update-role',updateRoleToEducator)
educatorRoute.post('/add-course',upload.single('image'),protectEducator,addCourse)
educatorRoute.get('/dashboard',protectEducator,educatorDashboardData)
educatorRoute.get('/enrolled-students',protectEducator,getEnrolledStudentsData)
educatorRoute.get('/courses',protectEducator,getEducatorCourses)

export default educatorRoute;