import React, { useState } from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardContent, CardHeader, CardFooter } from '../ui/Card';
import { Car } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BookingFormProps {
  car: Car;
}

interface ApiErrorResponse {
  message: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ car }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    const days = calculateDays();
    return days * car.dailyRate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/cars/${car._id}` } });
      return;
    }
    
    if (!startDate || !endDate) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/bookings',
        {
          carId: car._id,
          startDate,
          endDate,
          totalPrice: calculateTotalPrice(),
          status: 'pending'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        navigate('/dashboard', { 
          state: { 
            bookingSuccess: true,
            message: 'Booking request sent successfully! The owner will confirm your booking soon.' 
          }
        });
      }
    } catch (err) {
      console.error('Booking error:', err);
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        navigate('/login', { state: { from: `/cars/${car._id}` } });
      } else {
        setError(axiosError.response?.data?.message || 'Failed to create booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-white">Book this car</h3>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div className="flex-1">
              <Input
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
              />
            </div>
          </div>

          {startDate && endDate && (
            <div className="bg-background p-4 rounded-md animate-fade-in">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Days:</span>
                <span className="font-semibold text-white">{calculateDays()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Daily Rate:</span>
                <span className="font-semibold text-white">${car.dailyRate}/day</span>
              </div>
              <div className="border-t border-gray-700 my-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Price:</span>
                  <div className="flex items-center text-white">
                    <DollarSign className="h-4 w-4 text-primary mr-1" />
                    <span className="font-bold text-lg">${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            disabled={!car.availability || !startDate || !endDate}
          >
            {!car.availability ? 'Not Available' : 'Book Now'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;