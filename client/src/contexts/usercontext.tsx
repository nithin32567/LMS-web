import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/axiosInstance';

interface UserDetails {
  createdAt: string;
  lastLogin: string | null;
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'inactive';
  details: UserDetails;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

interface UserContextType {
  users: User[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'lms_users';
const STORAGE_PAGINATION_KEY = 'lms_users_pagination';

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadFromStorage = useCallback(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY);
      const storedPagination = localStorage.getItem(STORAGE_PAGINATION_KEY);
      
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
      if (storedPagination) {
        setPagination(JSON.parse(storedPagination));
      }
    } catch (err) {
      console.log('Error loading from localStorage:', err);
    }
  }, []);

  const saveToStorage = useCallback((usersData: User[], paginationData: Pagination) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usersData));
      localStorage.setItem(STORAGE_PAGINATION_KEY, JSON.stringify(paginationData));
    } catch (err) {
      console.log('Error saving to localStorage:', err);
    }
  }, []);

  const fetchUsers = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<UsersResponse>('/users', {
        params: { page, limit },
      });
      
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      saveToStorage(response.data.users, response.data.pagination);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch users';
      setError(errorMessage);
      console.log('Error fetching users:', err);
      
      loadFromStorage();
    } finally {
      setLoading(false);
    }
  }, [saveToStorage, loadFromStorage]);

  const refreshUsers = useCallback(async () => {
    const currentPage = pagination?.page || 1;
    const currentLimit = pagination?.limit || 10;
    await fetchUsers(currentPage, currentLimit);
  }, [pagination, fetchUsers]);

  useEffect(() => {
    loadFromStorage();
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        pagination,
        loading,
        error,
        fetchUsers,
        refreshUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}

