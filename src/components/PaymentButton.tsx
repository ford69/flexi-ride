import React from 'react';
import { PaymentService } from '../services/paymentService';
import Button from './ui/Button';

interface PaystackResponse {
  reference: string;
  status: 'success' | 'failed';
  trans: string;
  transaction: string;
  message: string;
}

interface PaymentButtonProps {
  amount: number;
  email: string;
  currency?: string;
  onSuccess?: (response: PaystackResponse) => void;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  email,
  currency = 'GHS',
  onSuccess,
  onClose,
  className,
  children,
}) => {
  const paymentService = new PaymentService();

  const handlePayment = async () => {
    try {
      await paymentService.initializePayment({
        amount,
        email,
        currency,
        metadata: {
          onSuccess,
          onClose,
        },
      });
    } catch (error) {
      console.error('Payment initialization failed:', error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      variant="primary"
      className={className}
    >
      {children || 'Pay Now'}
    </Button>
  );
};

export default PaymentButton; 