import React from 'react';
import PaymentButton from './PaymentButton';

interface PaystackResponse {
  reference: string;
  status: 'success' | 'failed';
  trans: string;
  transaction: string;
  message: string;
}

const TestPayment: React.FC = () => {
  const handleSuccess = (response: PaystackResponse) => {
    console.log('Payment successful:', response);
    alert('Payment successful! Reference: ' + response.reference);
  };

  const handleClose = () => {
    console.log('Payment window closed');
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Test Payment</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-2">Test Card Details:</p>
          <ul className="text-sm space-y-1">
            <li>Card Number: 4084 0840 8408 4081</li>
            <li>Expiry: Any future date</li>
            <li>CVV: 408</li>
            <li>PIN: 0000</li>
            <li>OTP: 123456</li>
          </ul>
        </div>
        
        <PaymentButton
          amount={1} // 1 GHS
          email="test@example.com"
          currency="GHS"
          onSuccess={handleSuccess}
          onClose={handleClose}
        >
          Test Payment (GH₵1)
        </PaymentButton>

        <div className="mt-4 text-sm text-gray-400">
          <p>API Key Status: {import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ? 'Set' : 'Not Set'}</p>
        </div>
      </div>
    </div>
  );
};

export default TestPayment; 