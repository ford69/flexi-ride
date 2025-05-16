import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Car } from '../../types';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <Card className="h-full flex flex-col transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative">
        <img 
          src={car.images[0] || 'https://images.pexels.com/photos/6894427/pexels-photo-6894427.jpeg'} 
          alt={`${car.make} ${car.model}`}
          className="h-48 w-full object-cover"
        />
        {!car.availability && (
          <div className="absolute top-0 right-0 bg-error px-2 py-1 text-xs font-semibold text-white">
            Not Available
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{car.make} {car.model}</h3>
          <p className="text-white text-sm">{car.year}</p>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex items-center text-gray-300">
            <MapPin className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">{car.location}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Calendar className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">{car.type}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <DollarSign className="h-4 w-4 text-primary mr-2" />
            <span className="font-semibold text-white">${car.dailyRate}</span>
            <span className="text-sm ml-1">per day</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {car.features.slice(0, 3).map((feature, index) => (
            <span 
              key={index} 
              className="bg-background-light text-xs rounded-full px-2 py-1 text-gray-300"
            >
              {feature}
            </span>
          ))}
          {car.features.length > 3 && (
            <span className="bg-background-light text-xs rounded-full px-2 py-1 text-gray-300">
              +{car.features.length - 3} more
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <Link to={`/cars/${car.id}`}>
          <Button variant="primary" fullWidth>
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default CarCard;