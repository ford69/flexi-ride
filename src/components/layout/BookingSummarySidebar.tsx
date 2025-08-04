import React from 'react';

interface BookingData {
  from?: string;
  to?: string;
  pickupDate?: string;
  pickupTime?: string;
  passengers?: number;
  return?: boolean;
  name?: string;
  email?: string;
  whatsapp?: string;
  serviceType?: string;
}

interface BookingSummarySidebarProps {
  bookingData: BookingData;
}

const BookingSummarySidebar: React.FC<BookingSummarySidebarProps> = ({ bookingData }) => {
  if (!bookingData) {
    return null;
  }

  const { from, to, pickupDate, pickupTime, passengers, return: returnTrip, name, email, whatsapp, serviceType } = bookingData;

  const DetailItem = ({ label, value }: { label: string; value?: string | number | boolean }) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    return (
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">{displayValue}</span>
      </div>
    );
  };

  return (
    <aside className="w-full lg:w-80 bg-gray-50 rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <h3 className="font-bold text-xl text-gray-900 mb-6">Your Booking</h3>
        
        {/* Trip Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 text-sm border-b pb-2">Trip Details</h4>
          <DetailItem label="Type" value={serviceType} />
          
          <div className="flex items-start space-x-4">
            {/* Uber-style line connector */}
            <div className="flex flex-col items-center h-full mt-1">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="text-sm">
                <span className="text-gray-500">From</span>
                <p className="font-medium text-gray-800">{from}</p>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">To</span>
                <p className="font-medium text-gray-800">{to}</p>
              </div>
            </div>
          </div>

          <DetailItem label="Pickup Date" value={pickupDate} />
          <DetailItem label="Pickup Time" value={pickupTime} />
          <DetailItem label="Passengers" value={passengers} />
          <DetailItem label="Return" value={returnTrip} />
        </div>
      </div>
      
      <div className="border-t pt-6 space-y-4">
        <h4 className="font-semibold text-gray-700 text-sm border-b pb-2">Contact Info</h4>
        <DetailItem label="Name" value={name} />
        <DetailItem label="Email" value={email} />
        <DetailItem label="WhatsApp" value={whatsapp} />
      </div>
    </aside>
  );
};

export default BookingSummarySidebar; 