import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { CarFilter as FilterType } from '../../types';

interface CarFilterProps {
  onFilterChange: (filters: FilterType) => void;
}

const CarFilter: React.FC<CarFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterType>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value ? parseInt(value, 10) : undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              type="text"
              name="location"
              value={filters.location || ''}
              onChange={handleInputChange}
              placeholder="Location (city, state)"
              icon={<Search className="h-5 w-5 text-gray-400" />}
              className="bg-gray-100 text-gray-900 placeholder-gray-400"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="md:w-auto flex items-center"
            icon={isFiltersOpen ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
          >
            {isFiltersOpen ? 'Hide Filters' : 'More Filters'}
          </Button>
        </div>

        {isFiltersOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Vehicle Type</label>
              <select
                name="type"
                value={filters.type || ''}
                onChange={handleInputChange}
                className="w-full p-2 bg-background-light border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Types</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Sports">Sports</option>
                <option value="Luxury">Luxury</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Min Price (¢500 per day)</label>
              <Input
                type="number"
                name="minPrice"
                value={filters.minPrice?.toString() || ''}
                onChange={handlePriceChange}
                min={0}
                placeholder="Min price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Max Price (¢1000 per day)</label>
              <Input
                type="number"
                name="maxPrice"
                value={filters.maxPrice?.toString() || ''}
                onChange={handlePriceChange}
                min={0}
                placeholder="Max price"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Clear
          </Button>
          <Button type="submit" variant="primary">
            Apply Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CarFilter;