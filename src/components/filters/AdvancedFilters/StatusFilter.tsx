import React from 'react';
import { X, Tag } from 'lucide-react';

interface StatusFilterProps {
  statusList: string[];
  selectedStatus: string[];
  adicionarFiltroStatus: (status: string) => void;
  removerFiltroStatus: (status: string) => void;
  darkMode: boolean;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  statusList,
  selectedStatus,
  adicionarFiltroStatus,
  removerFiltroStatus,
  darkMode
}) => (
  <div>
    <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-50' : 'text-gray-900'}`}>
      <Tag className="w-4 h-4 inline mr-2" />
      Status
    </label>
    <div className="space-y-2">
      <select
        onChange={(e) => {
          if (e.target.value) {
            adicionarFiltroStatus(e.target.value);
            e.target.value = '';
          }
        }}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'bg-white border-gray-300 text-gray-900'
          }`}
      >
        <option value="">Adicionar status...</option>
        {statusList.filter(s => !selectedStatus.includes(s)).map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        {selectedStatus.map(status => (
          <span
            key={status}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
          >
            {status}
            <button
              onClick={() => removerFiltroStatus(status)}
              className="ml-1 hover:text-blue-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default StatusFilter; 