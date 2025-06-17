import React from 'react';

interface CarteiraBadgeProps {
  carteira: string;
}

const CarteiraBadge: React.FC<CarteiraBadgeProps> = ({ carteira }) => {
  const carteiraClasses = {
    'ALEGRA': 'bg-red-400 text-white',
    'CABOTELECOM': 'bg-teal-400 text-white',
    'CORTEZ': 'bg-blue-400 text-white',
    'CONEXÃO': 'bg-orange-300 text-white',
    'DIRETA': 'bg-green-300 text-white',
    'IP3': 'bg-pink-400 text-white',
    'MEGA': 'bg-indigo-400 text-white',
    'MULTIPLAY': 'bg-purple-400 text-white',
    'NETVGA': 'bg-blue-300 text-white',
    'NOWTECH': 'bg-teal-300 text-white',
    'OUTCENTER': 'bg-green-400 text-white',
    'RESENDENET': 'bg-yellow-300 text-black',
    'SAPUCAINET': 'bg-orange-400 text-white',
    'STARWEB': 'bg-amber-400 text-white',
    'TECNET': 'bg-gray-400 text-white',
    'WAYNET': 'bg-red-300 text-white',
    'WEBNET': 'bg-cyan-400 text-white',
    'WEBBY': 'bg-purple-300 text-white',
    'AZZA': 'bg-yellow-400 text-black'
  };

  const className = carteiraClasses[carteira as keyof typeof carteiraClasses] || 'bg-gray-200 text-gray-800';
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {carteira}
    </span>
  );
};

export default CarteiraBadge;