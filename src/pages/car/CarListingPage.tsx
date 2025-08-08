import React, { useState, useEffect } from 'react';
import { Car, CarFilter as FilterType } from '../../types';
import CarFilter from '../../components/cars/CarFilter';
import CarCard from '../../components/cars/CarCard';
import { buildApiUrl, API_ENDPOINTS } from '../../config/api';
import BookingSummarySidebar from '../../components/layout/BookingSummarySidebar';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface BookingData {
  from?: string;
  to?: string;
  pickupDate?: string;
  pickupTime?: string;
  passengers?: number;
  return?: boolean;
  name?: string;
  email?: string;
  whatsapp?: string;
  serviceType?: string;
}

const CarListingPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[] | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  const handleFilterChange = (filters: FilterType) => {
    setLoading(true);

    setTimeout(() => {
      let filtered = [...cars];

      if (filters.type) {
        filtered = filtered.filter(car => car.type === filters.type);
      }

      if (filters.location) {
        filtered = filtered.filter(car =>
          car.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      // Price filtering will be handled by service type pricing
      // if (filters.minPrice !== undefined) {
      //   filtered = filtered.filter(car => car.dailyRate >= filters.minPrice!);
      // }

      // if (filters.maxPrice !== undefined) {
      //   filtered = filtered.filter(car => car.dailyRate <= filters.maxPrice!);
      // }

      // If no cars match the filters, show all cars
      if (filtered.length === 0) {
        setFilteredCars([...cars]);
      } else {
        setFilteredCars(filtered);
      }
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    // Retrieve booking data from localStorage
    const data = localStorage.getItem('bookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        // Get service type from booking data or URL params
        const serviceType = bookingData?.serviceType || new URLSearchParams(location.search).get('serviceType');
        
        let url = buildApiUrl(API_ENDPOINTS.CARS.LIST);
        if (serviceType) {
          url += `?serviceType=${serviceType}`;
          setSelectedServiceType(serviceType as string);
        }
        
        const response = await fetch(url);
        const carsData = await response.json();
        setCars(carsData);
        setFilteredCars(carsData);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [bookingData, location.search]);



  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');
    const locationParam = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // If no filters are present, show all cars
    if (!type && !locationParam && !minPrice && !maxPrice) {
      setFilteredCars([...cars]);
      return;
    }

    const filters: FilterType = {
      type: type || undefined,
      location: locationParam || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };

    handleFilterChange(filters);
  }, [location.search, cars]);

  return (
    <div className="bg-white min-h-screen pt-24">
      <Helmet>
        <title>Browse Premium Cars | FlexiRide</title>
        <meta name="description" content="Choose from a wide range of luxury and premium vehicles. Use the filters to find your perfect ride for any occasion." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Browse Our Premium Cars</h1>
          <p className="text-gray-600 mt-2">
            Choose from a wide range of luxury and premium vehicles. Use the filters to find your perfect ride for any occasion.
          </p>
        </header>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <CarFilter onFilterChange={handleFilterChange} />
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : Array.isArray(filteredCars) && filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map(car => (
                  <CarCard key={car._id} car={car} selectedServiceType={selectedServiceType} />
                ))}
              </div>
            ) : (
              !loading && Array.isArray(filteredCars) && filteredCars.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-semibold text-gray-800">No Cars Found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters to find the perfect car.</p>
                </div>
              )
            )}
          </div>
          {/* Booking Summary Sidebar */}
          {bookingData && <BookingSummarySidebar bookingData={bookingData} />}
        </div>
      </div>
    </div>
  );
};

export default CarListingPage;
