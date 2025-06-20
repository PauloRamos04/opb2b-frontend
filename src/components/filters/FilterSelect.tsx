import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface FilterSelectProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: string[];
  multiple?: boolean;
  placeholder?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label, value, onChange, options, multiple = false, placeholder = 'Selecione...'
}) => {
  const { darkMode } = useTheme();
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      onChange(selectedOptions);
    } else {
      onChange(e.target.value);
    }
  };
  
  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {label}
      </label>
      <select
        value={multiple ? undefined : value as string}
        multiple={multiple}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        {!multiple && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};