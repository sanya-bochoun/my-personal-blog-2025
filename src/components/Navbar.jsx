import React, { useState } from 'react';
import logo from '../assets/logo.svg';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar-wrapper fixed top-0 left-0 right-0 bg-[var(--background-color)] border-b border-[#DAD6D1] z-10">
      <div className="navbar-container w-[375px] sm:container mx-auto">
        <div className="navbar-content h-[48px] sm:h-[80px] px-[24px] sm:px-8 lg:px-[120px] flex items-center justify-between">
          {/* Logo */}
          <div className="logo-wrapper flex items-center">
            <img src={logo} alt="logo" className="logo-image w-[24px] h-[24px] sm:w-[44px] sm:h-[44px]" />
          </div>
          
          {/* Hamburger Menu for Mobile */}
          <div className="mobile-menu block sm:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="mobile-menu-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg className="mobile-menu-open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
          
          {/* Buttons - Hide on Mobile, Show on larger screens */}
          <div className="desktop-buttons hidden sm:flex items-center gap-3">
            <button 
              type="button"
              className="login-button w-[130px] h-[48px] btn-secondary btn-secondary:hover btn-secondary:active text-sm font-medium flex items-center justify-center gap-[6px] py-3 px-10"
            >
              Log in
            </button>
            <button className="signup-button w-[143px] h-[48px] px-6 btn-primary btn-primary:hover btn-primary:active text-sm font-medium flex items-center justify-center gap-[6px] py-3">
              Sign up
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu-dropdown block sm:hidden bg-[var(--background-color)] border-b border-[#DAD6D1] px-[24px] py-4 absolute w-full">
          <div className="mobile-menu-buttons flex flex-col gap-3">
            <button 
              type="button"
              className="mobile-login-button w-full h-[40px] btn-secondary btn-secondary:hover btn-secondary:active text-sm font-medium flex items-center justify-center gap-[6px] py-2 px-6"
            >
              Log in
            </button>
            <button className="mobile-signup-button w-full h-[40px] btn-primary btn-primary:hover btn-primary:active text-sm font-medium flex items-center justify-center gap-[6px] py-2 px-6">
              Sign up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;