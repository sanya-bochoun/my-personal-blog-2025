import React from "react";
import heroImage from "../assets/16_9 img.png";
import { STYLES } from "../constants/styles";

function HeroSection() {
  return (
    // hero-wrapper -> STYLES.layout.wrapper
    // 'flex flex-col justify-start items-center min-h-screen w-full'
    <div className={STYLES.layout.wrapper}>
      {/* hero-container -> STYLES.layout.container */}
      {/* 'w-[375px]' + 'md:w-full sm:container mx-auto' */}
      <div
        className={`${STYLES.layout.container.mobile} ${STYLES.layout.container.desktop}`}
      >
        <div className="hero-content w-full px-4 md:px-6 lg:px-8">
          {/* hero-grid -> เปลี่ยนเป็น flexbox */}
          <div
            className={`
            hero-content-wrapper
            flex flex-col md:flex-row
            items-center justify-between
            w-full
            gap-[16px] md:gap-[48px] md:mt-[100px]
          `}
          >
            {/* Left Section - Text */}
            <div
              className={`
              hero-text
              ${STYLES.layout.flex}
              w-full md:w-1/3
              mt-[80px]
              md:mt-[60px]
            `}
            >
              <div
                className={`
                hero-text-card
                ${STYLES.components.card.base}
                ${STYLES.components.card.padding}
                text-right
                w-full
              `}
              >
                <div className="h-[96px] md:h-auto">
                  <h1
                    className={`
                    hero-title
                    ${STYLES.typography.heading.base}
                    ${STYLES.typography.heading.size}
                    text-center md:text-right
                  `}
                  >
                    Stay Informed,
                    <br />
                    Stay Inspired
                  </h1>
                </div>
                <p
                  className={`
                  hero-subtitle
                  ${STYLES.typography.body.base}
                  ${STYLES.typography.body.size}
                  mt-4
                  text-center md:text-right
                `}
                >
                  Discover a World of Knowledge at Your
                  <br />
                  Fingertips. Your Daily Dose of Inspiration
                  <br />
                  and Information.
                </p>
              </div>
            </div>

            {/* Center Section - Image */}
            <div
              className={`
              hero-image-wrapper
              flex items-center justify-center
              w-full md:w-1/3
              mt-4 md:mt-[60px]
            `}
            >
              {/* hero-image-container -> Combined image styles */}
              <div
                className={`
                hero-image-container
                relative bg-[#FFFFFF] rounded-2xl overflow-hidden
                w-[343px] h-[470px]                 /* ขนาดสำหรับ mobile */
                md:w-[386px] md:h-[529px]          /* ขนาดตาม spec 386x529 */
              `}
              >
                <img
                  src={heroImage}
                  alt="Hero"
                  className="hero-image w-full h-full object-cover rounded-2xl"
                />
                <div className={STYLES.components.image.overlay}></div>
              </div>
            </div>

            {/* Right Section - Author Bio */}
            <div
              className={`
              author-section
              ${STYLES.layout.flex}
              w-full md:w-1/3
              pb-[24px] md:pb-0
              mt-4 md:mt-[60px]
            `}
            >
              {/* author-card -> Combined card styles */}
              <div
                className={`
                author-card
                ${STYLES.components.card.base}         /* bg-[#F9F8F8] rounded-lg */
                ${STYLES.components.card.padding}      /* p-[16px] md:p-6 */
                text-left
                w-full                              /* เพิ่ม w-full เพื่อให้เต็มความกว้าง */
              `}
              >
                <div className="author-label-wrapper flex items-start mb-2">
                  {/* author-label -> Combined label styles */}
                  <span
                    className={`
                    author-label
                    h-[20px]
                    ${STYLES.typography.label.base}    /* font-poppins font-medium text-[#75716B] text-left */
                    ${STYLES.typography.label.size}    /* text-[12px] leading-[20px] */
                  `}
                  >
                    -Author
                  </span>
                </div>
                {/* author-name -> Combined heading styles */}
                <h3
                  className={`
                  author-name
                  ${STYLES.typography.heading.base}    /* font-poppins font-semibold text-[#26231E] */
                  text-[24px] font-semibold leading-[32px]
                  text-left
                  mb-3
                `}
                >
                  Thompson P.
                </h3>
                <div>
                  {/* author-bio -> Combined body text styles */}
                  <p
                    className={`
                    author-bio
                    ${STYLES.typography.body.base}     /* font-poppins font-medium text-[#75716B] */
                    ${STYLES.typography.body.size}     /* text-[16px] leading-[24px] */
                    text-left
                  `}
                  >
                    I am a pet enthusiast and freelance writer who specializes
                    in animal behavior and care. With a deep love for cats, I
                    enjoy sharing insights on feline companionship and wellness.
                  </p>
                  <p
                    className={`
                    author-bio-extra
                    ${STYLES.typography.body.base}     /* font-poppins font-medium text-[#75716B] */
                    ${STYLES.typography.body.size}     /* text-[16px] leading-[24px] */
                    text-left
                    mt-4
                  `}
                  >
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