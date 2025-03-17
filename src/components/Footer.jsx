import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';
import { STYLES } from '../constants/styles';

function Footer({
  contactText = "Get in touch",
  homeText = "Home page",
  homeUrl = "/",
  linkedInUrl = "https://linkedin.com", 
  githubUrl = "https://github.com",
  googleUrl = "mailto:example@gmail.com",
  iconSize = 24,
  iconColor = "currentColor",
}) {
  return (
    <footer className="bg-[var(--brown-200)] pt-[40px] pr-[16px] pb-[40px] pl-[16px] w-[375px] h-[152px] mx-auto">
      <div className="flex flex-col items-center justify-center space-y-[24px]">
        {/* Top row with heading and icons */}
        <div className="flex w-full justify-center items-center space-x-[40px]">
          {/* Contact heading */}
          <p className="font-poppins font-medium text-[16px] leading-[24px] text-[#43403B]">
            {contactText}
          </p>
          
          {/* Social media icons */}
          <div className="flex items-center space-x-3 cursor-pointer" >
            <a 
              href={linkedInUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#464440] hover:text-[#26231E] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={iconSize} color={iconColor} />
            </a>
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#464440] hover:text-[#26231E] transition-colors"
              aria-label="GitHub"
            >
              <Github size={iconSize} color={iconColor} />
            </a>
            <a 
              href={googleUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#464440] hover:text-[#26231E] transition-colors"
              aria-label="Email"
            >
              <Mail size={iconSize} color={iconColor} />
            </a>
          </div>
        </div>
        
        {/* Home page link */}
        <div>
          <a 
            href={homeUrl} 
            className="font-poppins font-medium text-[16px]  leading-[24px] text-[#43403B] no-underline cursor-pointer hover:text-[#26231E] transition-colors"
          >
            {homeText}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
