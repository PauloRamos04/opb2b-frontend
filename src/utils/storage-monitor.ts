// Monitor do localStorage para detectar quando os dados são removidos
export const setupStorageMonitor = () => {
  if (typeof window === 'undefined') return;

  console.log('🔧 Configurando monitor DETALHADO do localStorage...');

  // Monitora mudanças no localStorage
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  const originalClear = localStorage.clear;

  localStorage.setItem = function(key: string, value: string) {
    if (key.includes('auth')) {
      console.log(`✅ SALVANDO: ${key}`, {
        value: value.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
        location: window.location.href
      });
      console.trace('🔍 Stack trace de quem salvou:');
    }
    return originalSetItem.call(this, key, value);
  };

  localStorage.removeItem = function(key: string) {
    if (key.includes('auth')) {
      console.log(`❌ REMOVENDO: ${key}`, {
        timestamp: new Date().toISOString(),
        location: window.location.href,
        hadValue: !!localStorage.getItem(key)
      });
      console.trace('🔍 Stack trace de quem removeu:');
    }
    return originalRemoveItem.call(this, key);
  };

  localStorage.clear = function() {
    console.log('🧹 LIMPANDO TUDO!', {
      timestamp: new Date().toISOString(),
      location: window.location.href,
      authKeys: Object.keys(localStorage).filter(k => k.includes('auth'))
    });
    console.trace('🔍 Stack trace de quem limpou:');
    return originalClear.call(this);
  };

  // Monitora eventos de storage entre abas
  window.addEventListener('storage', (e) => {
    if (e.key?.includes('auth')) {
      console.log('📡 EVENTO STORAGE (outra aba):', {
        key: e.key,
        oldValue: e.oldValue ? e.oldValue.substring(0, 30) + '...' : null,
        newValue: e.newValue ? e.newValue.substring(0, 30) + '...' : null,
        url: e.url,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Monitora mudanças na URL
  let currentUrl = window.location.href;
  const checkUrl = () => {
    if (window.location.href !== currentUrl) {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('auth_session');
      const user = localStorage.getItem('auth_user');
      
      console.log('🌐 MUDANÇA DE URL:', {
        from: currentUrl,
        to: window.location.href,
        tokenStillExists: !!token,
        userStillExists: !!user,
        timestamp: new Date().toISOString()
      });
      
      currentUrl = window.location.href;
    }
    
    setTimeout(checkUrl, 100);
  };
  
  checkUrl();

  console.log('✅ Monitor DETALHADO configurado');
};