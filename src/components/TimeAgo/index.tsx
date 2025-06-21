'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { parseDate } from '@/utils/functions';

interface TimeAgoProps {
  dateString: string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ dateString }) => {
  const [timeAgo, setTimeAgo] = useState('');
  const [colorClass, setColorClass] = useState('text-green-500');

  useEffect(() => {
    const parsedDate = parseDate(dateString);
    if (!parsedDate) {
      setTimeAgo('Data inválida');
      setColorClass('text-gray-400');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60));

      if (diffInMinutes < 0) {
        setTimeAgo('No futuro');
        setColorClass('text-blue-400');
        return;
      }
      
      // Lógica de cores
      if (diffInMinutes > 30) {
        setColorClass('text-red-500 font-bold animate-pulse');
      } else if (diffInMinutes > 20) {
        setColorClass('text-yellow-500 font-semibold');
      } else {
        setColorClass('text-green-500');
      }
      
      // Lógica de texto
      if (diffInMinutes < 1) {
        setTimeAgo('agora');
      } else if (diffInMinutes < 60) {
        setTimeAgo(`${diffInMinutes}m`);
      } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
          setTimeAgo(`${diffInHours}h`);
        } else {
          const diffInDays = Math.floor(diffInHours / 24);
          setTimeAgo(`${diffInDays}d`);
        }
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(intervalId); // Limpa o intervalo
  }, [dateString]);

  return (
    <span className={`flex items-center space-x-1 text-sm ${colorClass}`}>
      <Clock className="w-4 h-4" />
      <span>{timeAgo}</span>
    </span>
  );
};

export default TimeAgo; 