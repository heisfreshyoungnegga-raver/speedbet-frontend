import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

type Theme = 'green' | 'gold';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const headerRef = useRef<HTMLElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Sticky scroll behavior (hide on scroll down, show on scroll up)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
        setIsUserDropdownOpen(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const logoColor = theme === 'green' ? 'text-brand-green' : 'text-brand-gold';

  const publicNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/predictions', label: 'Predictions' },
    { path: '/promotions', label: 'Promotions' },
  ];

  const userNavLinks = [
    { path: '/my-bets', label: 'My Bets' },
    { path: '/wallet', label: 'Wallet' },
    { path: '/profile', label: 'Profile' },
    { path: '/referrals', label: 'Referrals' },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink 
          to="/" 
          className={`font-oswald text-2xl font-bold ${logoColor}`}
        >
          SpeedBet
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {publicNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium hover:text-brand-green transition-colors ${isActive ? 'text-brand-green' : 'text-gray-700'}`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated && userNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium hover:text-brand-green transition-colors ${isActive ? 'text-brand-green' : 'text-gray-700'}`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Admin Dashboard - never shown on auth pages, no Super Admin links */}
          {isAuthenticated && isAdmin && !isAuthPage && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium hover:text-brand-green transition-colors ${isActive ? 'text-brand-green' : 'text-gray-700'}`
              }
            >
              Admin Dashboard
            </NavLink>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'green' ? (
              <Sun className="w-5 h-5 text-brand-green" />
            ) : (
              <Moon className="w-5 h-5 text-brand-gold" />
            )}
          </button>

          {/* Auth State: Login/Register or User Avatar */}
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <NavLink
                to="/login"
                className="px-4 py-2 text-sm font-medium text-brand-green border border-brand-green rounded-md hover:bg-brand-green hover:text-white transition-colors"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-md hover:bg-brand-green/90 transition-colors"
              >
                Register
              </NavLink>
            </div>
          ) : (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                {user?.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    {user?.name}
                  </div>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2">
            {theme === 'green' ? (
              <Sun className="w-5 h-5 text-brand-green" />
            ) : (
              <Moon className="w-5 h-5 text-brand-gold" />
            )}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <NavLink 
                to="/" 
                className={`font-oswald text-2xl font-bold ${logoColor}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SpeedBet
              </NavLink>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {publicNavLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-base font-medium hover:text-brand-green ${isActive ? 'text-brand-green' : 'text-gray-700'}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated && userNavLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-base font-medium hover:text-brand-green ${isActive ? 'text-brand-green' : 'text-gray-700'}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated && isAdmin && !isAuthPage && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `text-base font-medium hover:text-brand-green ${isActive ? 'text-brand-green' : 'text-gray-700'}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </NavLink>
              )}

              {!isAuthenticated ? (
                <div className="flex flex-col gap-2 mt-4">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-center text-sm font-medium text-brand-green border border-brand-green rounded-md hover:bg-brand-green hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 text-center text-sm font-medium text-white bg-brand-green rounded-md hover:bg-brand-green/90 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
