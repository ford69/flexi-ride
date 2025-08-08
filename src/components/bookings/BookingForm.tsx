import React, { useState } from 'react';
import { Calendar, Coins, MapPin, Users, Briefcase, Clock, Car as CarIcon, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardContent, CardHeader, CardFooter } from '../ui/Card';
import { Car } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { useNavigate } from 'react-router-dom';
import PaymentButton from '../PaymentButton';
import { buildApiUrl, API_ENDPOINTS } from '../../config/api';
import { alertMessages } from '../../utils/alerts';

interface PaystackResponse {
  reference: string;
  status: string;
  message: string;
}

interface BookingFormProps {
  car: Car;
  bookingData?: Record<string, unknown> | null;
}

const BookingForm: React.FC<BookingFormProps> = ({ car, bookingData }) => {
  const { isAuthenticated, user } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const getString = (val: unknown): string => (typeof val === 'string' ? val : '');
  const getNumber = (val: unknown): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };
  const getBoolean = (val: unknown): boolean => !!val;
  
  // Always ensure bookingData includes the selected car's service types
  const mergedBookingData: Record<string, unknown> = { ...(bookingData || {}) };

  // Unified editable state for all booking fields
  const [fields, setFields] = useState(() => ({
    // Dates
    startDate: getString(mergedBookingData?.startDate || mergedBookingData?.dailyStart || mergedBookingData?.airportPickupDate || mergedBookingData?.outTownDate || mergedBookingData?.pickupDate),
    endDate: getString(mergedBookingData?.endDate || mergedBookingData?.dailyEnd),
    // Airport
    flightNumber: getString(mergedBookingData?.flightNumber || mergedBookingData?.airportFlightNumber),
    terminal: getString(mergedBookingData?.terminal || mergedBookingData?.airportTerminal),
    airportPickupTime: getString(mergedBookingData?.airportPickupTime),
    from: getString(mergedBookingData?.from),
    to: getString(mergedBookingData?.to),
    airportPassengers: getNumber(mergedBookingData?.airportPassengers),
    // Daily
    dailyPickup: getString(mergedBookingData?.dailyPickup),
    dailyPassengers: getNumber(mergedBookingData?.dailyPassengers),
    withDriver: getBoolean(mergedBookingData?.withDriver),
    // Out of Town
    outTownCity: getString(mergedBookingData?.outTownCity),
    outTownPickup: getString(mergedBookingData?.outTownPickup),
    outTownDays: getString(mergedBookingData?.outTownDays),
    outTownPassengers: getNumber(mergedBookingData?.outTownPassengers),
    outTownReturn: getBoolean(mergedBookingData?.outTownReturn),
    // Hourly
    pickupAddress: getString(mergedBookingData?.pickupAddress),
    duration: getString(mergedBookingData?.duration),
    hourlyPassengers: getNumber(mergedBookingData?.hourlyPassengers),
    // General
    name: getString(mergedBookingData?.name),
    email: getString(mergedBookingData?.email),
    whatsapp: getString(mergedBookingData?.whatsapp),
    serviceType: getString(mergedBookingData?.serviceType),
    return: mergedBookingData?.return ?? false,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const serviceType = fields.serviceType;

  // Use startDate for endDate if endDate is missing, to match payload logic
  const calculateDays = () => {
    if (!fields.startDate) return 0;
    const endDateToUse = fields.endDate && fields.endDate !== '' ? fields.endDate : fields.startDate;
    const start = new Date(fields.startDate);
    const end = new Date(endDateToUse);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const getServiceTypePrice = () => {
    if (!serviceType || !car.serviceTypes || car.serviceTypes.length === 0) {
      return 0;
    }
    
    const selectedService = car.serviceTypes.find(st => 
      st.serviceTypeId && st.serviceTypeId.code === serviceType
    );
    
    return selectedService?.displayPrice || selectedService?.totalPrice || selectedService?.basePrice || 0;
  };

  const calculateTotalPrice = () => {
    const servicePrice = getServiceTypePrice();
    if (servicePrice === 0) return 0;
    
    let totalPrice = 0;
    
    if (serviceType === 'daily' || serviceType === 'out-of-town') {
      const days = calculateDays();
      totalPrice = days * servicePrice;
    } else if (serviceType === 'hourly') {
      const hours = parseInt(fields.duration) || 1;
      totalPrice = hours * servicePrice;
    } else if (serviceType === 'airport') {
      totalPrice = servicePrice; // Per trip pricing
    }
    
    return totalPrice; // Service charge is already included in the price
  };

  const calculateBasePrice = () => {
    const servicePrice = getServiceTypePrice();
    if (servicePrice === 0) return 0;
    
    // Extract base price from total price (remove service charge)
    const basePricePerUnit = Math.round(servicePrice / 1.25);
    
    if (serviceType === 'daily' || serviceType === 'out-of-town') {
      const days = calculateDays();
      return days * basePricePerUnit;
    } else if (serviceType === 'hourly') {
      const hours = parseInt(fields.duration) || 1;
      return hours * basePricePerUnit;
    } else if (serviceType === 'airport') {
      return basePricePerUnit; // Per trip pricing
    }
    
    return 0;
  };

  const calculateServiceCharge = () => {
    return calculateTotalPrice() - calculateBasePrice();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || hasSubmitted) return;
    
    // Debug authentication state
    console.log('[BookingForm] Authentication check:', {
      isAuthenticated,
      user: user?.email,
      hasToken: !!localStorage.getItem('token')
    });
    
    if (!isAuthenticated) {
      console.log('[BookingForm] User not authenticated, redirecting to login');
      navigate('/login', { state: { from: `/cars/${car._id}` } });
      return;
    }
    

    // Always require endDate for backend validation; default to startDate if not set
    let endDateToUse = fields.endDate;
    if (!fields.endDate && fields.startDate) {
      endDateToUse = fields.startDate;
    }

    if (!fields.startDate || !endDateToUse) {
      showAlert({
        type: 'error',
        title: 'Missing Date',
        message:
          !fields.startDate
            ? 'Please select a start date.'
            : 'Please select an end date.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Debug token
      console.log('[BookingForm] Token check:', {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenStart: token?.substring(0, 20) + '...'
      });
      
      if (!token) {
        showAlert({
          type: 'error',
          title: 'Authentication Error',
          message: 'Please log in to create a booking.'
        });
        navigate('/login', { state: { from: `/cars/${car._id}` } });
        return;
      }
      
      // Build payload, only including non-empty values
      // Clean payload: only send fields relevant to the selected serviceType

      const payload: Record<string, unknown> = {
        carId: car._id,
        status: 'pending',
        totalPrice: calculateTotalPrice(),
        price: getServiceTypePrice(), // Add the service type price to the payload
        serviceType,
        name: fields.name,
        email: fields.email,
        whatsapp: fields.whatsapp,
        startDate: fields.startDate,
        endDate: endDateToUse,
      };

      if (serviceType === 'airport') {
        payload.from = fields.from;
        payload.to = fields.to;
        payload.flightNumber = fields.flightNumber;
        payload.terminal = fields.terminal;
        payload.airportPickupTime = fields.airportPickupTime;
        payload.airportPassengers = fields.airportPassengers;
        payload.return = fields.return;
      } else if (serviceType === 'daily') {
        payload.dailyPickup = fields.dailyPickup;
        payload.dailyPassengers = fields.dailyPassengers;
        payload.withDriver = fields.withDriver;
      } else if (serviceType === 'out-of-town') {
        payload.outTownCity = fields.outTownCity;
        payload.outTownPickup = fields.outTownPickup;
        payload.outTownDays = fields.outTownDays;
        payload.outTownPassengers = fields.outTownPassengers;
        payload.outTownReturn = fields.outTownReturn;
      } else if (serviceType === 'hourly') {
        payload.pickupAddress = fields.pickupAddress;
        payload.duration = fields.duration;
        payload.hourlyPassengers = fields.hourlyPassengers;
      }

      // Remove undefined, null, or empty string fields
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim() === '')
        ) {
          delete payload[key];
        }
      });

      // Debug: Log payload before sending
      console.log('[BookingForm] Submitting booking payload:', payload);
      console.log('[BookingForm] API URL:', buildApiUrl(API_ENDPOINTS.BOOKINGS.CREATE));
      console.log('[BookingForm] Authorization header:', `Bearer ${token?.substring(0, 20)}...`);

      const response = await fetch(buildApiUrl(API_ENDPOINTS.BOOKINGS.CREATE), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      // Debug: Log response status
      console.log('[BookingForm] Booking response status:', response.status);
      console.log('[BookingForm] Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        // Debug: Log booking response data
        // eslint-disable-next-line no-console
        console.log('[BookingForm] Booking created successfully:', data);
        setBookingId(data._id);
        setShowPayment(true);
        setHasSubmitted(true);
      } else {
        // Debug: Log error response
        let errorText = '';
        try {
          errorText = await response.text();
        } catch {
          errorText = 'Could not read error response';
        }
        console.error('[BookingForm] Booking failed. Status:', response.status, 'Response:', errorText);
        
        // Handle specific error cases
        if (response.status === 401) {
          showAlert({
            type: 'error',
            title: 'Authentication Error',
            message: 'Your session has expired. Please log in again.'
          });
          // Clear invalid token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { state: { from: `/cars/${car._id}` } });
          return;
        }
        
        throw new Error('Booking failed to create.');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[BookingForm] Error during booking submission:', err);
      showAlert({ type: 'error', ...alertMessages.bookingFailed });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (response: PaystackResponse) => {
    if (!bookingId) {
      setError('Payment successful but booking reference not found. Please contact support.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(buildApiUrl(API_ENDPOINTS.BOOKINGS.UPDATE(bookingId)), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ paymentStatus: 'paid', paymentReference: response.reference }),
      });

      showAlert({ type: 'success', ...alertMessages.paymentSuccess, duration: 8000 });
      navigate('/dashboard', { state: { bookingSuccess: true, message: 'Booking confirmed and payment processed successfully!' } });
    } catch {
      showAlert({ type: 'error', ...alertMessages.paymentPending });
    }
  };

  const handlePaymentClose = () => {
    setError('Payment was cancelled. Please try again.');
  };

  const renderBookingSummary = () => {
    if (!bookingData || !serviceType) return null;

    const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string | number | boolean }) => {
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        return null;
      }
      
      const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);

      return (
        <div className="flex items-center text-sm">
          <div className="w-5 mr-3 text-green-700">{icon}</div>
          <div className="flex-1">
            <span className="font-medium text-gray-500 mr-2">{label}:</span>
            <span className="font-semibold text-gray-900 break-words">{displayValue}</span>
          </div>
        </div>
      );
    };

    let serviceLabel = '';
    switch (serviceType) {
        case 'airport': serviceLabel = 'Airport Transfer'; break;
        case 'daily': serviceLabel = 'Daily Rental'; break;
        case 'out-of-town': serviceLabel = 'Out of Town'; break;
        case 'hourly': serviceLabel = 'Hourly Ride'; break;
        default: serviceLabel = 'Custom Request';
    }

    return (
        <div className="bg-green-50 p-4 rounded-xl space-y-3 mb-6 animate-fade-in border border-green-200">
            <h4 className="font-bold text-gray-800 text-base">Your Request Summary</h4>
            <div className="border-t border-green-200 my-2"></div>
            <DetailItem icon={<Briefcase size={16} />} label="Service" value={serviceLabel} />
            
            {serviceType === 'airport' && (
                <>
                    <DetailItem icon={<MapPin size={16} />} label="From" value={getString(bookingData.from)} />
                    <DetailItem icon={<MapPin size={16} />} label="To" value={getString(bookingData.to)} />
                    <DetailItem icon={<Users size={16} />} label="Passengers" value={getNumber(bookingData.airportPassengers)} />
                </>
            )}

            {serviceType === 'daily' && (
                <>
                    <DetailItem icon={<MapPin size={16} />} label="Pickup" value={getString(bookingData.dailyPickup)} />
                    <DetailItem icon={<Users size={16} />} label="Passengers" value={getNumber(bookingData.dailyPassengers)} />
                    <DetailItem icon={<CarIcon size={16} />} label="With Driver" value={getBoolean(bookingData.withDriver)} />
                </>
            )}

            {serviceType === 'out-of-town' && (
                <>
                    <DetailItem icon={<MapPin size={16} />} label="Destination" value={getString(bookingData.outTownCity)} />
                    <DetailItem icon={<MapPin size={16} />} label="Pickup" value={getString(bookingData.outTownPickup)} />
                    <DetailItem icon={<Calendar size={16} />} label="Days" value={getString(bookingData.outTownDays)} />
                    <DetailItem icon={<Users size={16} />} label="Passengers" value={getNumber(bookingData.outTownPassengers)} />
                    <DetailItem icon={<RefreshCw size={16} />} label="Return Trip" value={getBoolean(bookingData.outTownReturn)} />
                </>
            )}

            {serviceType === 'hourly' && (
                <>
                    <DetailItem icon={<MapPin size={16} />} label="Pickup" value={getString(bookingData.pickupAddress)} />
                    <DetailItem icon={<Clock size={16} />} label="Duration (hrs)" value={getString(bookingData.duration)} />
                    <DetailItem icon={<Users size={16} />} label="Passengers" value={getNumber(bookingData.hourlyPassengers)} />
                </>
            )}
        </div>
    );
  };


  return (
    <Card className="bg-white border-none shadow-2xl rounded-2xl">
      <CardHeader className="bg-[#277f75] border-b border-gray-100 pb-4">
        <h3 className="text-xl font-bold text-white">Book this car</h3>
      </CardHeader>
      {!user?.isVerified && isAuthenticated && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-4 py-3 rounded-md text-sm m-4">
          Please verify your email to book a ride.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {renderBookingSummary()}
          
          {/* Editable booking fields based on serviceType */}
          {serviceType === 'airport' && (
            <div className="space-y-4">
              <div>
                <Input
                  type="date"
                  label="Pickup Date"
                  value={fields.startDate}
                  onChange={e => setFields(f => ({ ...f, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                  icon={<Calendar className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <div className={`grid ${fields.return === true ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                {fields.return === true && (
                  <Input
                    type="date"
                    label="Return Date"
                    value={fields.endDate}
                    onChange={e => setFields(f => ({ ...f, endDate: e.target.value }))}
                    min={fields.startDate || new Date().toISOString().split('T')[0]}
                    required
                    className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                    icon={<Calendar className="h-5 w-5 text-gray-400" />}
                  />
                )}
                <Input
                  label="Flight Number"
                  type="text"
                  value={fields.flightNumber}
                  onChange={e => setFields(f => ({ ...f, flightNumber: e.target.value }))}
                  placeholder="e.g. KQ 511"
                  className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                  icon={<Briefcase className="h-5 w-5 text-gray-400" />}
                  required
                />
                <Input
                  label="Terminal"
                  type="text"
                  value={fields.terminal}
                  onChange={e => setFields(f => ({ ...f, terminal: e.target.value }))}
                  placeholder="e.g. Terminal 3"
                  className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                  icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  required
                />
              </div>
            </div>
          )}
          {serviceType === 'daily' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={fields.startDate}
                onChange={e => setFields(f => ({ ...f, startDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
              />
              <Input
                type="date"
                label="End Date"
                value={fields.endDate}
                onChange={e => setFields(f => ({ ...f, endDate: e.target.value }))}
                min={fields.startDate || new Date().toISOString().split('T')[0]}
                required
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
              />
            </div>
          )}
          {serviceType === 'out-of-town' && (
            <>
              <Input
                label="Destination City"
                type="text"
                value={fields.outTownCity}
                onChange={e => setFields(f => ({ ...f, outTownCity: e.target.value }))}
                placeholder="e.g. Kumasi"
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Pickup Location"
                type="text"
                value={fields.outTownPickup}
                onChange={e => setFields(f => ({ ...f, outTownPickup: e.target.value }))}
                placeholder="e.g. Accra Mall"
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  value={fields.startDate}
                  onChange={e => setFields(f => ({ ...f, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                  icon={<Calendar className="h-5 w-5 text-gray-400" />}
                />
                <Input
                  type="date"
                  label="End Date"
                  value={fields.endDate}
                  onChange={e => setFields(f => ({ ...f, endDate: e.target.value }))}
                  min={fields.startDate || new Date().toISOString().split('T')[0]}
                  required
                  className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                  icon={<Calendar className="h-5 w-5 text-gray-400" />}
                />
              </div>
            </>
          )}
          {serviceType === 'hourly' && (
            <>
              <Input
                label="Pickup Address"
                type="text"
                value={fields.pickupAddress}
                onChange={e => setFields(f => ({ ...f, pickupAddress: e.target.value }))}
                placeholder="e.g. 123 Main St, Accra"
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Duration (hours)"
                type="number"
                value={fields.duration}
                onChange={e => setFields(f => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 3"
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                icon={<Clock className="h-5 w-5 text-gray-400" />}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  value={fields.startDate}
                  onChange={e => setFields(f => ({ ...f, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                  icon={<Calendar className="h-5 w-5 text-gray-400" />}
                />
                <Input
                  type="date"
                  label="End Date"
                  value={fields.endDate}
                  onChange={e => setFields(f => ({ ...f, endDate: e.target.value }))}
                  min={fields.startDate || new Date().toISOString().split('T')[0]}
                  required
                  className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                  icon={<Calendar className="h-5 w-5 text-gray-400" />}
                />
              </div>
            </>
          )}
          {/* Default fallback for unknown serviceType */}
          {!serviceType && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={fields.startDate}
                onChange={e => setFields(f => ({ ...f, startDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
              />
              <Input
                type="date"
                label="End Date"
                value={fields.endDate}
                onChange={e => setFields(f => ({ ...f, endDate: e.target.value }))}
                min={fields.startDate || new Date().toISOString().split('T')[0]}
                required
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border-gray-300"
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
              />
            </div>
          )}

          {fields.startDate && fields.endDate && (
            <div className="bg-gray-100 p-4 rounded-xl animate-fade-in border border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Base Price:</span>
                  <span className="text-sm font-medium text-gray-800">₵{calculateBasePrice().toLocaleString()}</span>
          </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Service Charge (25%):</span>
                  <span className="text-sm font-medium text-gray-800">₵{calculateServiceCharge().toLocaleString()}</span>
              </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">Total Price:</span>
                    <div className="flex items-center text-gray-900">
                      <Coins className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-bold text-2xl">₵{calculateTotalPrice().toLocaleString()}</span>
              </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-right mt-2">
                {serviceType === 'daily' || serviceType === 'out-of-town' ? (
                  `${calculateDays()} ${calculateDays() > 1 ? 'days' : 'day'} at ₵${getServiceTypePrice().toLocaleString()}/day`
                ) : serviceType === 'hourly' ? (
                  `${fields.duration || 1} hour(s) at ₵${getServiceTypePrice().toLocaleString()}/hour`
                ) : serviceType === 'airport' ? (
                  `₵${getServiceTypePrice().toLocaleString()} per trip`
                ) : (
                  'Price varies by service type'
                )}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-white pt-6">
          {showPayment && user ? (
            <PaymentButton
              amount={calculateTotalPrice()}
              email={user.email}
              currency="GHS"
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
              className="w-full !py-3 !text-base !font-bold"
            >
              Pay GH₵{calculateTotalPrice()} Now
            </PaymentButton>
          ) : (
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="!py-3 !text-base !font-bold"
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