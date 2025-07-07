import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number; // Auto-dismiss after this many milliseconds
  persistent?: boolean; // If true, won't auto-dismiss
}

interface AlertState {
  alerts: Alert[];
}

type AlertAction =
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'REMOVE_ALERT'; payload: string }
  | { type: 'CLEAR_ALL' };

const AlertContext = createContext<{
  state: AlertState;
  showAlert: (alert: Omit<Alert, 'id'>) => void;
  removeAlert: (id: string) => void;
  clearAll: () => void;
} | null>(null);

const alertReducer = (state: AlertState, action: AlertAction): AlertState => {
  switch (action.type) {
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      };
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload),
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        alerts: [],
      };
    default:
      return state;
  }
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, { alerts: [] });

  const showAlert = (alert: Omit<Alert, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newAlert: Alert = {
      ...alert,
      id,
      duration: alert.duration ?? 5000, // Default 5 seconds
    };

    dispatch({ type: 'ADD_ALERT', payload: newAlert });

    // Auto-dismiss if not persistent
    if (!alert.persistent && newAlert.duration) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_ALERT', payload: id });
      }, newAlert.duration);
    }
  };

  const removeAlert = (id: string) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  return (
    <AlertContext.Provider value={{ state, showAlert, removeAlert, clearAll }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}; 