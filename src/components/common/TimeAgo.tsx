'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { parseDate } from '@/utils/functions';

interface TimeAgoProps {
  dateString: string;
  modoDias?: boolean;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ dateString, modoDias }) => {
  const [mounted, setMounted] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');
  const [colorClass, setColorClass] = useState('text-green-500');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Função flexível para parsear datas
    function parseDateFlex(dateStr: string): Date | null {
      if (!dateStr) return null;
      // Tenta DD/MM HH:mm
      const match = dateStr.match(/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2})/);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const hour = parseInt(match[3], 10);
        const minute = parseInt(match[4], 10);
        const year = new Date().getFullYear();
        return new Date(year, month, day, hour, minute, 0);
      }
      // fallback para parseDate padrão
      return parseDate(dateStr);
    }

    const parsedDate = parseDateFlex(dateString);
    if (!parsedDate) {
      setTimeAgo('Data inválida');
      setColorClass('text-gray-400');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 0) {
        setTimeAgo('No futuro');
        setColorClass('text-blue-400');
        return;
      }

      if (modoDias) {
        // Lógica de cor baseada em dias
        if (diffInDays < 1) {
          setColorClass('text-green-500');
        } else if (diffInDays < 2) {
          setColorClass('text-yellow-500 font-semibold');
        } else if (diffInDays < 3) {
          setColorClass('text-red-500 font-bold animate-pulse');
        } else {
          setColorClass('text-red-500 font-bold animate-pulse');
        }
        // Texto
        if (diffInDays < 1) {
          setTimeAgo('hoje');
        } else {
          setTimeAgo(`${diffInDays}d`);
        }
        return;
      }

      // Lógica padrão (minutos/horas)
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
        if (diffInHours < 24) {
          setTimeAgo(`${diffInHours}h`);
        } else {
          setTimeAgo(`${diffInDays}d`);
        }
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(intervalId); // Limpa o intervalo
  }, [dateString, modoDias, mounted]);

  if (!mounted) return null;

  return (
    <span className={`flex items-center space-x-1 text-sm ${colorClass}`}>
      <Clock className="w-4 h-4" />
      <span>{timeAgo}</span>
    </span>
  );
};

export default TimeAgo; 