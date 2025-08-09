import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import {
  Car as CarIcon, Coins, Users, PlusCircle, Calendar, Clock,
  Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle, DollarSign
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { Car, Booking } from '../../types';
import { buildApiUrl, API_ENDPOINTS, API_BASE_URL } from '../../config/api';

interface ApiErrorResponse {
  message: string;
}

interface BookingWithUser extends Booking {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<BookingWithUser[]>([]);
  const [activeTab, setActiveTab] = useState<'cars' | 'bookings'>('cars');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate dashboard stats
  const totalEarnings = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalServiceTypes = cars.reduce((sum, car) => sum + (car.serviceTypes?.length || 0), 0);

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch owner's cars
        const carsRes = await axios.get(
          buildApiUrl(`${API_ENDPOINTS.CARS.LIST}?ownerId=${user.id}`),
          config
        );
        setCars(carsRes.data);

        // Get all bookings for owner's cars with user details included
        const carIds = carsRes.data.map((car: Car) => car._id);
        if (carIds.length === 0) {
          setBookings([]);
          setIsLoading(false);
          return;
        }

        const bookingsRes = await axios.get(
          buildApiUrl(`${API_ENDPOINTS.BOOKINGS.LIST}?carIds=${carIds.join(',')}&includeUser=true`),
          config
        );
        
        // Bookings should now include user details from the backend
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        const axiosError = err as AxiosError<ApiErrorResponse>;
        if (axiosError.response?.status === 401) {
          setError('Your session has expired. Please login again.');
          navigate('/login');
        } else {
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, navigate]);

  const deleteCar = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(
        buildApiUrl(API_ENDPOINTS.CARS.DELETE(id)),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCars(prev => prev.filter(car => car._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to delete car. Please try again.');
      }
    }
  };

  const handleBookingStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.patch(
        `http://localhost:5001/api/bookings/${bookingId}`,
        { status: newStatus },
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
          ? { ...booking, status: newStatus }
          : booking
      ));

      showAlert({
        type: 'success',
        title: 'Status Updated',
        message: `Booking has been ${newStatus} successfully.`,
      });
    } catch (err) {
      console.error('Failed to update booking status:', err);
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 401) {
        showAlert({
          type: 'error',
          title: 'Session Expired',
          message: 'Your session has expired. Please login again.',
          persistent: true,
        });
        navigate('/login');
      } else {
        showAlert({
          type: 'error',
          title: 'Update Failed',
          message: 'Failed to update booking status. Please try again.',
        });
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-error" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'bg-success/20 text-success';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'cancelled':
        return 'bg-error/20 text-error';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

      if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

      if (error) {
      return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-error mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      );
    }

  return (

    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your listings and bookings</p>
          </div>
          <Link to="/owner/add-car"> 
            <Button variant="primary" className="mt-4 md:mt-0 bg-[#277f75] text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-800 transition" icon={<PlusCircle className="h-5 w-5 mr-1" />}>
              Add New Car
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-xl shadow p-6">
            <CardContent className="flex items-center">
              <div className="p-3 bg-[#277f75] rounded-full mr-4">
                <CarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{cars.length}</h3>
                <p className="text-gray-600">Active Listings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow p-6">
            <CardContent className="flex items-center">
              <div className="p-3 bg-[#277f75] rounded-full mr-4">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">¢{totalEarnings}</h3>
                <p className="text-gray-600">Total Earnings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow p-6">
            <CardContent className="flex items-center">
              <div className="p-3 bg-[#277f75] rounded-full mr-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{pendingBookings + confirmedBookings}</h3>
                <p className="text-gray-600">Active Bookings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow p-6">
            <CardContent className="flex items-center">
              <div className="p-3 bg-[#277f75] rounded-full mr-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{totalServiceTypes}</h3>
                <p className="text-gray-600">Service Types</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 border-b border-gray-700">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('cars')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cars'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center">
                <CarIcon className="h-5 w-5 mr-2" />
                <span>My Cars</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Bookings</span>
              </div>
            </button>
          </nav>
        </div>

        {activeTab === 'cars' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">My Cars</h2>
            </CardHeader>
            <CardContent>
              {cars.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-xs text-black uppercase">Car</th>
                        <th className="px-4 py-3 text-left text-xs text-black uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs text-black uppercase">Service Types</th>
                        <th className="px-4 py-3 text-left text-xs text-black uppercase">Location</th>
                        <th className="px-4 py-3 text-right text-xs text-black uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.map((car) => (
                        <tr key={car._id} className="border-b border-gray-700 hover:bg-background-light/30">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <img 
                                src={car.images[0] ? `${API_BASE_URL}${car.images[0]}` : 'https://via.placeholder.com/150'} 
                                alt="" 
                                className="h-10 w-10 rounded-md object-cover mr-3" 
                              />
                              <div>
                                <div className="text-gray-800 font-bold">{car.make} {car.model}</div>
                                <div className="text-xs text-gray-600">{car.year} • {car.type}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 inline-flex text-xs rounded-full ${car.availability ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                              {car.availability ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-400">
                            {car.serviceTypes && car.serviceTypes.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {car.serviceTypes.slice(0, 2).map((service, index) => (
                                  <span key={index} className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                                    {service.serviceTypeId?.name || 'Unknown'}
                                  </span>
                                ))}
                                {car.serviceTypes.length > 2 && (
                                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                                    +{car.serviceTypes.length - 2} more
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No services</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-gray-800 font-bold">{car.location}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/cars/${car._id}`}>
                                <Button variant="ghost" size="sm" icon={<Eye className="h-4 w-4 mr-1" />}>View</Button>
                              </Link>
                              <Link to={`/owner/edit-car/${car._id}`}>
                                <Button variant="ghost" size="sm" icon={<Edit className="h-4 w-4 mr-1" />}>Edit</Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-error"
                                onClick={() => deleteCar(car._id)}
                                icon={<Trash2 className="h-4 w-4 mr-1" />}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <CarIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  No cars listed yet.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'bookings' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Bookings</h2>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        
                        <th className="px-4 py-3 text-left text-xs text-black uppercase">Customer</th>
                        <th className="px-4 py-3 text-left text-xs text-black uppercase">Car</th>
                        <th className="px-4 py-3 text-left text-xs text-black uppercase">Dates</th>
                        <th className="px-4 py-3 text-left text-xs text-black uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs text-black uppercase">Status</th>
                        <th className="px-4 py-3 text-right text-xs text-black uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => {
                        const car = cars.find(c => c._id === booking.carId);
                        const userName = booking.user?.name || 'Unknown User';
                        const userEmail = booking.user?.email || 'No email provided';
                        
                        return (
                          <tr key={booking.id} className="border-b border-gray-700 hover:bg-background-light/30">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                {booking.user?.avatar ? (
                                  <img
                                    src={`http://localhost:5001${booking.user.avatar}`}
                                    alt={userName}
                                    className="h-8 w-8 rounded-full object-cover mr-3"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium mr-3">
                                    {userName.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                                  </div>
                                )}
                                <div>
                                  <div className="text-gray-800 font-bold">{userName}</div>
                                  <div className="text-xs text-gray-600">{userEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <img 
                                  src={car?.images[0] ? `${API_BASE_URL}${car.images[0]}` : 'https://via.placeholder.com/150'} 
                                  alt="" 
                                  className="h-8 w-8 rounded-md object-cover mr-2" 
                                />
                                <div className="text-gray-800 font-bold">
                                  {car ? `${car.make} ${car.model}` : 'Unknown Car'}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-800 font-bold">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-primary mr-2" />
                                <span>
                                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-800 font-bold">¢{booking.totalPrice}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1 capitalize">{booking.status}</span>
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                {booking.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-success"
                                      onClick={() => handleBookingStatusChange(booking.id, 'confirmed')}
                                    >
                                      Confirm
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-error"
                                      onClick={() => handleBookingStatusChange(booking.id, 'cancelled')}
                                    >
                                      Decline
                                    </Button>
                                  </>
                                )}
                                <Link to={`/cars/${booking.carId}`}>
                                  <Button variant="ghost" size="sm">
                                    View Car
                                  </Button>
                                </Link>
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
                  <h3 className="text-lg font-medium text-white mb-2">No bookings yet</h3>
                  <p className="text-gray-400">When customers book your cars, their bookings will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
