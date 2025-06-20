import { authService } from '@/services/auth.service';

export const setupAuthInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const token = authService.getToken();
    
    if (token && init?.headers) {
      const headers = new Headers(init.headers);
      headers.set('Authorization', `Bearer ${token}`);
      init = { ...init, headers };
    } else if (token) {
      init = {
        ...init,
        headers: {
          ...init?.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
    }

    const response = await originalFetch(input, init);

    // Se token expirou (401), tenta renovar
    if (response.status === 401 && token) {
      try {
        const refreshResponse = await authService.refreshToken();
        if (refreshResponse.success && refreshResponse.token) {
          // Refaz a requisição com o novo token
          const newHeaders = new Headers(init?.headers);
          newHeaders.set('Authorization', `Bearer ${refreshResponse.token}`);
          
          return originalFetch(input, {
            ...init,
            headers: newHeaders,
          });
        }
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        authService.clearStorage();
        window.location.href = '/login';
      }
    }

    return response;
  };
};