// src/types/user.ts
export interface UserData {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  sessionTime: number;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  password?: string;
}

export interface CreateUserData {
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  sessionTime: number;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  password?: string;
}

export interface UpdateUserData {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  sessionTime: number;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  password?: string;
}

export interface FormData {
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
  sessionTime: number;
  isActive?: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UsersApiResponse {
  success: boolean;
  users: UserData[];
  currentUser?: CurrentUser;
  message?: string;
  requiresLogout?: boolean;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  requiresLogout?: boolean;
  data?: any;
}
