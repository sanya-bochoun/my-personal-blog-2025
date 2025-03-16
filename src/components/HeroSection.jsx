import React from "react";
import heroImage from "../assets/16_9 img.png";

function HeroSection() {
  return (
    <div className="hero-wrapper flex flex-col justify-start items-center min-h-screen w-full">
      <div className="hero-container w-[375px] sm:container mx-auto">
        <div className="hero-content">
          <div className="hero-grid grid grid-cols-1 md:grid-cols-3 gap-[16px] md:gap-[60px]">
            {/* Left Section - Text right on larger screens, centered on mobile */}
            <div className="hero-text flex flex-col justify-center order-1 md:order-1 px-[24px] sm:px-8 lg:px-[120px] pt-[80px] md:pt-[60px]">
              <div className="h-[96px]">
                <h1 className="hero-title font-poppins text-[40px] sm:text-[40px] md:text-[52px] font-semibold leading-[48px] sm:leading-[48px] md:leading-[60px] text-center md:text-right text-[#26231E]">
                  Stay Informed,
                  <br />
                  Stay Inspired
                </h1>
              </div>
              <p className="hero-subtitle font-poppins text-[16px] md:text-[16px] font-medium leading-[24px] md:leading-[24px] text-center md:text-right text-[#75716B] mt-4">
                Discover a World of Knowledge at Your
                Fingertips. Your Daily Dose of Inspiration
                and Information.
              </p>
            </div>

            {/* Center Section - Image */}
            <div className="hero-image-wrapper flex items-center justify-center order-2 md:order-2 px-[16px] sm:px-8 lg:px-[120px] pt-[12px] pb-[0] md:py-[60px]">
              <div className="hero-image-container w-[343px] md:w-[386px] h-[470px] md:h-[529px] relative bg-[#FFFFFF] rounded-2xl overflow-hidden">
                <img
                  src={heroImage}
                  alt="Hero"
                  className="hero-image w-full h-full object-cover rounded-2xl"
                />
                <div className="hero-image-overlay absolute inset-0 bg-[#BEBBB1] opacity-25 rounded-2xl"></div>
              </div>
            </div>

            {/* Right Section - Author Bio */}
            <div className="author-section flex flex-col justify-center order-3 px-[16px] sm:px-8 lg:px-[120px] pb-[24px] md:pb-[60px] pt-[0]">
              <div className="author-card bg-[#F9F8F8] p-[16px] md:p-6 rounded-lg">
                <div className="author-label-wrapper flex items-start mb-2">
                  <span className="author-label h-[20px] font-poppins text-[12px] font-medium leading-[20px] text-[#75716B] text-left">
                    -Author
                  </span>
                </div>
                <h3 className="author-name h-[32px] font-poppins text-[24px] font-semibold leading-[32px] text-[#43403B] text-left mb-3">
                  Thompson P.
                </h3>
                <div>
                  <p className="author-bio font-poppins text-[16px] font-medium leading-[24px] text-[#75716B] text-left">
                    I am a pet enthusiast and freelance writer who specializes in
                    animal behavior and care. With a deep love for cats, I enjoy
                    sharing insights on feline companionship and wellness.
                  </p>
                  <p className="author-bio-extra font-poppins text-[16px] font-medium leading-[24px] text-[#75716B] text-left mt-4">
                    When I'm not writing, I spend time volunteering at my local
                    animal shelter, helping cats find loving homes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
