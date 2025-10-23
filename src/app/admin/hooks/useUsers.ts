// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserData, 
  UsersApiResponse, 
  CreateUserData, 
  UpdateUserData, 
  ApiResponse 
} from '../types/user';

export const useUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/admin/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: UsersApiResponse = await response.json();

      if (!response.ok) {
        if (data.requiresLogout) {
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        throw new Error(data.message || 'Failed to fetch users');
      }

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Error fetching users';
      setError(errMsg);
      if (errMsg.includes('token') || errMsg.includes('Access denied')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  // Create new user
  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
console.log("userData",userData);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (data.requiresLogout) {
          router.push('/login');
          return false;
        }
        throw new Error(data.message || 'Failed to create user');
      }

      if (data.success) {
        await fetchUsers(); // Refresh the list
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to create user');
      return false;
    }
  };

  // Update user
  const updateUser = async (userId: string, userData: UpdateUserData): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (data.requiresLogout) {
          router.push('/login');
          return false;
        }
        throw new Error(data.message || 'Failed to update user');
      }

      if (data.success) {
        await fetchUsers(); // Refresh the list
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to update user');
      return false;
    }
  };

  // Delete user
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (data.requiresLogout) {
          router.push('/login');
          return false;
        }
        throw new Error(data.message || 'Failed to delete user');
      }

      if (data.success) {
        await fetchUsers(); // Refresh the list
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete user');
      return false;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout API fails
      router.push('/login');
    }
  };

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Clear error
  const clearError = () => setError('');

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    handleLogout,
    clearError
  };
};
