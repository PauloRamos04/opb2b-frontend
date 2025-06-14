'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Wrench, 
  Users, 
  Table, 
  TrendingUp, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon,
  Settings,
  Bell,
  AlertCircle
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/', active: true },
    /**{ icon: Table, label: 'Chamados B2B', href: '/chamados', active: true },
    { icon: Wrench, label: 'Atendimento Técnico', href: '/campo', active: false },
    { icon: Users, label: 'Cadastro de Clientes', href: '/clientes', active: false },
    { icon: TrendingUp, label: 'Relatórios', href: '/relatorios', active: false },
    { icon: Settings, label: 'Configurações', href: '/configuracoes', active: false },**/
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#f9fafb' : '#111827',
            border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Sidebar Desktop */}
      <aside className={`fixed left-0 top-0 h-full bg-indigo-600 text-white z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } hidden lg:block shadow-lg`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-indigo-700 bg-indigo-700">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">OP</span>
            </div>
            {sidebarOpen && (
              <span className="ml-3 text-lg font-semibold">Operações B2B</span>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 mt-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-indigo-700 border-r-4 border-green-400 text-white'
                      : 'hover:bg-indigo-700 text-indigo-100 hover:text-white'
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  {item.active && !sidebarOpen && (
                    <div className="absolute left-16 w-2 h-2 bg-green-400 rounded-full"></div>
                  )}
                </a>
              );
            })}
          </nav>

          {/* User Info and Logout */}
          <div className="p-4 border-t border-indigo-700">
            {sidebarOpen && (
              <div className="mb-4 p-3 bg-indigo-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-white">Usuário Admin</div>
                    <div className="text-xs text-green-300 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Online
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <button className="flex items-center w-full px-2 py-2 text-sm font-medium hover:bg-indigo-700 rounded transition-colors text-indigo-100 hover:text-white">
              <LogOut className="w-6 h-6 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3">Sair</span>}
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-lg"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-indigo-600 text-white z-50 transform transition-transform lg:hidden shadow-lg ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-700 bg-indigo-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-bold">OP</span>
              </div>
              <span className="ml-3 font-semibold">Operações B2B</span>
            </div>
            <button onClick={toggleSidebar} className="p-1 hover:bg-indigo-700 rounded">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 mt-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-indigo-700 border-r-4 border-green-400 text-white'
                      : 'hover:bg-indigo-700 text-indigo-100 hover:text-white'
                  }`}
                  onClick={toggleSidebar}
                >
                  <Icon className="w-6 h-6" />
                  <span className="ml-3">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-indigo-700">
            <div className="mb-4 p-3 bg-indigo-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-white">Usuário Admin</div>
                  <div className="text-xs text-green-300 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Online
                  </div>
                </div>
              </div>
            </div>
            
            <button className="flex items-center w-full px-2 py-2 text-sm font-medium hover:bg-indigo-700 rounded transition-colors text-indigo-100 hover:text-white">
              <LogOut className="w-6 h-6" />
              <span className="ml-3">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-30 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`lg:hidden p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Sistema de Chamados B2B
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Controle e gerenciamento de chamados técnicos
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                className={`relative p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* System Status */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Sistema Online</span>
              </div>

              {/* User Avatar */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Usuário Admin
                  </div>
                  <div className="text-xs text-green-600 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white lg:hidden shadow-lg">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 5).map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`flex flex-col items-center p-2 text-xs transition-colors ${
                  item.active ? 'text-green-400' : 'text-indigo-100 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="truncate max-w-[60px]">{item.label.split(' ')[0]}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Mobile padding bottom for navigation */}
      <div className="h-16 lg:hidden"></div>
    </div>
  );
};

export default Layout;