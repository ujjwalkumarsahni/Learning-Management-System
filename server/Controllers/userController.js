import Course from "../Models/Course.js";
import CourseProgress from "../Models/courseProgress.js";
import User from "../Models/User.js"
import Purchase from './../Models/Purchase.js';
import Stripe from 'stripe';
// get user data
export const getUserData = async (req,res) =>{
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if(!user){
            return res.json({success: false,message: "User not found"})
        }

        res.json({success: true, user})

    } catch (error) {
        res.json({success: false,message: error.message})
    }
}

// users enrolled courses with lecture links
export const userEnrolledCourses = async (req,res) =>{
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        res.json({success: true, enrolledCourses: userData.enrolledCourses})

    } catch (error) {
        res.json({success: false,message: error.message})
    }
}


// purchase course
export const purchaseCourse = async (req,res) =>{
    try {
        const {courseId} = req.body;
        const {origin} = req.headers;
        const userId = req.auth.userId;
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData || courseData){
            return res.json({success: false, message: "Data not found"})
        }
        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * coursePrice / 100).toFixed(2)
        }

        const newPurchase = await Purchase.create(purchaseData)

        // stripe gatway initilize
        const stripeInstance = new Stripe(precess.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase()

        // creaating line item to for stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }] 

        const session = await stripeInstance({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            made: "payment",
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })


        res.json({success: true, success_url: session.url})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


// Update user course progress
export const updateUserCourseProgress = async (req,res) =>{
    try {
        const userId = req.auth.body
        const {courseId, lectureId} = req.body

        const progressData = await CourseProgress.findOne({userId,courseId})
        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: false, message: 'Lecture already completed.'})
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }else{
            await CourseProgress.create(
                {
                userId,courseId,lectureCompleted: [lectureId] 
                }
            )
        }

        res.json({success: true, message: "Progress Updated"})
        
    }
    catch (error) {
        res.json({success: false, message: error.message})
    }
}


// get userProgress detail
export const getUserCourseProgress = async (req,res) =>{
    try {
        const userId = req.auth.body
        const {courseId} = req.body

        const progressData = await CourseProgress.findOne({userId,courseId})

        res.json({success: true, progressData})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


// add user rationg
export const addUserRationg = async (req,res) =>{
    const userId = req.auth.userId
    const {courseId,rating} = req.body

    if(!courseId || !userId || !rating || rating < 1 || rating > 5){
        return res.json({success: false, message: "Invalid details" })
    }

    try {
        const course = await Course.findById(courseId)

        if(!course){
            return res.json({success: false, message: "Course not found" })
        }
        const user = await User.findById(userId)

        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success: false, message: "User has not purchased this course"})
        }

        const existingRationgIndex = course.courseRatings.findIndex(r => r.userId === userId)

        if(existingRationgIndex > -1){
            course.courseRatings[existingRationgIndex].rating = rating
        }else{
            course.courseRatings.push({userId,rating})
        }

        await course.save()

        return res.json({success: true, message: "Rating Addad"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}