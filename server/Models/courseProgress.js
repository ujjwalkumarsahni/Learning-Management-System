import mongoose from 'mongoose'

const courseProgressSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    lectureCompleted: []

},{minimize: false})

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema)

export default CourseProgress