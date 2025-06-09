import React, { useState, useEffect } from 'react';
import { Car, CarFilter as FilterType } from '../../types';
import CarFilter from '../../components/cars/CarFilter';
import CarCard from '../../components/cars/CarCard';
import { Car as CarIcon } from 'lucide-react';

const CarListingPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (filters: FilterType) => {
    setIsLoading(true);

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

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/cars');
        const data = await res.json();
        setCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
      }
    };

    fetchCars();
  }, []);

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
                  <CarCard key={car._id} car={car} />
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
