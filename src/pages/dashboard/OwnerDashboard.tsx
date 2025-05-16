import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car as CarIcon, DollarSign, Users, PlusCircle, Calendar, Clock, 
  Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Car, Booking } from '../../types';

// Mock cars data
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
];

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: '1',
    carId: '1',
    userId: 'user1',
    startDate: '2023-08-10',
    endDate: '2023-08-15',
    totalPrice: 445,
    status: 'confirmed',
    createdAt: '2023-07-29T15:30:00Z',
  },
  {
    id: '2',
    carId: '5',
    userId: 'user2',
    startDate: '2023-09-20',
    endDate: '2023-09-25',
    totalPrice: 875,
    status: 'pending',
    createdAt: '2023-07-30T10:45:00Z',
  },
  {
    id: '3',
    carId: '1',
    userId: 'user3',
    startDate: '2023-07-05',
    endDate: '2023-07-10',
    totalPrice: 445,
    status: 'completed',
    createdAt: '2023-06-20T08:15:00Z',
  },
];

// Mock users data
const mockUsers = {
  'user1': { name: 'John Smith' },
  'user2': { name: 'Emily Johnson' },
  'user3': { name: 'Michael Brown' },
};

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'cars' | 'bookings'>('cars');

  const totalEarnings = mockBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const pendingBookings = mockBookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = mockBookings.filter(b => b.status === 'confirmed').length;

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
            <h1 className="text-3xl font-bold text-white">Owner Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your listings and bookings</p>
          </div>
          <Link to="/owner/add-car">
            <Button variant="primary" className="mt-4 md:mt-0" icon={<PlusCircle className="h-5 w-5 mr-1" />}>
              Add New Car
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <CarIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{mockCars.length}</h3>
                <p className="text-gray-400">Active Listings</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">${totalEarnings}</h3>
                <p className="text-gray-400">Total Earnings</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background-card">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{pendingBookings + confirmedBookings}</h3>
                <p className="text-gray-400">Active Bookings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-700">
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
        </div>

        {activeTab === 'cars' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">My Cars</h2>
            </CardHeader>
            <CardContent>
              {mockCars.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Car</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Daily Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bookings</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCars.map((car) => (
                        <tr key={car.id} className="border-b border-gray-700 hover:bg-background-light/30">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={car.images[0]}
                                  alt={`${car.make} ${car.model}`}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{car.make} {car.model}</div>
                                <div className="text-xs text-gray-400">{car.year} • {car.type}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              car.availability ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                            }`}>
                              {car.availability ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">${car.dailyRate}/day</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{car.location}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              {mockBookings.filter(b => b.carId === car.id).length} bookings
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end space-x-2">
                              <Link to={`/cars/${car.id}`}>
                                <Button variant="ghost" size="sm" icon={<Eye className="h-4 w-4 mr-1" />}>
                                  View
                                </Button>
                              </Link>
                              <Link to={`/owner/edit-car/${car.id}`}>
                                <Button variant="ghost" size="sm" icon={<Edit className="h-4 w-4 mr-1" />}>
                                  Edit
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="text-error" icon={<Trash2 className="h-4 w-4 mr-1" />}>
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
                <div className="text-center py-12">
                  <CarIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No cars listed yet</h3>
                  <p className="text-gray-400 mb-6">Add your first car to start earning</p>
                  <Link to="/owner/add-car">
                    <Button variant="primary" icon={<PlusCircle className="h-5 w-5 mr-1" />}>
                      Add New Car
                    </Button>
                  </Link>
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
              {mockBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Car</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dates</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBookings.map((booking) => {
                        const car = mockCars.find(c => c.id === booking.carId);
                        return (
                          <tr key={booking.id} className="border-b border-gray-700 hover:bg-background-light/30">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={car?.images[0]}
                                    alt={car ? `${car.make} ${car.model}` : 'Car'}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">
                                    {car ? `${car.make} ${car.model}` : 'Unknown Car'}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {car?.year} • {car?.type}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {mockUsers[booking.userId as keyof typeof mockUsers]?.name || 'Unknown User'}
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
                                <span className="ml-1 capitalize">{booking.status}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex justify-end space-x-2">
                                {booking.status === 'pending' && (
                                  <>
                                    <Button variant="primary" size="sm">
                                      Accept
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-error border-error hover:bg-error/10">
                                      Decline
                                    </Button>
                                  </>
                                )}
                                {booking.status === 'confirmed' && (
                                  <Button variant="outline" size="sm">
                                    Contact Renter
                                  </Button>
                                )}
                                {booking.status === 'completed' && (
                                  <Button variant="ghost" size="sm">
                                    View Details
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
                  <h3 className="text-lg font-medium text-white mb-2">No bookings yet</h3>
                  <p className="text-gray-400">When customers book your cars, they'll appear here</p>
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