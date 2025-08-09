import React from 'react';
import { useAlert } from '../../contexts/AlertContext';
import { ToastAlert, BannerAlert } from './Alert';

export const AlertContainer: React.FC = () => {
  const { state, removeAlert } = useAlert();

  return (
    <>
      {/* Toast notifications - center-top */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 space-y-3 max-w-md w-full px-4">
        {state.alerts
          .filter(alert => !alert.persistent)
          .map(alert => (
            <ToastAlert
              key={alert.id}
              alert={alert}
              onClose={removeAlert}
              className="animate-in slide-in-from-top-4 duration-500"
            />
          ))}
      </div>

      {/* Banner alerts - top of page */}
      <div className="fixed top-0 left-0 right-0 z-40">
        {state.alerts
          .filter(alert => alert.persistent)
          .map(alert => (
            <BannerAlert
              key={alert.id}
              alert={alert}
              onClose={removeAlert}
              className="animate-in slide-in-from-top-2 duration-300"
            />
          ))}
      </div>
    </>
  );
}; 