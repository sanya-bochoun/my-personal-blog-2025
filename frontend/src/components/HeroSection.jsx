import React from "react";
import defaultHeroImage from "../assets/16_9 img.png";
import { STYLES } from "../constants/styles";
import { cn } from "@/lib/utils";

function HeroSection({
  heroImage = defaultHeroImage,
  title = "Stay Informed, Stay Inspired",
  subtitle = "Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.",
  authorLabel = "-Author",
  authorName = "Thompson P.",
  authorBio = "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.",
  authorExtraBio = "When I'm not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.",
}) {
  return (
    <section className={cn("hero-section", STYLES.layout.wrapper)}>
      <div className={cn("hero-container", `${STYLES.layout.container.mobile} ${STYLES.layout.container.desktop}`)}>
        <div className="hero-content w-full px-4 md:px-6 lg:px-8">
          <div className={cn("hero-content-wrapper", "flex flex-col md:flex-row items-center justify-between w-full gap-[16px] md:gap-[48px] md:mt-[100px]")}>
            
            {/* Left Section - Text */}
            <article className={cn("hero-text-section", STYLES.layout.flex, "w-full md:w-1/3 mt-[80px] md:mt-[60px]")}>
              <div className={cn("hero-text-card", STYLES.components.card.base, STYLES.components.card.padding, "text-right w-full")}>
                <div className="title-container h-[96px] md:h-auto">
                  <h1 className={cn("hero-title", STYLES.typography.heading.base, STYLES.typography.heading.size, "text-center md:text-right")}>
                    {title}
                  </h1>
                </div>
                <p className={cn("hero-subtitle", STYLES.typography.body.base, STYLES.typography.body.size, "mt-4 text-center md:text-right")}>
                  {subtitle}
                </p>
              </div>
            </article>

            {/* Center Section - Image */}
            <figure className={cn("hero-image-wrapper", "flex items-center justify-center w-full md:w-1/3 mt-4 md:mt-[60px]")}>
              <div className={cn("hero-image-container", "relative bg-[#FFFFFF] rounded-2xl overflow-hidden w-[343px] h-[470px] md:w-[386px] md:h-[529px]")}>
                <img
                  src={heroImage}
                  alt="Hero"
                  className="hero-image w-full h-full object-cover rounded-2xl"
                />
                <div className={cn("hero-image-overlay", STYLES.components.image.overlay)}></div>
              </div>
            </figure>

            {/* Right Section - Author Bio */}
            <aside className={cn("author-section", STYLES.layout.flex, "w-full md:w-1/3 pb-[24px] md:pb-0 mt-4 md:mt-[60px]")}>
              <div className={cn("author-card", STYLES.components.card.base, STYLES.components.card.padding, "text-left w-full")}>
                <div className="author-label-wrapper flex items-start mb-2">
                  <span className={cn("author-label", STYLES.typography.label.base, STYLES.typography.label.size, "h-[20px]")}>
                    {authorLabel}
                  </span>
                </div>
                
                <h3 className={cn("author-name", STYLES.typography.heading.base, "text-[24px] font-semibold leading-[32px] text-left mb-3")}>
                  {authorName}
                </h3>
                
                <div className="author-bio-container">
                  <p className={cn("author-bio", STYLES.typography.body.base, STYLES.typography.body.size, "text-left")}>
                    {authorBio}
                  </p>
                  <p className={cn("author-bio-extra", STYLES.typography.body.base, STYLES.typography.body.size, "text-left mt-4")}>
                    {authorExtraBio}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
