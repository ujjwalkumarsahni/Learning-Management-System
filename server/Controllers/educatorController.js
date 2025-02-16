import {clerkClient} from '@clerk/express'
import Course from './../Models/Course.js';
import {v2 as cloudinary} from 'cloudinary'
import Purchase from './../Models/Purchase.js';
import User from './../Models/User.js';

// update role to educator
export const updateRoleToEducator = async (req,res) =>{
    try {
        const userId = req.auth?.userId; // Correct way to get user ID
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "A valid resource ID is required" });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { role: 'educator' }
        });

        res.json({ success: true, message: "You can publish a course now" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


// Add new Course
export const addCourse = async (req,res) =>{
    try {
        const { courseData } = req.body;
        const imageFile = req.file;

        // Extract educator ID from authentication middleware
        const educatorId = req.auth?.userId || req.auth?.id;

        if (!educatorId) {
            return res.status(400).json({ success: false, message: "Educator ID is missing" });
        }

        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Thumbnail Not Attached" });
        }

        // Parse the course data
        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = educatorId; // Assign educator ID

        // Create new course
        const newCourse = await Course.create(parsedCourseData);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        newCourse.courseThumbnail = imageUpload.secure_url;

        await newCourse.save();

        res.json({ success: true, message: "Course Added", course: newCourse });

    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// get educator course
export const getEducatorCourses = async (req,res) =>{
    try {
       const educator = req.auth.userId
       const courses = await Course.find({educator})
       res.json({success: true, courses})
        
    } catch (error) {
        res.json({success: false,message: error.message})
    }
} 


// get educator dashboard data (total earning , enrolled student , no. of courses)
export const educatorDashboardData = async (req,res) =>{
    try {
        const educator = req.auth.userId
       const courses = await Course.find({educator})
       const totalCourses = courses.length

       const courseIds = courses.map(course => course._id)

       const purchases = await Purchase.find({
        courseId: {$in: courseIds},
        status: "Completed"
       })

       const totalEarnings = purchases.reduce((sum,purchase) => sum + purchase.amount, 0)

       const enrolledStudentsData = []
       for(const course of courses){
        const students = await User.find({
            _id: {$in: course.enrolledStudents}
        },'name imageUrl')

        students.forEach(student => {
            enrolledStudentsData.push({
                courseTitle: course.courseTitle,
                student
            })
        })
       }

       res.json({success: true, dashboardData: {
        totalEarnings,enrolledStudentsData,totalCourses
       }})

    } catch (error) {
        res.json({success: false,message: error.message})
    }
}

// get enrolledStudent data with purchase data
export const getEnrolledStudentsData = async (req,res) => {
    try {

       const educator = req.auth.userId
       const courses = await Course.find({educator})

       const courseIds = courses.map(course => course._id)

       const purchases = await Purchase.find({
        courseId: {$in: courseIds},
        status: "Completed"
       }).populate('userId','name imageUrl').populate('courseId','courseTitle')

       const enrolledStudents = purchases.map(purchase => ({
        sturdent: purchase.userId,
        courseTitle: purchase.courseId.courseTitle,
        purchaseDate: purchase.createdAt
       }))

       res.json({success: true, enrolledStudents})
        
    } catch (error) {
        res.json({success: false,message: error.message})
    }
}