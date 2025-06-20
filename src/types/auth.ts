export interface User {
  id: string;
  nome: string;
  email: string;
  operador: string;
  role: 'admin' | 'operador' | 'viewer';
  carteiras: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
}

export interface TokenValidationResponse {
  success: boolean;
  user?: User;
  message?: string;
}