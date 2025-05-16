import React, { useState, useEffect } from 'react';
import { Car, CarFilter as FilterType } from '../../types';
import CarFilter from '../../components/cars/CarFilter';
import CarCard from '../../components/cars/CarCard';
import { Car as CarIcon } from 'lucide-react';

// Placeholder mock data
const mockCars: Car[] = [
  {
    id: '1',
    ownerId: 'owner1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: 'Electric',
    description: 'Premium electric sedan with autopilot features.',
    dailyRate: 89,
    location: 'New York, NY',
    images: ['https://images.pexels.com/photos/12861709/pexels-photo-12861709.jpeg'],
    features: ['Autopilot', 'Premium Sound', 'Heated Seats', 'Long Range Battery'],
    availability: true,
    createdAt: '2023-05-15T10:00:00Z',
  },
  {
    id: '2',
    ownerId: 'owner2',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    type: 'SUV',
    description: 'Luxury SUV with plenty of space and power.',
    dailyRate: 110,
    location: 'Los Angeles, CA',
    images: ['https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg'],
    features: ['Leather Interior', 'Panoramic Roof', 'Premium Sound', '360 Camera'],
    availability: true,
    createdAt: '2023-06-20T14:30:00Z',
  },
  {
    id: '3',
    ownerId: 'owner3',
    make: 'Porsche',
    model: '911',
    year: 2023,
    type: 'Sports',
    description: 'High-performance sports car for the ultimate driving experience.',
    dailyRate: 199,
    location: 'Miami, FL',
    images: ['https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg'],
    features: ['Sport Mode', 'Carbon Fiber Interior', 'Launch Control', 'Bose Sound'],
    availability: true,
    createdAt: '2023-04-10T09:15:00Z',
  },
  {
    id: '4',
    ownerId: 'owner2',
    make: 'Toyota',
    model: 'RAV4',
    year: 2022,
    type: 'SUV',
    description: 'Reliable and efficient compact SUV with excellent fuel economy.',
    dailyRate: 65,
    location: 'Chicago, IL',
    images: ['https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg'],
    features: ['All-Wheel Drive', 'Apple CarPlay', 'Android Auto', 'Safety Sense'],
    availability: false,
    createdAt: '2023-07-05T16:45:00Z',
  },
  {
    id: '5',
    ownerId: 'owner1',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2023,
    type: 'Luxury',
    description: 'Ultimate luxury sedan with cutting-edge technology and comfort.',
    dailyRate: 175,
    location: 'Dallas, TX',
    images: ['https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg'],
    features: ['Massage Seats', 'Digital Cockpit', 'Augmented Reality Nav', 'Burmester Sound'],
    availability: true,
    createdAt: '2023-03-25T11:20:00Z',
  },
  {
    id: '6',
    ownerId: 'owner3',
    make: 'Jeep',
    model: 'Wrangler',
    year: 2022,
    type: 'SUV',
    description: 'Iconic off-road SUV perfect for adventures and outdoor activities.',
    dailyRate: 95,
    location: 'Denver, CO',
    images: ['https://images.pexels.com/photos/13861/IMG_3496bfree.jpg'],
    features: ['4x4', 'Removable Top', 'Off-Road Package', 'Touch Screen'],
    availability: true,
    createdAt: '2023-02-15T13:45:00Z',
  },
  {
    id: '7',
    ownerId: 'owner2',
    make: 'Audi',
    model: 'e-tron GT',
    year: 2023,
    type: 'Electric',
    description: 'High-performance electric sports car with stunning design.',
    dailyRate: 145,
    location: 'San Francisco, CA',
    images: ['https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg'],
    features: ['Fast Charging', 'Virtual Cockpit', 'Matrix LED Headlights', 'Bang & Olufsen Sound'],
    availability: true,
    createdAt: '2023-01-10T09:30:00Z',
  },
  {
    id: '8',
    ownerId: 'owner1',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    type: 'Sedan',
    description: 'Reliable and fuel-efficient compact sedan for everyday driving.',
    dailyRate: 55,
    location: 'Seattle, WA',
    images: ['https://images.pexels.com/photos/1005633/pexels-photo-1005633.jpeg'],
    features: ['Honda Sensing', 'Apple CarPlay', 'Android Auto', 'Heated Seats'],
    availability: true,
    createdAt: '2023-05-05T10:15:00Z',
  },
];

const CarListingPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (filters: FilterType) => {
    setIsLoading(true);
    
    // Simulating API call delay
    setTimeout(() => {
      let filtered = [...mockCars];
      
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
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Available Cars</h1>
        
        <CarFilter onFilterChange={handleFilterChange} />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {filteredCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-background-light rounded-lg mt-8">
                <CarIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No cars found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your search filters or try a different location</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CarListingPage;