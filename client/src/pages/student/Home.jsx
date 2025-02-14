import React from 'react'
import Hero from '../../components/student/Hero.jsx'
import Companies from '../../components/student/Companies.jsx'
import CoursesSection from '../../components/student/CoursesSection.jsx'
import TestimonialsSection from '../../components/student/TestimonialsSection.jsx'
import CallToAction from '../../components/student/CallToAction.jsx'
import Footer from '../../components/student/Footer.jsx'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
        <Hero />
        <Companies />
        <CoursesSection />
        <TestimonialsSection />
        <CallToAction />
        <Footer />
    </div>
  )
}

export default Home