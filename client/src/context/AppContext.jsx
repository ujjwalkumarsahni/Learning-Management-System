import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import {useAuth, useUser} from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY
    const [allCourses, setAllCourses] = useState([])
    const [isEducator,setIsEducator] = useState(false)
    const [enrolledCourses,setEnrolledCourses] = useState([])
    const [userData,setUserData] = useState(null)


    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()

    const {getToken} = useAuth()
    const {user} = useUser()

    // fetch all courses
    const fetchAllCourses = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/course/all`)

            if(data.success){
                setAllCourses(data.courses)
            }else{
                toast.error(data.message)
                console.log(data.message);
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error);
        }
    }

    // fetch user data
    const fetchUserData = async () => {
        if(user.publicMetadata.role === 'educator'){
            setIsEducator(true)
        }
        try {
            const token = await getToken()

            const {data} = await axios.get(`${backendUrl}/api/user/data`,{headers: {Authorization: `Bearer ${token}`}})

            if(data.success){
                setUserData(data.user)
            }else{
                toast.error(data.message)
                console.log(data.message);
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error);
            
        }
    }

    // fetch enrolledCourses data
    const fetchEnrolledCourses = async ()=>{
        try {
            const token = await getToken()

            const {data} = await axios.get(`${backendUrl}/api/user/enrolled-courses`,{headers: {Authorization: `Bearer ${token}`}})

            if(data.success){
                setEnrolledCourses(data.enrolledCourses.reverse())
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchAllCourses()
        
    }, [])

    // Function to calculate average rating
    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRatings.length === 0) {
            return 0;
        }
        const totalRating = course.courseRatings.reduce((sum, rating) => sum + rating.rating, 0);
        return Math.floor(totalRating / course.courseRatings.length);
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

    useEffect(()=>{
        if(user){
            fetchUserData()
            fetchEnrolledCourses()
        }
    },[user])


    const value = {
        currency, allCourses, navigate, calculateRating,isEducator,setIsEducator,CalculateNoOfLecture,CalculateCourseDuration,CalculateChaptarTime,fetchEnrolledCourses,enrolledCourses,

        backendUrl,userData,setUserData,getToken,fetchAllCourses
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}