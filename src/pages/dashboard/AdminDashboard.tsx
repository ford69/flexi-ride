import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { 
  Users, CarFront, Calendar, DollarSign, BarChart3, 
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Car, User as UserType, Booking } from '../../types';
import { buildApiUrl, API_ENDPOINTS, API_BASE_URL } from '../../config/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface ApiErrorResponse {
  message: string;
}

interface DashboardStats {
  totalUsers: number;
  totalCars: number;
  totalBookings: number;
  totalEarnings: number;
}

interface ExtendedUser extends UserType {
  status: 'active' | 'suspended';
  avatar?: string;
}

interface ExtendedCar extends Car {
  approved: boolean;
}

type ChartData = { date: string; value: number };

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'cars' | 'bookings'>('overview');
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [cars, setCars] = useState<ExtendedCar[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalEarnings: 0
  });
  const [bookingStats, setBookingStats] = useState<ChartData[]>([]);
  const [revenueStats, setRevenueStats] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch all data in parallel
        const [usersRes, carsRes, bookingsRes] = await Promise.all([
          axios.get(buildApiUrl(API_ENDPOINTS.ADMIN.USERS), config),
          axios.get(buildApiUrl(API_ENDPOINTS.CARS.LIST), config),
          axios.get(buildApiUrl(API_ENDPOINTS.BOOKINGS.LIST), config)
        ]);

        setUsers(usersRes.data);
        setCars(carsRes.data);
        setBookings(bookingsRes.data);

        // Calculate dashboard stats
        setStats({
          totalUsers: usersRes.data.length,
          totalCars: carsRes.data.length,
          totalBookings: bookingsRes.data.length,
          totalEarnings: bookingsRes.data.reduce((sum: number, booking: Booking) => 
            booking.status === 'completed' ? sum + booking.totalPrice : sum, 0)
        });

        const fetchStats = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const config = {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            };
            const [bookingsRes, revenueRes] = await Promise.all([
              axios.get(buildApiUrl('/api/admin/stats/bookings'), config),
              axios.get(buildApiUrl('/api/admin/stats/revenue'), config)
            ]);
            // Transform data for recharts
            setBookingStats(Object.entries(bookingsRes.data).map(([date, value]) => ({ date, value: Number(value) })));
            setRevenueStats(Object.entries(revenueRes.data).map(([date, value]) => ({ date, value: Number(value) })));
          } catch {
            // ignore for now
          }
        };
        fetchStats();

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
  }, [navigate]);

  const handleUserStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.patch(
        buildApiUrl(`/api/admin/users/${userId}/status`),
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      ));
    } catch (err) {
      console.error('Failed to update user status:', err);
      alert('Failed to update user status. Please try again.');
    }
  };

  const handleCarApproval = async (carId: string, approved: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.patch(
        buildApiUrl(`/api/cars/${carId}/approval`),
        { approved },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      setCars(prev => prev.map(car => 
        car._id === carId 
          ? { ...car, approved }
          : car
      ));
    } catch (err) {
      console.error('Failed to update car approval:', err);
      alert('Failed to update car approval status. Please try again.');
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage users, cars, and bookings</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{stats.totalUsers}</h3>
                <p className="text-gray-400">Total Users</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <CarFront className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{stats.totalCars}</h3>
                <p className="text-gray-400">Listed Cars</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{stats.totalBookings}</h3>
                <p className="text-gray-400">Total Bookings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">¢{stats.totalEarnings}</h3>
                <p className="text-gray-400">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  <span>Overview</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Users</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('cars')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'cars'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <CarFront className="h-5 w-5 mr-2" />
                  <span>Cars</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
        </div>

        {activeTab === 'overview' && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background-card rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold mb-4">Bookings per Day</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={bookingStats}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-background-card rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold mb-4">Revenue per Day</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueStats}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Revenue" />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Users</h2>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-700 hover:bg-background-light/30">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.avatar ? (
                              <img
                                src={`http://localhost:5001${user.avatar}`}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover mr-4"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium mr-4">
                                {user.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-primary/20 text-primary'
                              : user.role === 'owner'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-gray-700 text-gray-300'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : user.role === 'owner' ? 'Car Owner' : 'Renter'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active'
                              ? 'bg-success/20 text-success'
                              : 'bg-error/20 text-error'
                          }`}>
                            {user.status === 'active' ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end space-x-2">
                            {user.role !== 'admin' && (
                              <>
                                {user.status === 'active' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-error"
                                    onClick={() => handleUserStatusChange(user.id, 'suspended')}
                                  >
                                    Suspend
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-success"
                                    onClick={() => handleUserStatusChange(user.id, 'active')}
                                  >
                                    Activate
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'cars' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Cars</h2>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Car</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Owner</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Daily Rate</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => {
                      const owner = users.find(u => u.id === car.ownerId);
                      return (
                        <tr key={car._id} className="border-b border-gray-700 hover:bg-background-light/30">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={car.images[0] ? `${API_BASE_URL}${car.images[0]}` : 'https://via.placeholder.com/150'}
                                alt=""
                                className="h-10 w-10 rounded-md object-cover mr-3"
                              />
                              <div>
                                <div className="text-white">{car.make} {car.model}</div>
                                <div className="text-xs text-gray-400">{car.year} • {car.type}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {owner?.avatar ? (
                                <img
                                  src={`${API_BASE_URL}${owner.avatar}`}
                                  alt={owner.name}
                                  className="h-8 w-8 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium mr-3">
                                  {owner?.name ? owner.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2) : 'U'}
                                </div>
                              )}
                              <div>
                                <div className="text-sm text-white">{owner?.name || 'Unknown'}</div>
                                <div className="text-xs text-gray-400">{owner?.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs rounded-full ${
                              car.approved
                                ? 'bg-success/20 text-success'
                                : 'bg-warning/20 text-warning'
                            }`}>
                              {car.approved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-white">
                            ¢{car.dailyRate}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-2">
                              <Link to={`/cars/${car._id}`}>
                                <Button variant="ghost" size="sm">View</Button>
                              </Link>
                              {!car.approved && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-success"
                                  onClick={() => handleCarApproval(car._id, true)}
                                >
                                  Approve
                                </Button>
                              )}
                              {car.approved && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-error"
                                  onClick={() => handleCarApproval(car._id, false)}
                                >
                                  Suspend
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
            </CardContent>
          </Card>
        )}

        {activeTab === 'bookings' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Bookings</h2>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Car</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Dates</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const car = cars.find(c => c._id === booking.carId);
                      const customer = users.find(u => u.id === booking.userId);
                      return (
                        <tr key={booking.id} className="border-b border-gray-700 hover:bg-background-light/30">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={car?.images[0] ? `${API_BASE_URL}${car.images[0]}` : 'https://via.placeholder.com/150'}
                                alt=""
                                className="h-8 w-8 rounded-md object-cover mr-2"
                              />
                              <div className="text-white">
                                {car ? `${car.make} ${car.model}` : 'Unknown Car'}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {customer?.avatar ? (
                                <img
                                  src={`http://localhost:5001${customer.avatar}`}
                                  alt={customer.name}
                                  className="h-8 w-8 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium mr-3">
                                  {customer?.name ? customer.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2) : 'U'}
                                </div>
                              )}
                              <div>
                                <div className="text-sm text-white">{customer?.name || 'Unknown'}</div>
                                <div className="text-xs text-gray-400">{customer?.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-primary mr-2" />
                              <span>
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-white">
                            ¢{booking.totalPrice}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed'
                                ? 'bg-success/20 text-success'
                                : booking.status === 'pending'
                                ? 'bg-warning/20 text-warning'
                                : booking.status === 'cancelled'
                                ? 'bg-error/20 text-error'
                                : 'bg-gray-700 text-gray-300'
                            }`}>
                              {booking.status === 'completed' && <CheckCircle className="h-4 w-4 mr-1" />}
                              {booking.status === 'pending' && <Clock className="h-4 w-4 mr-1" />}
                              <span className="capitalize">{booking.status}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;