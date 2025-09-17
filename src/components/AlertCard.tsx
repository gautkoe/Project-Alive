import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertCardProps {
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const AlertCard: React.FC<AlertCardProps> = ({ type, title, message, priority }) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
    }
  };

  return (
    <div className={`rounded-lg border p-3 ${getStyles()}`}>
      <div className="flex items-start space-x-2">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium">{title}</h4>
            <div className={`w-2 h-2 rounded-full ${getPriorityColor()}`} />
          </div>
          <p className="text-sm mt-1 opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
};