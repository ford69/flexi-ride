import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
            <Link to="/" className="flex items-center">
            <img src="/images/flexi-logo.png" alt="FlexiRide Logo" className="h-10 w-15" />
              
            </Link>
            </div>
            <p className="text-sm">
            Your premium ride-booking platform connecting you to trusted chauffeurs and top-tier transport providers across Ghana. Whether you're local or just visiting,ride with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/FlexiRide_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/rideflexi/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/rideflexi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="https://web.facebook.com/rideflexi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary">Home</Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-primary">Browse Cars</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-primary">Airport Pickups & Drop-offs</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-primary">Hourly Chauffeur Service</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-primary">City-to-City Rides</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-primary">Out-of-Town Trips</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-primary">Daily & Multi-Day Rentals</Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Accra, Ghana</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span>+233 (0) 54 278 2995</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span>info@flexiride.co</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} FlexiRide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
  };
  
  export default Footer;