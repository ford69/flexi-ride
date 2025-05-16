import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, XCircle, AlertCircle, Car } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Booking } from '../../types';

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: '1',
    carId: '1',
    userId: '1',
    startDate: '2023-08-10',
    endDate: '2023-08-15',
    totalPrice: 445,
    status: 'confirmed',
    createdAt: '2023-07-29T15:30:00Z',
  },
  {
    id: '2',
    carId: '3',
    userId: '1',
    startDate: '2023-09-20',
    endDate: '2023-09-25',
    totalPrice: 995,
    status: 'pending',
    createdAt: '2023-07-30T10:45:00Z',
  },
  {
    id: '3',
    carId: '2',
    userId: '1',
    startDate: '2023-07-05',
    endDate: '2023-07-10',
    totalPrice: 550,
    status: 'completed',
    createdAt: '2023-06-20T08:15:00Z',
  },
  {
    id: '4',
    carId: '4',
    userId: '1',
    startDate: '2023-06-10',
    endDate: '2023-06-15',
    totalPrice: 325,
    status: 'cancelled',
    createdAt: '2023-05-25T14:20:00Z',
  },
];

// Mock data for cars to match with booking carIds
const mockCars = {
  '1': {
    make: 'Tesla',
    model: 'Model 3',
    image: 'https://images.pexels.com/photos/12861709/pexels-photo-12861709.jpeg',
  },
  '2': {
    make: 'BMW',
    model: 'X5',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
  },
  '3': {
    make: 'Porsche',
    model: '911',
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
  },
  '4': {
    make: 'Toyota',
    model: 'RAV4',
    image: 'https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg',
  },
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredBookings = mockBookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return booking.status === 'confirmed' || booking.status === 'pending';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

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
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-700 hover:bg-background-light/30">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={mockCars[booking.carId as keyof typeof mockCars]?.image}
                                alt="Car"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {mockCars[booking.carId as keyof typeof mockCars]?.make}{' '}
                                {mockCars[booking.carId as keyof typeof mockCars]?.model}
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
                              <Button variant="outline" size="sm" className="text-error border-error hover:bg-error/10">
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
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