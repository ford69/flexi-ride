import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car as CarIcon, Star, Shield, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import CarFilter from '../components/cars/CarFilter';
import CarCard from '../components/cars/CarCard';
import { Car, CarFilter as FilterType } from '../types';
import { Helmet } from 'react-helmet-async';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

const HomePage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(buildApiUrl(API_ENDPOINTS.CARS.LIST));
        const data = await res.json();
        setCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
      }
    };

    fetchCars();
  }, []);

  const handleFilterChange = (filters: FilterType) => {
    let filtered = [...cars];

    if (filters.type) {
      filtered = filtered.filter(car => car.type === filters.type);
    }

    if (filters.location) {
      filtered = filtered.filter(car =>
        car.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(car => car.dailyRate >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(car => car.dailyRate <= filters.maxPrice!);
    }

    setFilteredCars(filtered);
  };

  return (
    <>
      <Helmet>
        <title>FlexiRide | Premium Car Rentals</title>
        <meta name="description" content="Book your perfect ride with FlexiRide. Premium car rental service for every journey. Browse luxury, comfort, and style on the road." />
        <meta name="keywords" content="car rental, premium cars, luxury cars, FlexiRide, rent a car" />
        <link rel="canonical" href="https://flexiride.co/" />
        {/* Open Graph */}
        <meta property="og:title" content="FlexiRide | Premium Car Rentals" />
        <meta property="og:description" content="Book your perfect ride with FlexiRide. Premium car rental service for every journey." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flexiride.co/" />
        <meta property="og:image" content="/images/flexiride.png" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FlexiRide | Premium Car Rentals" />
        <meta name="twitter:description" content="Book your perfect ride with FlexiRide. Premium car rental service for every journey." />
        <meta name="twitter:image" content="/images/flexiride.png" />
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        {/* Structured Data: Organization & LocalBusiness */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "FlexiRide",
            "image": "https://flexiride.co/images/flexiride.png",
            "@id": "https://flexiride.co/",
            "url": "https://flexiride.co/",
            "telephone": "+1-555-123-4567",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Street Name",
              "addressLocality": "City",
              "addressCountry": "Country"
            },
            "description": "Premium car rental service for every journey.",
            "logo": "https://flexiride.co/images/flexiride.png",
            "sameAs": [
              "https://facebook.com/yourpage",
              "https://instagram.com/yourpage"
            ]
          }
        `}</script>
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 bg-background-dark">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1213294/pexels-photo-1213294.jpeg"
              alt="Luxury car"
              className="w-full h-full object-cover object-center opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background-dark to-background-dark/50"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Premium Cars for Every Journey
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Book your perfect ride today and experience luxury, comfort, and style on the road.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cars">
                <Button variant="primary" size="lg">
                  Browse Cars
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Find Your Perfect Car</h2>

            <CarFilter onFilterChange={handleFilterChange} />

            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {filteredCars.map(car => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 mt-8 bg-background-light rounded-lg">
                <CarIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No cars found</h3>
                <p className="text-gray-400">Try adjusting your search filters</p>
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/cars">
                <Button variant="primary">View All Cars</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Choose FlexiRide</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-card p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Premium Selection</h3>
                <p className="text-gray-300">
                  Choose from a wide range of premium and luxury vehicles to match your style and preferences.
                </p>
              </div>

              <div className="bg-background-card p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure & Trusted</h3>
                <p className="text-gray-300">
                  All rentals are backed by comprehensive insurance coverage for your peace of mind.
                </p>
              </div>

              <div className="bg-background-card p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Flexible Rentals</h3>
                <p className="text-gray-300">
                  Book for a day, a week, or longer with easy extensions and modifications to your booking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Hit the Road?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers who have experienced our premium car rental service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/cars">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Browse Cars
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
