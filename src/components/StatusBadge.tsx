import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClasses = {
    'EM ANÁLISE': 'bg-orange-500 text-white',
    'FINALIZADO': 'bg-green-500 text-white',
    'AGENDADA': 'bg-blue-500 text-white',
    'EM ATD - USO': 'bg-emerald-500 text-white',
    'ANULADA': 'bg-gray-500 text-white',
    'FINALIZADO / VT': 'bg-teal-600 text-white',
    'SEM CONTATO #UD': 'bg-red-500 text-white',
    'SEM CONTATO 2': 'bg-red-600 text-white',
    'SEM CONTATO 3': 'bg-red-700 text-white',
    'AGUARDANDO - NOC': 'bg-indigo-500 text-white',
    'AGUARDANDO - ENGENHARIA': 'bg-purple-500 text-white',
    'AGUARDANDO - TI': 'bg-teal-500 text-white',
    'AGUARDANDO - TELEFONIA': 'bg-cyan-500 text-white',
    'AGUARDANDO - REDE EXTERNA': 'bg-lime-500 text-black',
    'AGUARDANDO - OPERAÇÕES B2B': 'bg-yellow-500 text-black'
  };

  const className = statusClasses[status as keyof typeof statusClasses] || 'bg-gray-200 text-gray-800';
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;