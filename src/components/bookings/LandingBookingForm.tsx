import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import LocationInput from '../ui/LocationInput';
import PhoneInput from '../ui/PhoneInput';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { serviceTypeService, ServiceType } from '../../services/serviceTypeService';

interface FormState {
  [key: string]: string | number | boolean;
  name: string;
  whatsapp: string;
  email: string;
  serviceType: string;
  from: string;
  to: string;
  airportPickupDate: string;
  airportPickupTime: string;
  airportReturn: boolean;
  airportPassengers: number;
  airportFlightNumber: string;
  airportTerminal: string;
  dailyStart: string;
  dailyEnd: string;
  dailyPickup: string;
  dailyPassengers: number;
  withDriver: boolean;
  outTownCity: string;
  outTownPickup: string;
  outTownDate: string;
  outTownTime: string;
  outTownDays: string;
  outTownPassengers: number;
  outTownReturn: boolean;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  duration: string;
  hourlyPassengers: number;
}

const initialState: FormState = {
  name: '',
  whatsapp: '',
  email: '',
  serviceType: 'airport',
  from: '',
  to: '',
  airportPickupDate: '',
  airportPickupTime: '',
  airportReturn: false,
  airportPassengers: 1,
  airportFlightNumber: '',
  airportTerminal: '',
  dailyStart: '',
  dailyEnd: '',
  dailyPickup: '',
  dailyPassengers: 1,
  withDriver: false,
  outTownCity: '',
  outTownPickup: '',
  outTownDate: '',
  outTownTime: '',
  outTownDays: '',
  outTownPassengers: 1,
  outTownReturn: false,
  pickupAddress: '',
  pickupDate: '',
  pickupTime: '',
  duration: '',
  hourlyPassengers: 1,
};

const LandingBookingForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [activeTab, setActiveTab] = useState('airport');
  const [loading, setLoading] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const navigate = useNavigate();

  // Fetch service types on component mount
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const types = await serviceTypeService.getServiceTypes();
        setServiceTypes(types);
        // Set default active tab to first service type
        if (types.length > 0) {
          setActiveTab(types[0].code);
          setForm(prev => ({ ...prev, serviceType: types[0].code }));
        }
      } catch (error) {
        console.error('Failed to fetch service types:', error);
      }
    };
    fetchServiceTypes();
  }, []);

  const SERVICE_TABS = serviceTypes.map(st => ({
    value: st.code,
    label: st.name
  }));

  const handleTab = (tab: string) => {
    setActiveTab(tab);
    setForm((prev) => ({ ...prev, serviceType: tab }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | number | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handlePassengers = (field: string, delta: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: Math.max(1, Number(prev[field]) + delta),
    }));
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name) errs.name = 'Full name is required';
    if (!form.whatsapp) errs.whatsapp = 'WhatsApp number is required';
    if (!form.email) errs.email = 'Email is required';
    if (activeTab === 'airport') {
      if (!form.from) errs.from = 'From address required';
      if (!form.to) errs.to = 'To address required';
      if (!form.airportPickupDate) errs.airportPickupDate = 'Pickup date required';
      if (!form.airportPickupTime) errs.airportPickupTime = 'Pickup time required';
      if (!form.airportFlightNumber) errs.airportFlightNumber = 'Flight number required';
      if (!form.airportTerminal) errs.airportTerminal = 'Terminal required';
    } else if (activeTab === 'daily') {
      if (!form.dailyStart) errs.dailyStart = 'Start date required';
      if (!form.dailyEnd) errs.dailyEnd = 'End date required';
      if (!form.dailyPickup) errs.dailyPickup = 'Pickup location required';
    } else if (activeTab === 'out-of-town') {
      if (!form.outTownCity) errs.outTownCity = 'Destination city required';
      if (!form.outTownPickup) errs.outTownPickup = 'Pickup location required';
      if (!form.outTownDate) errs.outTownDate = 'Pickup date required';
      if (!form.outTownTime) errs.outTownTime = 'Pickup time required';
      if (!form.outTownDays) errs.outTownDays = 'Number of days required';
    } else if (activeTab === 'hourly') {
      if (!form.pickupAddress) errs.pickupAddress = 'Pickup address required';
      if (!form.pickupDate) errs.pickupDate = 'Pickup date required';
      if (!form.pickupTime) errs.pickupTime = 'Pickup time required';
      if (!form.duration) errs.duration = 'Duration required';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      console.log('Validation errors:', errs);
      return;
    }
    setLoading(true);
    // Build query params
    const params: { [key: string]: string } = {
      name: form.name,
      whatsapp: form.whatsapp,
      email: form.email,
      serviceType: activeTab,
    };
    if (activeTab === 'airport') {
      params.from = form.from;
      params.to = form.to;
      params.pickupDate = form.airportPickupDate;
      params.pickupTime = form.airportPickupTime;
      params.return = form.airportReturn ? 'yes' : 'no';
      params.passengers = String(form.airportPassengers);
      params.flightNumber = form.airportFlightNumber;
      params.terminal = form.airportTerminal;
    } else if (activeTab === 'daily') {
      params.start = form.dailyStart;
      params.end = form.dailyEnd;
      params.pickup = form.dailyPickup;
      params.passengers = String(form.dailyPassengers);
      params.withDriver = form.withDriver ? 'yes' : 'no';
    } else if (activeTab === 'out-of-town') {
      params.city = form.outTownCity;
      params.pickup = form.outTownPickup;
      params.date = form.outTownDate;
      params.time = form.outTownTime;
      params.days = form.outTownDays;
      params.passengers = String(form.outTownPassengers);
      params.return = form.outTownReturn ? 'yes' : 'no';
    } else if (activeTab === 'hourly') {
      params.pickupAddress = form.pickupAddress;
      params.pickupDate = form.pickupDate;
      params.pickupTime = form.pickupTime;
      params.duration = form.duration;
      params.passengers = String(form.hourlyPassengers);
    }
    // Save booking data to localStorage
    localStorage.setItem('bookingData', JSON.stringify({ ...form, serviceType: activeTab }));
    // Redirect
    const query = new URLSearchParams(params).toString();
    setTimeout(() => {
      setLoading(false);
      navigate(`/cars?${query}`);
    }, 1200);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mt-0 md:mt-14">
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          {SERVICE_TABS.map(tab => (
            <button
              key={tab.value}
              type="button"
              className={`flex-1 py-2 px-2 text-sm font-semibold focus:outline-none transition-colors border-b-2 ${activeTab === tab.value ? 'border-gray-500 text-gray-700' : 'border-transparent text-black hover:text-gray-600'}`}
              onClick={() => handleTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <input
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            placeholder="Full Name"
            name="name"
            value={form.name as string}
            onChange={handleChange}
            required
          />
          <PhoneInput
            value={form.whatsapp as string}
            onChange={(value) => setForm(prev => ({ ...prev, whatsapp: value }))}
            placeholder="WhatsApp Number"
            required
          />
          <input
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            placeholder="Email Address"
            name="email"
            value={form.email as string}
            onChange={handleChange}
            required
          />
          {/* Airport Transfer Tab */}
          {activeTab === 'airport' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 z-10" />
                  <LocationInput
                    value={form.from || ""}
                    onSelect={(details) => setForm(prev => ({ ...prev, from: details.address }))}
                    placeholder=""
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 z-10" />
                  <LocationInput
                    value={form.to || ""}
                    onSelect={(details) => setForm(prev => ({ ...prev, to: details.address }))}
                    placeholder=""
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-3 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                      placeholder="Pickup date"
                      name="airportPickupDate"
                      value={form.airportPickupDate as string}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="time"
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-3 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                      placeholder="Pickup time"
                      name="airportPickupTime"
                      value={form.airportPickupTime as string}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              placeholder="Flight Number"
              name="airportFlightNumber"
              value={form.airportFlightNumber as string}
              onChange={handleChange}
              required
            />
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              placeholder="Terminal"
              name="airportTerminal"
              value={form.airportTerminal as string}
              onChange={handleChange}
              required
            />
          </div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input type="checkbox" name="airportReturn" checked={!!form.airportReturn} onChange={handleChange} className="mr-2" />
            Add Return
          </label>
          <div className="flex items-center gap-2 mt-2">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">Passengers</span>
            <button type="button" className="ml-2 px-2 py-1 bg-gray-200 rounded" onClick={() => handlePassengers('airportPassengers', -1)}>-</button>
            <span className="px-2 text-gray-500">{form.airportPassengers}</span>
            <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => handlePassengers('airportPassengers', 1)}>+</button>
          </div>
            </div>
          )}
          {/* Daily Rental Tab */}
          {activeTab === 'daily' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Start Date"
                  name="dailyStart"
                  value={form.dailyStart as string}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="End Date"
                  name="dailyEnd"
                  value={form.dailyEnd as string}
                  onChange={handleChange}
                  required
                />
              </div>
              <LocationInput
                value={form.dailyPickup || ""}
                onSelect={(details) => setForm(prev => ({ ...prev, dailyPickup: details.address }))}
                placeholder="Pickup Location"
              />
              {/* <label className="flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" name="withDriver" checked={!!form.withDriver} onChange={handleChange} className="mr-2" />
                With Driver
              </label> */}
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Passengers</span>
                <button type="button" className="ml-2 px-2 py-1 bg-gray-200 rounded" onClick={() => handlePassengers('dailyPassengers', -1)}>-</button>
                <span className="px-2 text-gray-500">{form.dailyPassengers}</span>
                <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => handlePassengers('dailyPassengers', 1)}>+</button>
              </div>
            </div>
          )}
          {/* Out of Town Trip Tab */}
          {activeTab === 'out-of-town' && (
            <div className="space-y-4 animate-fade-in">
              <LocationInput
                value={form.outTownCity || ""}
                onSelect={(details) => setForm(prev => ({ ...prev, outTownCity: details.address }))}
                placeholder="Destination City"
              />
              <LocationInput
                value={form.outTownPickup || ""}
                onSelect={(details) => setForm(prev => ({ ...prev, outTownPickup: details.address }))}
                placeholder="Pickup Location"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Pickup Date"
                  name="outTownDate"
                  value={form.outTownDate as string}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Pickup Time"
                  name="outTownTime"
                  value={form.outTownTime as string}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="number"
                min={1}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                placeholder="Days"
                name="outTownDays"
                value={form.outTownDays as string}
                onChange={handleChange}
                required
              />
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" name="outTownReturn" checked={!!form.outTownReturn} onChange={handleChange} className="mr-2" />
                Return Trip
              </label>
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Passengers</span>
                <button type="button" className="ml-2 px-2 py-1 bg-gray-200 rounded" onClick={() => handlePassengers('outTownPassengers', -1)}>-</button>
                <span className="px-2 text-gray-500">{form.outTownPassengers}</span>
                <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => handlePassengers('outTownPassengers', 1)}>+</button>
              </div>
            </div>
          )}
          
          {/* Hourly Ride Tab */}
          {activeTab === 'hourly' && (
            <div className="space-y-4 animate-fade-in">
              <LocationInput
                value={form.pickupAddress || ""}
                onSelect={(details) => setForm(prev => ({ ...prev, pickupAddress: details.address }))}
                placeholder="Pickup Address"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Pickup Date"
                  name="pickupDate"
                  value={form.pickupDate as string}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Pickup Time"
                  name="pickupTime"
                  value={form.pickupTime as string}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="number"
                min={1}
                max={11}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                placeholder="Duration (hrs)"
                name="duration"
                value={form.duration as string}
                onChange={handleChange}
                required
              />
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Passengers</span>
                <button type="button" className="ml-2 px-2 py-1 bg-gray-200 rounded" onClick={() => handlePassengers('hourlyPassengers', -1)}>-</button>
                <span className="px-2 text-gray-500">{form.hourlyPassengers}</span>
                <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => handlePassengers('hourlyPassengers', 1)}>+</button>
              </div>
            </div>
          )}
          <Button type="submit" variant="primary" className="w-full bg-gradient-to-r from-black to-black text-white font-bold rounded-lg py-3 mt-4 shadow-lg hover:from-gray-600 hover:to-gray-800 transition-all">Search</Button>
        </form>
      </div>
    </>
  );
};

export default LandingBookingForm; 