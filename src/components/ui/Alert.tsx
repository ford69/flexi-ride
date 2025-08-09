import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Alert as AlertType } from '../../contexts/AlertContext';

interface AlertProps {
  alert: AlertType;
  onClose: (id: string) => void;
  className?: string;
}

const getAlertIcon = (type: AlertType['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5" />;
    case 'error':
      return <AlertCircle className="h-5 w-5" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5" />;
    case 'info':
      return <Info className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

const getAlertStyles = (type: AlertType['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

export const Alert: React.FC<AlertProps> = ({ alert, onClose, className = '' }) => {
  return (
    <div
      className={`flex items-start p-4 border rounded-lg ${getAlertStyles(alert.type)} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {getAlertIcon(alert.type)}
      </div>
      <div className="flex-1 min-w-0">
        {alert.title && (
          <h4 className="text-sm font-medium mb-1">{alert.title}</h4>
        )}
        <p className="text-sm">{alert.message}</p>
      </div>
      <button
        onClick={() => onClose(alert.id)}
        className="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-black/10 transition-colors"
        aria-label="Close alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Toast-style alert for center-top
export const ToastAlert: React.FC<AlertProps> = ({ alert, onClose, className = '' }) => {
  return (
    <div
      className={`flex items-start p-6 border-2 rounded-xl shadow-2xl backdrop-blur-sm bg-white/95 ${getAlertStyles(alert.type)} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-4 mt-1">
        {getAlertIcon(alert.type)}
      </div>
      <div className="flex-1 min-w-0">
        {alert.title && (
          <h4 className="text-base font-semibold mb-2">{alert.title}</h4>
        )}
        <p className="text-sm leading-relaxed">{alert.message}</p>
      </div>
      <button
        onClick={() => onClose(alert.id)}
        className="flex-shrink-0 ml-4 p-2 rounded-lg hover:bg-black/10 transition-colors"
        aria-label="Close alert"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

// Banner-style alert for top of page
export const BannerAlert: React.FC<AlertProps> = ({ alert, onClose, className = '' }) => {
  return (
    <div
      className={`w-full p-4 border-b ${getAlertStyles(alert.type)} ${className}`}
      role="alert"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            {getAlertIcon(alert.type)}
          </div>
          <div>
            {alert.title && (
              <h4 className="text-sm font-medium mb-1">{alert.title}</h4>
            )}
            <p className="text-sm">{alert.message}</p>
          </div>
        </div>
        <button
          onClick={() => onClose(alert.id)}
          className="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-black/10 transition-colors"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}; 