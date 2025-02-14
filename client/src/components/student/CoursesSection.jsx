import React from 'react'
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard.jsx';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext.jsx';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our top-rated courses across various categories. From coding and design to <br /> business and wellness, our courses are crafted to deliver results.</p>
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] px-4 md:px-0 md:my-16 my-10 gap-4">
        {allCourses.slice(0, 4).map((course, idx) => (
          <CourseCard key={idx} course={course} />
        ))}
      </div>

      <Link to={'/course-list'} onClick={() => scrollTo(0, 0)} className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded'>Show all courses</Link>
    </div>
  )
}

export default CoursesSection
