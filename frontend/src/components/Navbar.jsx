import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import defaultLogo from '../assets/default-logo.png';
import { STYLES } from '../constants/styles';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import NotificationBell from './NotificationBell';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('ออกจากระบบสำเร็จ');
    navigate('/');
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    // navbar-wrapper -> STYLES.components.navbar.wrapper
    // 'fixed top-0 left-0 right-0 bg-[var(--background-color)] border-b border-[#DAD6D1] z-10'
    <nav className={STYLES.components.navbar.wrapper}>
      {/* navbar-container -> Combined container styles */}
      {/* 'w-[375px]' + 'md:w-full sm:container mx-auto' */}
      <div className={`${STYLES.layout.container.mobile} ${STYLES.layout.container.desktop}`}>
        {/* navbar-content -> Combined content styles */}
        {/* 'flex items-center justify-between' + 'h-[48px] sm:h-[80px]' + 'px-[24px] sm:px-8 lg:px-[120px]' */}
        <div className={`
          navbar-content
          ${STYLES.components.navbar.content}           /* flex items-center justify-between */
          ${STYLES.components.navbar.container.height}  /* h-[48px] sm:h-[80px] */
          ${STYLES.components.navbar.container.padding} /* px-[24px] sm:px-8 lg:px-[120px] */
        `}>
          {/* Logo Section */}
          {/* logo-wrapper -> 'flex items-center' */}
          <Link to="/" className={STYLES.components.navbar.logo.wrapper}>
            {/* logo-image -> 'w-[24px] h-[24px] sm:w-[44px] sm:h-[44px]' */}
            <img 
              src={logo} 
              alt="logo" 
              className={STYLES.components.navbar.logo.image}
            />
          </Link>
          
          {/* Mobile Menu Button */}
          {/* mobile-menu -> 'block sm:hidden focus:outline-none' */}
          <div className={STYLES.components.navbar.menu.mobile.button}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button"
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
          
          {/* Desktop Menu Buttons */}
          {/* desktop-buttons -> 'hidden sm:flex items-center gap-3' */}
          <div className={STYLES.components.navbar.menu.desktop.wrapper}>
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-200">
                      <img 
                        src={user?.avatar_url || defaultLogo} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-[#26231E]">
                      {user?.username || user?.full_name || 'ผู้ใช้'} 
                    </span>
                    <svg className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="mr-3 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Profile
                      </button>
                      <button
                        onClick={() => handleNavigation('/reset-password')}
                        className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="mr-3 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Reset password
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="mr-3 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className={STYLES.components.navbar.buttons.login.desktop}
                >
                  Log in
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className={STYLES.components.navbar.buttons.signup.desktop}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={STYLES.components.navbar.menu.mobile.dropdown}>
          <div className={STYLES.components.navbar.menu.mobile.buttons}>
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-200 mr-3">
                      <img 
                        src={user?.avatar_url || defaultLogo} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-[#26231E]">
                      {user?.username || user?.full_name || 'ผู้ใช้'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <NotificationBell />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => handleNavigation('/profile')}
                  className="w-full text-left flex items-center py-2 text-gray-700"
                >
                  <svg className="mr-3 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </button>
                <button 
                  type="button"
                  onClick={() => handleNavigation('/reset-password')}
                  className="w-full text-left flex items-center py-2 text-gray-700"
                >
                  <svg className="mr-3 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Reset password
                </button>
                <button 
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left flex items-center py-2 text-gray-700"
                >
                  <svg className="mr-3 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Log out
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button"
                  onClick={() => handleNavigation('/login')}
                  className={STYLES.components.navbar.buttons.login.mobile}
                >
                  Log in
                </button>
                <button 
                  onClick={() => handleNavigation('/signup')}
                  className={STYLES.components.navbar.buttons.signup.mobile}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;