import React from "react";
import { dummyTestimonial } from "../../assets/assets";
import { assets } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <div className="pb-14 px-8 md:px-0 text-center">
      <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
      <p className="md:text-base text-gray-500 mt-3">
        Hear from our learners as they share their journeys of transformation,
        success, and how our <br />
        platform has made a difference in their lives.
      </p>
      {/* Centering the cards */}
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] px-4 md:px-0 md:my-16 my-10 gap-4">
        {dummyTestimonial.map((testimonial, i) => (
          <div
            key={i}
            className="text-sm text-center border border-gray-500/30 pb-6 rounded-lg bg-white shadow-md shadow-black/5 overflow-hidden flex flex-col items-center"
          >
            <div className="flex flex-col items-center gap-4 px-5 py-4 bg-gray-500/10 w-full">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className="text-lg font-medium text-gray-800">
                  {testimonial.name}
                </h1>
                <p className="text-gray-800/80">{testimonial.role}</p>
              </div>
            </div>
            <div className="p-5 pb-7">
              <div className="flex justify-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    className="h-5"
                    key={i}
                    src={
                      i < Math.round(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
            <a href="#" className="text-blue-500 underline px-5">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
