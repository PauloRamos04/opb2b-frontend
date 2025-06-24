'use client';

import React, { useState } from 'react';
import { Home, Menu, X, Sun, Moon, LogOut, User, BarChart2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: BarChart2, label: 'Relatórios', href: '/relatorios' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <aside className={`fixed left-0 top-0 h-full bg-indigo-600 text-white z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } hidden lg:block shadow-lg`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-indigo-700 bg-indigo-700">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">OP</span>
            </div>
            {sidebarOpen && (
              <span className="ml-3 text-lg font-semibold">Operações B2B</span>
            )}
          </div>

          <nav className="flex-1 mt-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-700 border-r-4 border-green-400 text-white'
                      : 'hover:bg-indigo-700 text-indigo-100 hover:text-white'
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  {isActive && !sidebarOpen && (
                    <div className="absolute left-16 w-2 h-2 bg-green-400 rounded-full"></div>
                  )}
                </a>
              );
            })}
          </nav>

          {sidebarOpen && user && (
            <div className="border-t border-indigo-700 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.nome}</p>
                  <p className="text-xs text-indigo-200">{user.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-lg"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-indigo-600 text-white z-50 transform transition-transform lg:hidden shadow-lg ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
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

          <nav className="flex-1 mt-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    isActive
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

          {user && (
            <div className="border-t border-indigo-700 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.nome}</p>
                  <p className="text-xs text-indigo-200">{user.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <header className={`sticky top-0 z-30 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`lg:hidden p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Sistema de Chamados B2B
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {user ? `Bem-vindo, ${user.nome}` : 'Carregando...'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user && (
                <div className="flex items-center space-x-3">
                  <div className={`text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className="text-sm font-medium">{user.nome}</p>
                    <p className="text-xs">{user.operador}</p>
                  </div>
                  <button
                    onClick={logout}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                    title="Sair"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;