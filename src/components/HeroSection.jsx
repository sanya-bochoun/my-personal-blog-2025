import React from 'react'
import heroImage from '../assets/16_9 img.png'

function HeroSection() {
  return (
    <div className="container mx-auto px-4 py-[60px] flex justify-center items-center min-h-screen">
      <div className="max-w-[1200px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[60px] h-full">
          {/* Left Section */}
          <div className="flex flex-col justify-center">
            <h1 className="font-poppins text-[52px] font-semibold leading-[60px] text-right text-[#26231E] mb-6">
              Stay
              <br />
              Informed,
              <br />
              Stay Inspired
            </h1>
            <p className="font-poppins text-[16px] font-medium leading-[24px] text-right text-[#757168]">
              Discover a World of Knowledge at Your
              <br />
              Fingertips. Your Daily Dose of Inspiration
              <br />
              and Information.
            </p>
          </div>

          {/* Center Section - Image */}
          <div className="flex items-center justify-center">
            <div className="w-[386px] h-[529px] relative bg-[#FFFFFF] rounded-2xl overflow-hidden">
              <img 
                src={heroImage}
                alt="Hero" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#BEBBB1] opacity-25"></div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-center">
            <div className="bg-[#F9F8F8] p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-poppins text-[12px] font-medium leading-[20px] text-[#757168]">~Author</span>
              </div>
              <h3 className="font-poppins text-[24px] font-semibold leading-[32px] text-[#26231E] mb-2">Thompson P.</h3>
              <p className="font-poppins text-[16px] font-medium leading-[24px] text-[#757168] mb-4">
                I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
              </p>
              <p className="font-poppins text-[16px] font-medium leading-[24px] text-[#757168]">
                When I'm not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
