export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT_ADMIN' | 'CLIENT';
  clientId?: string;
  password?: string; // solo para creación
  createdAt?: string;
  updatedAt?: string;
}
