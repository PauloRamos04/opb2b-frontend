export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  operador: string;
  role: 'admin' | 'operador' | 'viewer';
  carteiras: string[];
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
}

class AuthService {
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://sua-api-backend.com/api' 
    : 'http://localhost:3001/api';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        this.setToken(data.token);
        if (data.user) {
          this.setUser(data.user);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Falha na conexão com o servidor');
    }
  }

  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      this.clearStorage();
      return data;
    } catch (error) {
      console.error('Erro no logout:', error);
      this.clearStorage();
      return { success: true };
    }
  }

  async validateToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const token = this.getToken();
      if (!token) return { valid: false };

      const response = await fetch(`${this.baseUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        this.setUser(data.user);
        return { valid: true, user: data.user };
      }
      
      return { valid: false };
    } catch (error) {
      console.error('Erro na validação do token:', error);
      return { valid: false };
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        this.setToken(data.token);
        if (data.user) {
          this.setUser(data.user);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw new Error('Falha ao renovar sessão');
    }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }
}

export const authService = new AuthService();