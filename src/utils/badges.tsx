// src/utils/badges.tsx

import React from 'react';
import { STATUS_CLASSES, CARTEIRA_CLASSES } from '@/constants/spreadsheet';

export const renderStatusBadge = (status: string): JSX.Element => {
  const className = STATUS_CLASSES[status as keyof typeof STATUS_CLASSES] || 'bg-gray-200 text-gray-800';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {status}
    </span>
  );
};

export const renderCarteiraBadge = (carteira: string): JSX.Element => {
  const className = CARTEIRA_CLASSES[carteira as keyof typeof CARTEIRA_CLASSES] || 'bg-gray-200 text-gray-800';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {carteira}
    </span>
  );
};