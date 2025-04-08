import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { STYLES } from '../constants/styles';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('ออกจากระบบสำเร็จ');
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
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
                <div className="mr-4 text-sm">
                  สวัสดี, {user?.username || user?.full_name || 'ผู้ใช้'}
                </div>
                <button 
                  type="button"
                  onClick={handleLogout}
                  className={STYLES.components.navbar.buttons.login.desktop}
                >
                  Log out
                </button>
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
        // mobile-menu-dropdown -> 'block sm:hidden bg-[var(--background-color)] border-b border-[#DAD6D1] px-[24px] py-4 absolute w-full'
        <div className={STYLES.components.navbar.menu.mobile.dropdown}>
          {/* mobile-menu-buttons -> 'flex flex-col gap-3' */}
          <div className={STYLES.components.navbar.menu.mobile.buttons}>
            {isAuthenticated ? (
              <>
                <div className="text-sm mb-2 text-center">
                  สวัสดี, {user?.username || user?.full_name || 'ผู้ใช้'}
                </div>
                <button 
                  type="button"
                  onClick={handleLogout}
                  className={STYLES.components.navbar.buttons.login.mobile}
                >
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