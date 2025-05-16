import React, { useState } from 'react';
import { 
  Users, CarFront, Calendar, DollarSign, BarChart3, 
  Shield, Ban, CheckCircle, User, UserCog, Clock
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Car, User as UserType } from '../../types';

// Mock users data
const mockUsers: UserType[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'user',
    createdAt: '2023-06-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    role: 'user',
    createdAt: '2023-05-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'owner',
    createdAt: '2023-04-10T09:15:00Z',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'owner',
    createdAt: '2023-07-05T16:45:00Z',
  },
];

// Mock cars data awaiting approval
const mockPendingCars: Car[] = [
  {
    id: '10',
    ownerId: '3',
    make: 'Audi',
    model: 'Q7',
    year: 2023,
    type: 'SUV',
    description: 'Luxury SUV with advanced technology and spacious interior.',
    dailyRate: 120,
    location: 'Austin, TX',
    images: ['https://images.pexels.com/photos/4037509/pexels-photo-4037509.jpeg'],
    features: ['Quattro AWD', 'Panoramic Sunroof', 'Bang & Olufsen Sound', 'Virtual Cockpit'],
    availability: true,
    createdAt: '2023-07-28T14:45:00Z',
  },
  {
    id: '11',
    ownerId: '4',
    make: 'Ford',
    model: 'Mustang GT',
    year: 2022,
    type: 'Sports',
    description: 'Iconic American muscle car with powerful V8 engine.',
    dailyRate: 95,
    location: 'Atlanta, GA',
    images: ['https://images.pexels.com/photos/2127014/pexels-photo-2127014.jpeg'],
    features: ['5.0L V8', 'Premium Sound', 'Leather Seats', 'Track Mode'],
    availability: true,
    createdAt: '2023-07-26T11:30:00Z',
  },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'cars' | 'bookings'>('overview');

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
                <h3 className="text-lg font-semibold text-white">128</h3>
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
                <h3 className="text-lg font-semibold text-white">75</h3>
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
                <h3 className="text-lg font-semibold text-white">214</h3>
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
                <h3 className="text-lg font-semibold text-white">$24,680</h3>
                <p className="text-gray-400">Revenue</p>
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
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white">New Signups</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-background-light rounded-lg">
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <h3 className="font-medium text-white">18 new users</h3>
                        <p className="text-sm text-gray-400">registered this week</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white">Pending Approvals</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-background-light rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-warning mr-3" />
                      <div>
                        <h3 className="font-medium text-white">{mockPendingCars.length} cars</h3>
                        <p className="text-sm text-gray-400">waiting for approval</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('cars')}>Review</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1 border-b border-gray-700 pb-4">
                      <div className="text-sm text-white font-medium">New user registered</div>
                      <div className="text-sm text-gray-400">Alex Johnson created an account as a renter</div>
                      <div className="text-xs text-gray-500 mt-1">1 hour ago</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center">
                        <CarFront className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1 border-b border-gray-700 pb-4">
                      <div className="text-sm text-white font-medium">Car listing approved</div>
                      <div className="text-sm text-gray-400">You approved a BMW X3 listing by Michael Brown</div>
                      <div className="text-xs text-gray-500 mt-1">3 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-warning flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1 border-b border-gray-700 pb-4">
                      <div className="text-sm text-white font-medium">New booking</div>
                      <div className="text-sm text-gray-400">John Smith booked a Tesla Model 3 from Emily Johnson</div>
                      <div className="text-xs text-gray-500 mt-1">5 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-error flex items-center justify-center">
                        <Ban className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm text-white font-medium">Listing removed</div>
                      <div className="text-sm text-gray-400">You removed a car listing that violated platform policies</div>
                      <div className="text-xs text-gray-500 mt-1">1 day ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">All Users</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="bg-background-light text-white border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button variant="outline" size="sm">Search</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-700 hover:bg-background-light/30">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-background-light rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-4">
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
                          <div className="text-sm text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" icon={<UserCog className="h-4 w-4 mr-1" />}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-error" icon={<Ban className="h-4 w-4 mr-1" />}>
                              Suspend
                            </Button>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Pending Car Approvals</h2>
              </CardHeader>
              <CardContent>
                {mockPendingCars.length > 0 ? (
                  <div className="space-y-6">
                    {mockPendingCars.map((car) => (
                      <div key={car.id} className="bg-background-light p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/4">
                            <img
                              src={car.images[0]}
                              alt={`${car.make} ${car.model}`}
                              className="w-full h-40 object-cover rounded-md"
                            />
                          </div>
                          <div className="md:w-3/4">
                            <div className="flex justify-between mb-2">
                              <h3 className="text-lg font-semibold text-white">{car.make} {car.model} ({car.year})</h3>
                              <span className="bg-warning/20 text-warning px-2 py-1 text-xs rounded-full">Pending Approval</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 mb-4">
                              <div className="text-sm text-gray-300">
                                <span className="text-gray-400">Type:</span> {car.type}
                              </div>
                              <div className="text-sm text-gray-300">
                                <span className="text-gray-400">Location:</span> {car.location}
                              </div>
                              <div className="text-sm text-gray-300">
                                <span className="text-gray-400">Daily Rate:</span> ${car.dailyRate}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-300 mb-4 line-clamp-2">{car.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {car.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="bg-background text-xs rounded-full px-2 py-1 text-gray-300"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                              <Button 
                                variant="primary" 
                                size="sm"
                                icon={<CheckCircle className="h-4 w-4 mr-1" />}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-error border-error hover:bg-error/10"
                                icon={<Ban className="h-4 w-4 mr-1" />}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No pending approvals</h3>
                    <p className="text-gray-400">All car listings have been reviewed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'bookings' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">All Bookings</h2>
                <div className="flex items-center space-x-2">
                  <select className="bg-background-light text-white border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Button variant="outline" size="sm">Filter</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Booking management</h3>
                <p className="text-gray-400 mb-6">This section allows you to manage all bookings on the platform</p>
                <Button variant="primary">View All Bookings</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;