import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, User, Star, ChevronLeft,
  ChevronRight, Shield, LifeBuoy, Award, Coins, Check, Car as CarIcon
} from 'lucide-react';
import Button from '../../components/ui/Button';
import BookingForm from '../../components/bookings/BookingForm';
import { Car } from '../../types';
import { buildApiUrl, API_ENDPOINTS, API_BASE_URL } from '../../config/api';



const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(buildApiUrl(API_ENDPOINTS.CARS.DETAIL(id!)));
        const data = await res.json();
        setCar(data);
      } catch (err) {
        console.error('Failed to load car:', err);
        setCar(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [id]);


  const handlePrevImage = () => {
    setActiveImageIndex(prev =>
      prev === 0 ? (car?.images.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev =>
      prev === (car?.images.length || 1) - 1 ? 0 : prev + 1
    );
  };

  // Get booking data from localStorage
  let localBookingData: Record<string, unknown> | null = null;
  try {
    const data = localStorage.getItem('bookingData');
    if (data) {
      localBookingData = JSON.parse(data);
    }
  } catch {
    // Ignore JSON parse errors
  }

  // Helper function to get service type price and label
  const getServiceTypeInfo = () => {
    console.log('CarDetailPage - selectedServiceType:', selectedServiceType);
    console.log('CarDetailPage - car.serviceTypes:', car?.serviceTypes?.map(st => st.serviceTypeId?.code));
    
    if (!selectedServiceType || !car?.serviceTypes || car.serviceTypes.length === 0) {
      console.log('CarDetailPage - No service type selected or no service types available');
      return { price: 0, label: '/day', pricingType: 'per_day' };
    }

    const selectedService = car.serviceTypes.find(st => 
      st.serviceTypeId && st.serviceTypeId.code === selectedServiceType
    );

    console.log('CarDetailPage - Selected service:', selectedService);

    if (!selectedService) {
      console.log('CarDetailPage - No matching service found');
      return { price: 0, label: '/day', pricingType: 'per_day' };
    }

    const pricingType = selectedService.serviceTypeId.pricingType;
    let label = '/day';
    
    switch (pricingType) {
      case 'per_hour':
        label = '/hour';
        break;
      case 'per_trip':
        label = '/trip';
        break;
      case 'per_km':
        label = '/km';
        break;
      default:
        label = '/day';
    }

    const price = selectedService.displayPrice || selectedService.totalPrice || selectedService.basePrice || 0;

    return {
      price,
      label,
      pricingType
    };
  };

  const serviceInfo = getServiceTypeInfo();

  // Set selected service type from booking data or URL params
  useEffect(() => {
    console.log('CarDetailPage - localBookingData:', localBookingData);
    console.log('CarDetailPage - URL search params:', window.location.search);
    
    const serviceType = localBookingData?.serviceType || new URLSearchParams(window.location.search).get('serviceType');
    console.log('CarDetailPage - Extracted serviceType:', serviceType);
    
    if (serviceType) {
      setSelectedServiceType(serviceType as string);
    }
  }, [localBookingData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Car Not Found</h1>
          <p className="text-gray-300 mb-8">The car you're looking for doesn't exist or has been removed.</p>
          <Link to="/cars">
            <Button variant="primary">Browse Other Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/cars" className="flex items-center text-green-700 hover:underline font-medium">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to All Cars
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden mb-8 bg-white shadow-lg">
              {car.images?.length > 0 ? (
                <img
                  src={`${API_BASE_URL}${car.images[activeImageIndex]}`}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover rounded-2xl transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No image available
                </div>
              )}

              {car.images?.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 rounded-full p-2 shadow transition"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 rounded-full p-2 shadow transition"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {car.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-3 h-3 rounded-full border-2 ${index === activeImageIndex ? 'bg-green-600 border-green-700' : 'bg-white border-gray-300'} transition`}
                      />
                    ))}
                  </div>
                </>
              )}

              {!car.availability && (
                <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 text-xs font-bold rounded-full text-white shadow">
                  Not Available
                </div>
              )}
            </div>

            {/* Car Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                {car.make} {car.model} {car.year}
              </h1>
              <div className="flex flex-wrap gap-y-2 mb-4">
                <div className="flex items-center mr-6 text-gray-500">
                  <MapPin className="h-5 w-5 text-green-700 mr-2" />
                  <span>{car.location}</span>
                </div>
                <div className="flex items-center mr-6 text-gray-500">
                  <Calendar className="h-5 w-5 text-green-700 mr-2" />
                  <span>{car.type}</span>
                </div>
                <div className="flex items-center mr-6 text-gray-500">
                  <Coins className="h-5 w-5 text-green-700 mr-2" />
                  {serviceInfo.price > 0 ? (
                    <>
                      <span className="font-bold text-green-700 text-lg">₵{serviceInfo.price.toLocaleString()}</span>
                      <span className="text-sm ml-1 text-gray-400">{serviceInfo.label}</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-green-700 text-lg">₵--</span>
                      <span className="text-sm ml-1 text-gray-400">{serviceInfo.label}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-5 w-5 text-green-700 mr-2" />
                  <span>Listed {new Date(car.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{car.description}</p>
              </div>
              
              {/* Service Types */}
              {car.serviceTypes && car.serviceTypes.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Available Services</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {car.serviceTypes.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <CarIcon className="h-5 w-5 text-green-700 mr-2" />
                          <span className="font-medium text-gray-900">
                            {service.serviceTypeId?.name || 'Unknown Service'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-700">₵{(service.displayPrice || service.totalPrice || service.basePrice || 0)?.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 ml-1">
                            {service.serviceTypeId?.pricingType === 'per_hour' ? '/hour' :
                             service.serviceTypeId?.pricingType === 'per_trip' ? '/trip' :
                             service.serviceTypeId?.pricingType === 'per_km' ? '/km' : '/day'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.features?.length > 0 ? (
                  car.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <Check className="h-5 w-5 text-green-700 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No features listed.</p>
                )}
              </div>
            </div>

            {/* Rental Policy */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rental Policy</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-700 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Insurance Included</h3>
                    <p className="text-gray-600 text-sm">Basic insurance is included in the rental price.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <LifeBuoy className="h-5 w-5 text-green-700 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">24/7 Roadside Assistance</h3>
                    <p className="text-gray-600 text-sm">Help is always available if you need it on the road.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-green-700 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Cancellation</h3>
                    <p className="text-gray-600 text-sm">Cancel up to 24 hours before your trip for a full refund.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <BookingForm car={car} bookingData={localBookingData} />
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
                <div className="flex items-start mb-4">
                  <User className="h-10 w-10 text-green-700 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Car Owner</h3>
                    <p className="text-gray-600 text-sm">
                      This car is hosted by a verified owner with excellent ratings.
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 mb-2">
                  <Star className="h-5 w-5 text-green-700 mr-2" />
                  <span className="font-semibold text-gray-900">4.9</span>
                  <span className="text-sm ml-1">(25 reviews)</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-5 w-5 text-green-700 mr-2" />
                  <span>Usually responds within 1 hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;