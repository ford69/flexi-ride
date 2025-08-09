import { AlertType } from '../contexts/AlertContext';

export interface AlertOptions {
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

export const createAlert = (
  type: AlertType,
  options: AlertOptions
) => ({
  type,
  title: options.title,
  message: options.message,
  duration: options.duration,
  persistent: options.persistent,
});

// Common alert patterns
export const alertMessages = {
  // Success messages
  registrationSuccess: {
    title: 'Registration Successful!',
    message: 'Your account has been created successfully. Please check your email to verify your account.',
  },
  loginSuccess: {
    title: 'Login Successful!',
    message: 'Welcome back! You have been logged in successfully.',
  },
  bookingCreated: {
    title: 'Booking Created',
    message: 'Your booking has been created successfully. Please complete payment.',
  },
  paymentSuccess: {
    title: 'Payment Successful!',
    message: 'Your booking has been confirmed and payment processed successfully!',
  },
  bookingCancelled: {
    title: 'Booking Cancelled',
    message: 'Your booking has been cancelled successfully.',
  },
  statusUpdated: (status: string) => ({
    title: 'Status Updated',
    message: `Booking has been ${status} successfully.`,
  }),
  profileUpdated: {
    title: 'Profile Updated',
    message: 'Your profile has been updated successfully.',
  },
  carAdded: {
    title: 'Car Added Successfully!',
    message: 'Your car has been added to the platform successfully.',
  },
  carUpdated: {
    title: 'Car Updated',
    message: 'Your car has been updated successfully.',
  },
  carDeleted: {
    title: 'Car Deleted',
    message: 'Your car has been deleted successfully.',
  },

  // Error messages
  sessionExpired: {
    title: 'Session Expired',
    message: 'Your session has expired. Please login again.',
    persistent: true,
  },
  unauthorized: {
    title: 'Unauthorized',
    message: 'You are not authorized to perform this action.',
  },
  notFound: {
    title: 'Not Found',
    message: 'The requested resource was not found.',
  },
  networkError: {
    title: 'Network Error',
    message: 'Please check your internet connection and try again.',
  },
  serverError: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  },
  validationError: {
    title: 'Validation Error',
    message: 'Please check your input and try again.',
  },
  paymentFailed: {
    title: 'Payment Failed',
    message: 'Payment was not successful. Please try again.',
  },
  bookingFailed: {
    title: 'Booking Failed',
    message: 'Failed to create booking. Please try again.',
  },
  updateFailed: {
    title: 'Update Failed',
    message: 'Failed to update. Please try again.',
  },
  cancellationFailed: {
    title: 'Cancellation Failed',
    message: 'Failed to cancel booking. Please try again.',
  },

  // Warning messages
  emailNotVerified: {
    title: 'Email Not Verified',
    message: 'Please verify your email before booking a ride.',
    persistent: true,
  },
  paymentPending: {
    title: 'Payment Pending',
    message: 'Payment successful but failed to update booking status. Please contact support.',
    persistent: true,
  },

  // Info messages
  loading: {
    title: 'Loading',
    message: 'Please wait while we process your request...',
  },
  emailSent: {
    title: 'Email Sent',
    message: 'Verification email sent! Check your inbox.',
  },
}; 