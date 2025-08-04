import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Users, Settings, Briefcase } from 'lucide-react';
import Button from '../ui/Button';
import { Car } from '../../types';
import { API_BASE_URL } from '../../config/api';

interface CarCardProps {
  car: Car;
  selectedServiceType?: string;
}

const CarCard: React.FC<CarCardProps> = ({ car, selectedServiceType }) => {
  // Helper function to get service type price and label
  const getServiceTypeInfo = () => {
    if (!selectedServiceType || !car.serviceTypes || car.serviceTypes.length === 0) {
      return { price: 0, label: '/day', pricingType: 'per_day' };
    }

    const selectedService = car.serviceTypes.find(st => 
      st.serviceTypeId && st.serviceTypeId.code === selectedServiceType
    );

    if (!selectedService) {
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

    return {
      price: selectedService.price,
      label,
      pricingType
    };
  };

  const serviceInfo = getServiceTypeInfo();
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={car.images[0] ? `${API_BASE_URL}${car.images[0]}` : 'https://images.pexels.com/photos/6894427/pexels-photo-6894427.jpeg'}
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        {/* Featured badge */}
        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow">
          Featured
        </div>
        {/* Favorite icon */}
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow cursor-pointer">
          <Heart className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
          <MapPin className="h-4 w-4 text-primary" />
          {car.location}
        </div>
        <div className="text-lg font-bold text-gray-900 uppercase mb-2">
          {car.make} {car.model}
        </div>
        {/* Icon row: features */}
        <div className="flex gap-4 mb-3">
          <div className="flex flex-col items-center text-xs text-gray-500">
            <Users className="h-5 w-5 mb-1" />
            <span>5</span>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-500">
            <Settings className="h-5 w-5 mb-1" />
            <span>Auto</span>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-500">
            <Briefcase className="h-5 w-5 mb-1" />
            <span>4</span>
          </div>
        </div>
        <div className="mt-auto">
          <div className="text-sm text-gray-500 mb-1">
            {selectedServiceType ? `${selectedServiceType.replace('-', ' ').toUpperCase()}` : 'from'}
          </div>
          <div className="text-xl font-bold text-primary mb-2">
            {serviceInfo.price > 0 ? (
              <>₵{serviceInfo.price.toLocaleString()}<span className="text-base font-normal text-gray-700">{serviceInfo.label}</span></>
            ) : (
              <>₵--<span className="text-base font-normal text-gray-700">{serviceInfo.label}</span></>
            )}
          </div>
          <Link to={`/cars/${car._id}`}>
            <Button variant="primary" fullWidth>
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;