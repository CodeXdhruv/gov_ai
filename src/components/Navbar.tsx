import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, LayoutDashboard, Clock, Menu, X, Home, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, protected: true },
    { path: '/history', label: 'History', icon: Clock, protected: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Don't show navbar on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="GovAI Logo" 
              className="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Gov<span className="text-amber-500">AI</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Electricity Theft Detection</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              // Only show protected links if authenticated
              if (link.protected && !isAuthenticated) return null;
              
              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                </div>
                
                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
                
                {/* Signup Button */}
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg transition-all shadow-sm"
                  >
                    <Zap className="w-4 h-4" />
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 border-t border-slate-100 pt-4"
          >
            <div className="space-y-2">
              {navLinks.map((link) => {
                if (link.protected && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(link.path)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 mb-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-slate-600 font-medium px-4 py-3 rounded-lg hover:bg-slate-50 transition-all">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-3 rounded-lg transition-all">
                      <Zap className="w-4 h-4" />
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
