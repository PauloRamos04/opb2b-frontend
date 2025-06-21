import React from 'react';
import { STATUS_LIST, CARTEIRAS_LIST } from '@/constants';

interface PopupNovoFormProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  darkMode: boolean;
}

const PopupNovoForm: React.FC<PopupNovoFormProps> = ({
  formValues,
  setFormValues,
  darkMode
}) => (
  <div className="space-y-6">
    <div>
      <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Informações Básicas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Operador *</label>
          <input
            type="text"
            placeholder="Nome do operador responsável"
            value={formValues.operador || ''}
            onChange={e => setFormValues((prev: any) => ({ ...prev, operador: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cliente *</label>
          <input
            type="text"
            placeholder="Nome do cliente"
            value={formValues.cliente || ''}
            onChange={e => setFormValues((prev: any) => ({ ...prev, cliente: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Carteira *</label>
          <select
            value={formValues.carteira || ''}
            onChange={e => setFormValues((prev: any) => ({ ...prev, carteira: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="">Selecione uma carteira</option>
            {CARTEIRAS_LIST.map(carteira => (
              <option key={carteira} value={carteira}>{carteira}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Status *</label>
          <select
            value={formValues.status || ''}
            onChange={e => setFormValues((prev: any) => ({ ...prev, status: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="">Selecione um status</option>
            {STATUS_LIST.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Descrição *</label>
          <textarea
            rows={4}
            placeholder="Descreva o problema ou solicitação..."
            value={formValues.descricao || ''}
            onChange={e => setFormValues((prev: any) => ({ ...prev, descricao: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>
      </div>
    </div>
  </div>
);

export default PopupNovoForm; 