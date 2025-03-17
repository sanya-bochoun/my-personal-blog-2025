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
    <footer className="absolute left-0 right-0 w-full bg-[var(--brown-200)] pt-[40px] pb-[40px] md:py-[60px] md:px-[120px] md:h-[144px] border-b border-[#26231E]">
      <div className="h-full flex flex-col md:flex-row md:justify-between md:items-center">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center space-x-6">
          <p className={`${STYLES.typography.body1.base} ${STYLES.typography.body1.size}`}>
            {contactText}
          </p>
          
          <div className="flex items-center space-x-3">
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
        
        {/* Home page link - Desktop */}
        <div className="hidden md:block">
          <a 
            href={homeUrl} 
            className={`${STYLES.typography.body1.base} ${STYLES.typography.body1.size} no-underline hover:text-[#26231E] transition-colors`}
          >
            {homeText}
          </a>
        </div>
        
        {/* Mobile layout */}
        <div className="flex flex-col md:hidden items-center justify-center space-y-[24px]">
          {/* Top row with heading and icons */}
          <div className="flex w-full justify-center items-center space-x-[20px]">
            {/* Contact heading */}
            <p className={`${STYLES.typography.body1.base} ${STYLES.typography.body1.size}`}>
              {contactText}
            </p>
            
            {/* Social media icons */}
            <div className="flex items-center space-x-3">
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
          
          {/* Home page link - Mobile */}
          <div>
            <a 
              href={homeUrl} 
              className={`${STYLES.typography.body1.base} ${STYLES.typography.body1.size} no-underline decoration-solid decoration-[0%] underline-offset-[0%] hover:text-[#26231E] transition-colors md:no-underline`}
            >
              {homeText}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
