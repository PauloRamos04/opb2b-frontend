// Monitor do localStorage para detectar quando os dados são removidos
export const setupStorageMonitor = () => {
  if (typeof window === 'undefined') return;

  // Monitora mudanças no localStorage
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  const originalClear = localStorage.clear;

  localStorage.setItem = function(key: string, value: string) {
    return originalSetItem.call(this, key, value);
  };

  localStorage.removeItem = function(key: string) {
    return originalRemoveItem.call(this, key);
  };

  localStorage.clear = function() {
    return originalClear.call(this);
  };

  // Monitora eventos de storage entre abas
  window.addEventListener('storage', (e) => {
    if (e.key?.includes('auth')) {
      // ... existing code ...
    }
  });

  // Monitora mudanças na URL
  let currentUrl = window.location.href;
  const checkUrl = () => {
    if (window.location.href !== currentUrl) {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('auth_session');
      const user = localStorage.getItem('auth_user');
      
      // ... existing code ...
      
      currentUrl = window.location.href;
    }
    
    setTimeout(checkUrl, 100);
  };
  
  checkUrl();
};