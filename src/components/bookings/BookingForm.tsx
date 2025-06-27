import React, { useState } from 'react';
import { Calendar, Coins } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardContent, CardHeader, CardFooter } from '../ui/Card';
import { Car } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentButton from '../PaymentButton';

interface PaystackResponse {
  reference: string;
  status: 'success' | 'failed';
  trans: string;
  transaction: string;
  message: string;
}

interface ApiErrorResponse {
  message: string;
}

interface BookingFormProps {
  car: Car;
}

const BookingForm: React.FC<BookingFormProps> = ({ car }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
    
    if (isSubmitting || hasSubmitted) {
      return;
    }
    
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

      if (response.data && response.data._id) {
        console.log('Booking created:', response.data);
        setBookingId(response.data._id);
        setShowPayment(true);
        setHasSubmitted(true);
      } else {
        throw new Error('Booking created but no ID returned');
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

  const handlePaymentSuccess = async (response: PaystackResponse) => {
    if (!bookingId) {
      console.error('No booking ID found');
      setError('Payment successful but booking reference not found. Please contact support.');
      return;
    }

    try {
      console.log('Updating booking:', bookingId, 'with payment reference:', response.reference);
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5001/api/bookings/${bookingId}`,
        {
          paymentStatus: 'paid',
          paymentReference: response.reference
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate('/dashboard', { 
        state: { 
          bookingSuccess: true,
          message: 'Booking confirmed and payment processed successfully!' 
        }
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Payment was successful but failed to update booking. Please save this reference: ' + response.reference);
    }
  };

  const handlePaymentClose = () => {
    setError('Payment was cancelled. Please try again.');
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-white">Book this car</h3>
      </CardHeader>
      {!user?.isVerified && isAuthenticated && (
        <div className="bg-yellow-900/80 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-md text-sm m-4">
          Please verify your email to book a ride. Check your inbox for a verification link.
        </div>
      )}
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
                <span className="font-semibold text-white">¢{car.dailyRate}/day</span>
              </div>
              <div className="border-t border-gray-700 my-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Price:</span>
                  <div className="flex items-center text-white">
                    <Coins className="h-4 w-4 text-primary mr-1" />
                    <span className="font-bold text-lg">¢{calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {showPayment && user ? (
            <PaymentButton
              amount={calculateTotalPrice()}
              email={user.email}
              currency="GHS"
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
              className="w-full"
            >
              Pay GH₵{calculateTotalPrice()} Now
            </PaymentButton>
          ) : (
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!user?.isVerified || isSubmitting || hasSubmitted}
              isLoading={isSubmitting}
            >
              Book Now
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;