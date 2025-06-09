import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, XCircle, AlertCircle, Car } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Booking, Car as CarType } from '../../types';
import axios, { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Record<string, CarType>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
        
        // Fetch user's bookings
        const bookingsRes = await axios.get(
          `http://localhost:5001/api/bookings?userId=${user.id}`,
          config
        );
        const fetchedBookings = bookingsRes.data;
        setBookings(fetchedBookings);

        // Get unique car IDs from bookings
        const carIds = [...new Set(fetchedBookings.map((booking: Booking) => booking.carId))];
        
        // Fetch all cars that are in the bookings
        const carsRes = await axios.get(
          `http://localhost:5001/api/cars?ids=${carIds.join(',')}`,
          config
        );
        const carsData = carsRes.data;
        
        // Convert cars array to a map for easy lookup
        const carsMap = carsData.reduce((acc: Record<string, CarType>, car: CarType) => {
          acc[car._id] = car;
          return acc;
        }, {});
        
        setCars(carsMap);
      } catch (err) {
        console.error('Error fetching data:', err);
        const axiosError = err as AxiosError<ApiErrorResponse>;
        if (axiosError.response?.status === 401) {
          setError('Your session has expired. Please login again.');
          navigate('/login');
        } else {
          setError('Failed to load your bookings. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id, navigate]);

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return booking.status === 'confirmed' || booking.status === 'pending';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.patch(
        `http://localhost:5001/api/bookings/${bookingId}`,
        { status: 'cancelled' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-error" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/20 text-success';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'completed':
        return 'bg-success/20 text-success';
      case 'cancelled':
        return 'bg-error/20 text-error';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}</h1>
            <p className="text-gray-400 mt-1">Manage your bookings and account details</p>
          </div>
          <Link to="/cars">
            <Button variant="primary" className="mt-4 md:mt-0">
              Browse Cars
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {filteredBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}
                </h3>
                <p className="text-gray-400">Upcoming Bookings</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {filteredBookings.filter(b => b.status === 'completed').length}
                </h3>
                <p className="text-gray-400">Completed Trips</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  ${filteredBookings.reduce((total, booking) => total + booking.totalPrice, 0)}
                </h3>
                <p className="text-gray-400">Total Spent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-xl font-semibold text-white">My Bookings</h2>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button
                  variant={activeTab === 'all' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('all')}
                >
                  All
                </Button>
                <Button
                  variant={activeTab === 'upcoming' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </Button>
                <Button
                  variant={activeTab === 'completed' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('completed')}
                >
                  Completed
                </Button>
                <Button
                  variant={activeTab === 'cancelled' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('cancelled')}
                >
                  Cancelled
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Car</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dates</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => {
                      const car = cars[booking.carId];
                      return (
                        <tr key={booking.id} className="border-b border-gray-700 hover:bg-background-light/30">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={car?.images[0] ? `http://localhost:5001${car.images[0]}` : 'https://via.placeholder.com/150'}
                                  alt="Car"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {car ? `${car.make} ${car.model}` : 'Unknown Car'}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-300">
                              <Calendar className="h-4 w-4 text-primary mr-2" />
                              <span>
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">${booking.totalPrice}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1">{getStatusText(booking.status)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end space-x-2">
                              <Link to={`/cars/${booking.carId}`}>
                                <Button variant="ghost" size="sm">
                                  View Car
                                </Button>
                              </Link>
                              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-error border-error hover:bg-error/10"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
                <p className="text-gray-400 mb-6">You don't have any {activeTab !== 'all' ? activeTab : ''} bookings yet.</p>
                <Link to="/cars">
                  <Button variant="primary">Browse Cars</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;