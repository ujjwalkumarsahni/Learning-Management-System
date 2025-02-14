import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY
    const [allCourses, setAllCourses] = useState([])
    const [isEducator,setIsEducator] = useState(true)
    const [enrolledCourses,setEnrolledCourses] = useState([])

    const navigate = useNavigate()

    // fetch all courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    }

    // fetch enrolledCourses data
    const fetchEnrolledCourses = async ()=>{
        setEnrolledCourses(dummyCourses)
    }

    useEffect(() => {
        fetchAllCourses()
        fetchEnrolledCourses()
    }, [])

    // Function to calculate average rating
    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRatings.length === 0) {
            return 0;
        }
        const totalRating = course.courseRatings.reduce((sum, rating) => sum + rating.rating, 0);
        return totalRating / course.courseRatings.length;
    };

    // Function to calculate course chapter time 
    const CalculateChaptarTime = (chapter)=>{
        let time = 0;
        chapter.chapterContent.map((lecture)=>time += lecture.lectureDuration)

        return humanizeDuration(time * 60 * 1000,{units: ['h','m']})
    }

    // Function to calculate course chapter time 
    const CalculateCourseDuration = (course)=>{
        let time = 0;
        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture)=>time += lecture.lectureDuration))

        return humanizeDuration(time * 60 * 1000,{units: ['h','m']})
    }

     // Function to No of lecture in the course 
     const CalculateNoOfLecture = (course)=>{
        let totalLectures = 0;
        course.courseContent.forEach((chapter) => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        })
        return totalLectures
    }


    const value = {
        currency, allCourses, navigate, calculateRating,isEducator,setIsEducator,CalculateNoOfLecture,CalculateCourseDuration,CalculateChaptarTime,fetchEnrolledCourses,enrolledCourses
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}