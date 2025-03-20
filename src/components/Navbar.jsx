import React, { useState } from 'react';
import defaultLogo from '../assets/logo.svg';
import { STYLES } from '../constants/styles';
import { cn } from "@/lib/utils";

function NavBar({
  logo = defaultLogo,
  loginText = "Log in",
  signupText = "Sign up",
  onLoginClick = () => {},
  onSignupClick = () => {}
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={cn("navbar", STYLES.components.navbar.wrapper)}>
      <div className={cn("navbar-container", `${STYLES.layout.container.mobile} ${STYLES.layout.container.desktop}`)}>
        <div className={cn("navbar-content", 
          STYLES.components.navbar.content,
          STYLES.components.navbar.container.height,
          STYLES.components.navbar.container.padding
        )}>
          {/* Logo Section */}
          <div className={cn("navbar-logo", STYLES.components.navbar.logo.wrapper)}>
            <img 
              src={logo} 
              alt="logo" 
              className={cn("navbar-logo-image", STYLES.components.navbar.logo.image)}
            />
          </div>
          
          {/* Mobile Menu Button */}
          <div className={cn("navbar-mobile-menu-button", STYLES.components.navbar.menu.mobile.button)}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-toggle-button"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg className="menu-close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg className="menu-open-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop Menu Buttons */}
          <nav className={cn("navbar-desktop-menu", STYLES.components.navbar.menu.desktop.wrapper)}>
            <button 
              type="button"
              className={cn("login-button", STYLES.components.navbar.buttons.login.desktop)}
              onClick={onLoginClick}
            >
              {loginText}
            </button>
            <button 
              className={cn("signup-button", STYLES.components.navbar.buttons.signup.desktop)}
              onClick={onSignupClick}
            >
              {signupText}
            </button>
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={cn("navbar-mobile-dropdown", STYLES.components.navbar.menu.mobile.dropdown)}>
          <nav className={cn("navbar-mobile-menu", STYLES.components.navbar.menu.mobile.buttons)}>
            <button 
              type="button"
              className={cn("mobile-login-button", STYLES.components.navbar.buttons.login.mobile)}
              onClick={onLoginClick}
            >
              {loginText}
            </button>
            <button 
              className={cn("mobile-signup-button", STYLES.components.navbar.buttons.signup.mobile)}
              onClick={onSignupClick}
            >
              {signupText}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavBar;