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
        const userData = await User.findById(userId).populat('enrolledCourses')

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