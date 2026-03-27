import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import rootsproutLogo from '../assets/rootsprout-logo.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem('rs_token'));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Blogs', href: '/blogs' },
    { name: 'Videos', href: '/videos' },
    { name: 'Projects', href: '/projects' },
    { name: 'Books', href: '/books' },
    { name: 'Events', href: '/events' },
    { name: 'Partners', href: '/partners' },
    { name: 'Community', href: '/community' },
    { name: 'Sponsorship', href: '/sponsorship' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-black-deep border border-gold/40 glow-gold group-hover:glow-gold-strong transition-all flex items-center justify-center">
            <img src={rootsproutLogo} alt="Rootsprout logo" className="w-9 h-9 object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rootsprout</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`text-[13px] font-medium tracking-tight transition-colors ${location.pathname === link.href ? 'text-gold' : 'text-white/70 hover:text-gold'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              to="/home"
              className="bg-gold text-black-deep px-5 py-2 rounded-full text-[13px] font-bold glow-gold hover:glow-gold-strong hover:scale-105 transition-all"
            >
              Rootsprouthub
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[13px] font-medium text-white/70 hover:text-gold transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gold text-black-deep px-5 py-2 rounded-full text-[13px] font-bold glow-gold hover:glow-gold-strong hover:scale-105 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-white/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`text-base font-medium ${location.pathname === link.href ? 'text-gold' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              {isLoggedIn ? (
                <Link
                  to="/home"
                  className="bg-gold text-black-deep w-full py-3 rounded-xl text-sm font-bold text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Rootsprouthub
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gold text-black-deep w-full py-3 rounded-xl text-sm font-bold text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
              <Link
                to="/community"
                className="border border-white/10 text-white/80 w-full py-3 rounded-xl text-sm font-bold text-center hover:text-white hover:border-white/20 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join Community
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
