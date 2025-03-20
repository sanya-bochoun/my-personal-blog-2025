import React from 'react';
import logo from '../assets/logo.svg';

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[var(--background-color)] border-b border-[#DAD6D1]">
      <div className="max-w-[1440px] h-[80px] mx-auto px-6 md:px-8 lg:px-[120px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="logo" className="w-[44px] h-[44px]" />
        </div>
        
        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="w-[130px] h-[48px] btn-secondary btn-secondary:hover btn-secondary:active text-sm font-medium flex items-center justify-center gap-[6px] py-3 px-10"
          >
            Log in
          </button>
          <button className="w-[143px] h-[48px] px-6 btn-primary btn-primary:hover btn-primary:active text-sm font-medium flex items-center justify-center gap-[6px] py-3 ">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
