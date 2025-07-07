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
      return 'bg-success/10 border-success/20 text-success';
    case 'error':
      return 'bg-error/10 border-error/20 text-error';
    case 'warning':
      return 'bg-warning/10 border-warning/20 text-warning';
    case 'info':
      return 'bg-primary/10 border-primary/20 text-primary';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
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

// Toast-style alert for top-right corner
export const ToastAlert: React.FC<AlertProps> = ({ alert, onClose, className = '' }) => {
  return (
    <div
      className={`flex items-start p-4 border rounded-lg shadow-lg max-w-sm ${getAlertStyles(alert.type)} ${className}`}
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