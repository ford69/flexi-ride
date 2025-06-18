interface PaymentConfig {
  email: string;
  amount: number;
  reference?: string;
  currency?: string;
  metadata?: {
    onSuccess?: (response: PaystackResponse) => void;
    onClose?: () => void;
    [key: string]: any;
  };
}

interface PaystackResponse {
  reference: string;
  status: 'success' | 'failed';
  trans: string;
  transaction: string;
  message: string;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => { openIframe: () => void };
    };
  }
}

export class PaymentService {
  private readonly publicKey: string;
  private readonly currency: string;

  constructor() {
    const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!key) {
      throw new Error('Paystack public key not found. Please set VITE_PAYSTACK_PUBLIC_KEY in your environment.');
    }
    this.publicKey = key;
    // Set default currency to GHS (Ghana Cedis) - you can change this to your preferred currency
    this.currency = 'GHS';
  }

  generateReference(): string {
    const timestamp = new Date().getTime();
    return `FLEXIRIDE_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async initializePayment(config: PaymentConfig): Promise<void> {
    const handler = window.PaystackPop.setup({
      key: this.publicKey,
      email: config.email,
      amount: config.amount * 100, // Convert to pesewas/kobo
      currency: config.currency || this.currency,
      ref: config.reference || this.generateReference(),
      metadata: {
        ...config.metadata,
        app_name: 'FlexiRide',
      },
      callback: (response: PaystackResponse) => {
        if (response.status === 'success') {
          // Payment successful
          if (config.metadata?.onSuccess) {
            config.metadata.onSuccess(response);
          }
        }
      },
      onClose: () => {
        // Handle popup closed
        if (config.metadata?.onClose) {
          config.metadata.onClose();
        }
      },
    });
    handler.openIframe();
  }
} 