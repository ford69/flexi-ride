import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react';

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
              <a href="#" className="text-gray-400 hover:text-primary">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <InstagramIcon className="h-5 w-5" />
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