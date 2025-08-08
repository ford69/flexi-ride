import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { Helmet } from 'react-helmet-async';
import LandingBookingForm from '../components/bookings/LandingBookingForm';

const HomePage: React.FC = () => {
  const [animatedCards, setAnimatedCards] = useState<boolean[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setAnimatedCards(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Initialize animatedCards array for 6 cards
    if (animatedCards.length === 0) {
      setAnimatedCards(new Array(6).fill(false));
    }

    cardsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [animatedCards.length]);

  // Handle navigation clicks
  useEffect(() => {
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const sectionId = target.getAttribute('href')?.substring(1);
        if (sectionId) {
          scrollToSection(sectionId);
        }
      }
    };

    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, []);

  // const handleFilterChange = (filters: FilterType) => {
  //   let filtered = [...cars];
  //   if (filters.type) {
  //     filtered = filtered.filter(car => car.type === filters.type);
  //   }
  //   if (filters.location) {
  //     filtered = filtered.filter(car =>
  //       car.location.toLowerCase().includes(filters.location!.toLowerCase())
  //     );
  //   }
  //   if (filters.minPrice !== undefined) {
  //     filtered = filtered.filter(car => car.dailyRate >= filters.minPrice!);
  //   }
  //   if (filters.maxPrice !== undefined) {
  //     filtered = filtered.filter(car => car.dailyRate <= filters.maxPrice!);
  //   }
  //   setFilteredCars(filtered);
  // };

  // Contact form handler
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactLoading(true);
    setTimeout(() => {
      setContactLoading(false);
      // You can add a success message or redirect here
    }, 1200);
  };

  return (
    <>
      {contactLoading && <Loader />}
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
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background image with dark green overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="/images/accra.webp"
              alt="Luxury car background"
              className="w-full h-full object-cover object-center scale-110"
            // animate-pulse
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40"></div>
          </div>

          {/* Floating elements for animation */}
          {/* <div className="absolute inset-0 z-5">
            <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-green-300/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-500/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          </div> */}

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
            {/* Left: Tagline, headline, text, buttons, stats */}
            <div className="flex-1 flex flex-col items-start justify-center text-left max-w-xl lg:max-w-2xl">
              {/* <div className="mb-6 animate-fade-in-up">
                <span className="inline-block bg-green-700/80 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                  Premium Car Rentals in Ghana
                </span>
              </div> */}
              <h1 className="text-3xl text-shadow-lg sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Ride <span className="text-[#277f75] bg-clip-text ">in Style</span><br />
                Arrive <span className="text-[#277f75] bg-clip-text ">in Comfort</span>
              </h1>
              <p className="text-base text-shadow-lg sm:text-lg text-gray-100 mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                Your perfect ride awaits. Book now for a seamless experience across Ghana. Whether it’s hourly, daily, airport transfers, or out-of-town trips, we’ve got you covered.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                {/* <div className="text-center transform hover:scale-110 transition-transform">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">10k+</div>
                  <div className="text-xs sm:text-sm text-gray-200">Happy Customers</div>
                </div> */}
                <div className="text-center transform hover:scale-110 transition-transform">
                  <div className="text-xl sm:text-2xl font-bold text-[#277f75]">20+</div>
                  <div className="text-xs sm:text-sm text-gray-200">Premium Cars</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform">
                  <div className="text-xl sm:text-2xl font-bold text-[#277f75]">50+</div>
                  <div className="text-xs sm:text-sm text-gray-200">Locations</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform">
                  <div className="text-xl sm:text-2xl font-bold text-[#277f75]">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-200">Support</div>
                </div>
              </div>
            </div>
            {/* Right: Booking Form Card */}
            <div className="flex-1 z-10 flex justify-center lg:justify-end w-full mt-12 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <LandingBookingForm />
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        {/* <section className="py-12 bg-background">
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
        </section> */}

        {/* Features Section */}
        {/* <section className="py-16 bg-background-light">
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
        </section> */}

        {/* Call to Action */}
        {/* <section className="py-20 bg-primary">
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
        </section> */}

        {/* Our Services Section */}
        <section id="services" className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
              {/* Global Coverage */}
              <div className="flex flex-col items-start animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <svg className="w-10 h-10 mb-4" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" stroke="#111" strokeWidth="2.2" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Airport Transfers</h3>
                <p className="text-gray-600 text-sm mb-3">Seamless pickups and drop-offs from Ghana’s major airports on time, every time.
                </p>
                {/* <a href="#" className="inline-flex items-center text-green-700 font-medium hover:text-black transition-colors">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                </a> */}
              </div>

              {/* Professional Drivers */}
              <div className="flex flex-col items-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <svg className="w-10 h-10 mb-4" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="7" r="4" stroke="#111" strokeWidth="2.2" />
                  <path d="M5.5 21v-2A6.5 6.5 0 0112 12.5a6.5 6.5 0 016.5 6.5v2" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Out-of-Town Trips</h3>
                <p className="text-gray-600 text-sm mb-3">Planning a getaway to Akosombo, Ada, or beyond? Our chauffeurs are ready for longer trips and regional escapes.</p>
                
              </div>

              {/* Chauffeur by the Hour */}
              <div className="flex flex-col items-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <svg className="w-10 h-10 mb-4" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" stroke="#111" strokeWidth="2.2" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Chauffeur by the hour</h3>
                <p className="text-gray-600 text-sm mb-3">Hire a driver and vehicle by the hour. Perfect for events, meetings, or errands when flexibility is key.</p>
                
              </div>

              {/* City Rides */}
              <div className="flex flex-col items-start animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <svg className="w-10 h-10 mb-4" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#111" strokeWidth="2.2" />
                  <circle cx="8.5" cy="9.5" r="2.5" />
                  <circle cx="15.5" cy="9.5" r="2.5" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 mb-2">City Rides</h3>
                <p className="text-gray-600 text-sm mb-3">Explore the city anytime, anywhere—even long distances.</p>
                
              </div>

            </div>
          </div>
        </section>
        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-100 rounded-2xl py-16 px-4 sm:px-8 w-full">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-10">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700 border-2 border-green-500">1</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1 text-base"> Fill in Your Trip Details</div>
                    <div className="text-gray-600 text-sm">Start by selecting your service type. Whether it’s an airport pickup, city ride, hourly hire, or out-of-town trip. You’ll find the booking form right on the homepage.
                    </div>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700 border-2 border-green-500">2</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1 text-base">Explore Vehicle Options</div>
                    <div className="text-gray-600 text-sm">Once submitted, you'll be taken to our curated marketplace of vehicles tailored to your request. Browse through exterior and interior photos, review prices, and choose the perfect ride for your journey.</div>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 border-2 border-green-500">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1 text-base">Confirm & Pay</div>
                    <div className="text-gray-600 text-sm">Double-check your trip summary, enter your details, and make a secure payment. That’s it! Your ride is confirmed.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Why Choose Us Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

              {/* Card 1 */}
              <div className="flex flex-col">
                <img src="/images/city-to-city.jpg" alt="City to City" className="rounded-md object-cover h-40 w-full mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">City-to-City Comfort</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Travel smoothly between cities like Accra, Kumasi, Cape Coast, or Ada with custom routes and trusted drivers.
                </p>
                {/* <a href="#" className="text-sm font-medium text-green-600 hover:underline mt-auto">Learn more</a> */}
              </div>

              {/* Card 2 */}
              <div className="flex flex-col">
                <img src="/images/support.jpg" alt="24/7 Support" className="rounded-md object-cover h-40 w-full mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Always-On Support</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Our team is on standby 24/7 to support your ride, resolve concerns, or assist with bookings anytime, anywhere
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col">
                <img src="/images/safety.jpg" alt="Safety" className="rounded-md object-cover h-40 w-full mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety First</h3>
                <p className="text-gray-600 text-sm mb-2">
                  We only partner with licensed companies and vetted chauffeurs. Your safety and privacy are our top priority
                </p>
              </div>

              {/* Card 4 */}
              <div className="flex flex-col">
                <img src="/images/premium.jpg" alt="Premium Cars" className="rounded-md object-cover h-40 w-full mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Fleet</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Book from a curated selection of clean, high-end vehicles that fit your occasion business, travel, or leisure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partner With Us Section */}
        <section id="partner" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">Power the FlexiRide Network</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Vehicle Owners */}
              <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition">
                <div className="p-4 bg-[#277f75] rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13l2-2m0 0l7-7 7 7M5 11v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transport Companies</h3>
                <p className="text-gray-600 text-sm mb-4">Have a fleet and licensed drivers? Join our network and receive steady, high-value bookings from both local and international clients. We handle the platform—you focus on the rides.</p>
                <button className="bg-black text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-800 transition">Become Partner</button>
              </div>
              {/* Drivers */}
              <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition">
                <div className="p-4 bg-[#277f75] rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M16 12a4 4 0 01-8 0" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Vehicle Management Firms</h3>
                <p className="text-gray-600 text-sm mb-4">Whether you're managing cars on behalf of clients or have idle premium vehicles, plug into our system and put them to work. We make it easy to monetize your inventory without added overhead.</p>
                <button className="bg-black text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-800 transition">Become Partner</button>
              </div>
              {/* Transport Companies */}
              <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition">
                <div className="p-4 bg-[#277f75] rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Brand & Strategic Partnerships</h3>
                <p className="text-gray-600 text-sm mb-4">Looking to align your brand with a premium mobility service in Ghana? From co-branded activations to corporate sponsorships, we’re open to meaningful, long-term collaborations.</p>
                <button className="bg-black text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-800 transition">Become Partner</button>
              </div>
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="py-16 bg-[#277f75]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {/* FAQ 1 */}
              <details className="group border border-gray-200 rounded-lg p-4">
                <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-white group-open:text-green-600 transition">
                  How do I book a ride?
                  <span className="ml-2 text-white group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="mt-2 text-white">
                  Simply select your service, fill in your details, and submit the booking form. You'll receive instant confirmation and details.
                </div>
              </details>
              {/* FAQ 2 */}
              <details className="group border border-gray-200 rounded-lg p-4">
                <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-white group-open:text-green-600 transition">
                  Can I cancel or modify my booking?
                  <span className="ml-2 text-white group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="mt-2 text-white">
                  Yes, you can cancel or modify your booking up to 24 hours before pickup with no penalty.
                </div>
              </details>
              {/* FAQ 3 */}
              <details className="group border border-gray-200 rounded-lg p-4">
                <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-white group-open:text-green-600 transition">
                  What payment methods do you accept?
                  <span className="ml-2 text-white group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="mt-2 text-white">
                  We accept all major credit/debit cards, mobile money, and bank transfers.
                </div>
              </details>
              {/* FAQ 4 */}
              <details className="group border border-gray-200 rounded-lg p-4">
                <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-white group-open:text-green-600 transition">
                  Are your cars insured and drivers vetted?
                  <span className="ml-2 text-white group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="mt-2 text-white">
                  Yes, all our vehicles are fully insured and our drivers are thoroughly vetted for your safety.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Tourist Destinations Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Explore Ghana with FlexiRide
              </h3>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                Whether you’re landing in Ghana or already here, FlexiRide is your go-to for reliable rides, professional drivers, and stress-free travel. From airport pickups to city trips and out-of-town getaways we’ve got you covered. Book your ride today and enjoy premium comfort wherever you're headed.

              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Accra */}
              <div
                ref={el => cardsRef.current[0] = el}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${animatedCards[0] ? 'fade-in-up card-animate-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/accra.webp"
                    alt="Accra"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-white font-semibold text-lg">Accra</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-white/90 text-sm">Greater Accra</span>
                  </div>
                </div>
              </div>

              {/* Kumasi */}
              <div
                ref={el => cardsRef.current[1] = el}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${animatedCards[1] ? 'fade-in-up card-animate-1' : 'opacity-0 translate-y-10'}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/kumasi.avif"
                    alt="Kumasi"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-white font-semibold text-lg">Kumasi Central</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-white/90 text-sm">Ashanti Region</span>
                  </div>
                </div>
              </div>

              {/* Tamale */}
              <div
                ref={el => cardsRef.current[2] = el}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${animatedCards[2] ? 'fade-in-up card-animate-2' : 'opacity-0 translate-y-10'}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/tamale-1.jpg"
                    alt="Tamale"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-white font-semibold text-lg">Northern Region</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-white/90 text-sm">Tamale</span>
                  </div>
                </div>
              </div>

              {/* Cape Coast */}
              <div
                ref={el => cardsRef.current[3] = el}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${animatedCards[3] ? 'fade-in-up card-animate-3' : 'opacity-0 translate-y-10'}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/cape-coast.jpeg"
                    alt="Cape Coast"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-white font-semibold text-lg">Cape Coast</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-white/90 text-sm">Cape Coast Beach</span>
                  </div>
                </div>
              </div>

              {/* Takoradi */}
              <div
                ref={el => cardsRef.current[4] = el}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${animatedCards[4] ? 'fade-in-up card-animate-4' : 'opacity-0 translate-y-10'}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/nzulezu.jpg"
                    alt="Takoradi"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-white font-semibold text-lg">Western Region</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-white/90 text-sm">Nzulezu</span>
                  </div>
                </div>
              </div>

              {/* Ho */}
              <div
                ref={el => cardsRef.current[5] = el}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${animatedCards[5] ? 'fade-in-up card-animate-5' : 'opacity-0 translate-y-10'}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/mountain-afadjato.jpg"
                    alt="Ho"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-white font-semibold text-lg">Volta Region</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-white/90 text-sm">Mt. Afadzato</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-[#277f75] text-white rounded-full shadow-lg hover:bg-[#49cabb] hover:scale-110 transition-all duration-300 transform"
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default HomePage;
