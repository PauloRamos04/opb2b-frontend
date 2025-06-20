import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { renderStatusBadge, renderCarteiraBadge, renderOperadorBadge } from '../../utils/badges';

interface BadgeProps {
  type: 'status' | 'carteira' | 'operador';
  value: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, value, className = '' }) => {
  const { darkMode } = useTheme();
  
  const renderBadge = () => {
    switch (type) {
      case 'status': 
        return renderStatusBadge(value, darkMode);
      case 'carteira': 
        return renderCarteiraBadge(value, darkMode);
      case 'operador': 
        return renderOperadorBadge(value, darkMode);
      default: 
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-800'}`}>
            {value}
          </span>
        );
    }
  };
  
  return (
    <div className={className}>
      {renderBadge()}
    </div>
  );
};