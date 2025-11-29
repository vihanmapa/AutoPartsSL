import React from 'react';
import { useNotification, NotificationType } from '../../context/NotificationContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
      {notifications.map(notification => (
        <ToastItem 
          key={notification.id} 
          {...notification} 
          onClose={() => removeNotification(notification.id)} 
        />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ id: string, type: NotificationType, message: string, onClose: () => void }> = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-orange-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />
  };

  const styles = {
    success: 'bg-white border-l-4 border-green-500 shadow-lg shadow-green-900/5',
    error: 'bg-white border-l-4 border-red-500 shadow-lg shadow-red-900/5',
    warning: 'bg-white border-l-4 border-orange-500 shadow-lg shadow-orange-900/5',
    info: 'bg-white border-l-4 border-blue-500 shadow-lg shadow-blue-900/5'
  };

  return (
    <div className={`pointer-events-auto min-w-[300px] max-w-md rounded-r-lg p-4 flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-right-full ${styles[type]}`}>
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium text-slate-800">{message}</div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};