import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { api } from '../../api/axiosInstance';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/authcontext';

interface AdminLoginFormState {
  email: string;
  password: string;
}

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  name: string;
  email: string;
  avatar: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, setAuthData } = useAuth();
  const [formState, setFormState] = useState<AdminLoginFormState>({
    email: 'admin123@gmail.com',
    password: '',
  });

  useEffect(() => {
    if (!loading && user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, loading, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await api.post('/auth/admin-login', {
        email: formState.email,
        password: formState.password,
      });

      console.log('Admin login response', response.data);
      if (response.data.accessToken) {
        const decoded: DecodedToken = jwtDecode(response.data.accessToken);
        setAuthData(response.data.accessToken, decoded);
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.log('Admin login error', error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (user && user.role === 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-md border border-border bg-background p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-foreground">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-foreground focus:border-primary-background focus:outline-none focus:ring-1 focus:ring-primary-background"
              placeholder="admin123@gmail.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-foreground focus:border-primary-background focus:outline-none focus:ring-1 focus:ring-primary-background"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;