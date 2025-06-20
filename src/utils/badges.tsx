import React from 'react';
import { 
  STATUS_CLASSES, 
  STATUS_CLASSES_DARK, 
  CARTEIRA_CLASSES, 
  CARTEIRA_CLASSES_DARK,
  ASSUNTO_CLASSES,
  ASSUNTO_CLASSES_DARK
} from '../constants';

export const renderStatusBadge = (status: string, darkMode?: boolean): JSX.Element => {
  const isDark = darkMode ?? false;
  const classes = isDark ? STATUS_CLASSES_DARK : STATUS_CLASSES;
  const className = classes[status as keyof typeof classes];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {status}
    </span>
  );
};

export const renderCarteiraBadge = (carteira: string, darkMode?: boolean): JSX.Element => {
  const isDark = darkMode ?? false;
  const classes = isDark ? CARTEIRA_CLASSES_DARK : CARTEIRA_CLASSES;
  const defaultClass = isDark ? 'bg-gray-600 text-gray-100' : 'bg-gray-500 text-white';
  const className = classes[carteira as keyof typeof classes] || defaultClass;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {carteira}
    </span>
  );
};

export const renderAssuntoBadge = (assunto: string, darkMode?: boolean): JSX.Element => {
  const isDark = darkMode ?? false;
  const classes = isDark ? ASSUNTO_CLASSES_DARK : ASSUNTO_CLASSES;
  const className = classes[assunto as keyof typeof classes] || classes.default;

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
      {assunto}
    </span>
  );
};

export const renderOperadorBadge = (operador: string, darkMode?: boolean): JSX.Element => {
  const isDark = darkMode ?? false;
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${
      isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
    }`}>
      {operador}
    </span>
  );
};