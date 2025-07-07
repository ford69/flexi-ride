import React from 'react';
import { useAlert } from '../../contexts/AlertContext';
import { ToastAlert, BannerAlert } from './Alert';

export const AlertContainer: React.FC = () => {
  const { state, removeAlert } = useAlert();

  return (
    <>
      {/* Toast notifications - top-right corner */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {state.alerts
          .filter(alert => !alert.persistent)
          .map(alert => (
            <ToastAlert
              key={alert.id}
              alert={alert}
              onClose={removeAlert}
              className="animate-in slide-in-from-right-2 duration-300"
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