import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Calendar, DollarSign, Clock, User, Star, ChevronLeft,
  ChevronRight, Shield, LifeBuoy, Award, Check
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardContent } from '../../components/ui/Card';
import BookingForm from '../../components/bookings/BookingForm';
import { Car } from '../../types';



const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/cars/${id}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
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
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/cars" className="flex items-center text-primary hover:underline">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to All Cars
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden mb-6">
              {car.images?.length > 0 ? (
                <img
                  src={`http://localhost:5001${car.images[activeImageIndex]}`}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                  No image available
                </div>
              )}


              {car.images?.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {car.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-primary' : 'bg-white/50'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {!car.availability && (
                <div className="absolute top-4 right-4 bg-error px-3 py-1 text-sm font-bold rounded-full text-white">
                  Not Available
                </div>
              )}
            </div>

            {/* Car Info */}
            <div className="bg-background-card rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {car.make} {car.model} {car.year}
              </h1>

              <div className="flex flex-wrap gap-y-2 mb-4">
                <div className="flex items-center mr-6 text-gray-300">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <span>{car.location}</span>
                </div>
                <div className="flex items-center mr-6 text-gray-300">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span>{car.type}</span>
                </div>
                <div className="flex items-center mr-6 text-gray-300">
                  <DollarSign className="h-5 w-5 text-primary mr-2" />
                  <span className="font-semibold text-white">${car.dailyRate}</span>
                  <span className="text-sm ml-1">per day</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span>Listed {new Date(car.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
                <p className="text-gray-300">{car.description}</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-background-card rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.features?.length > 0 ? (
                  car.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No features listed.</p>
                )}

              </div>
            </div>

            {/* Rental Policy */}
            <div className="bg-background-card rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Rental Policy</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Insurance Included</h3>
                    <p className="text-gray-400 text-sm">Basic insurance is included in the rental price.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <LifeBuoy className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">24/7 Roadside Assistance</h3>
                    <p className="text-gray-400 text-sm">Help is always available if you need it on the road.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Free Cancellation</h3>
                    <p className="text-gray-400 text-sm">Cancel up to 24 hours before your trip for a full refund.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <BookingForm car={car} />

              <Card className="mt-6">
                <CardContent>
                  <div className="flex items-start mb-4">
                    <User className="h-10 w-10 text-primary mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white">Car Owner</h3>
                      <p className="text-gray-400 text-sm">
                        This car is hosted by a verified owner with excellent ratings.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300 mb-2">
                    <Star className="h-5 w-5 text-primary mr-2" />
                    <span className="font-semibold text-white">4.9</span>
                    <span className="text-sm ml-1">(25 reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-5 w-5 text-primary mr-2" />
                    <span>Usually responds within 1 hour</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;