export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}
export interface SessionData {
  user?: {
    id: number;
    role: 'user' | 'admin';
  }
}
export interface LoginApiResponse {
  success: boolean;
  user: User;
}
export interface MeApiResponse {
  user: User | null;
}