import React from 'react';
import { X, Building } from 'lucide-react';

interface CarteiraFilterProps {
  carteiraList: string[];
  selectedCarteiras: string[];
  adicionarFiltroCarteira: (carteira: string) => void;
  removerFiltroCarteira: (carteira: string) => void;
  darkMode: boolean;
}

const CarteiraFilter: React.FC<CarteiraFilterProps> = ({
  carteiraList,
  selectedCarteiras,
  adicionarFiltroCarteira,
  removerFiltroCarteira,
  darkMode
}) => (
  <div>
    <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-50' : 'text-gray-900'}`}>
      <Building className="w-4 h-4 inline mr-2" />
      Carteiras
    </label>
    <div className="space-y-2">
      <select
        onChange={(e) => {
          if (e.target.value) {
            adicionarFiltroCarteira(e.target.value);
            e.target.value = '';
          }
        }}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'bg-white border-gray-300 text-gray-900'
          }`}
      >
        <option value="">Adicionar carteira...</option>
        {carteiraList.filter(c => !selectedCarteiras.includes(c)).map(carteira => (
          <option key={carteira} value={carteira}>{carteira}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        {selectedCarteiras.map(carteira => (
          <span
            key={carteira}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
          >
            {carteira}
            <button
              onClick={() => removerFiltroCarteira(carteira)}
              className="ml-1 hover:text-green-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default CarteiraFilter; 