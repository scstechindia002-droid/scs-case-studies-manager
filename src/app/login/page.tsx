'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    username: string;
    email: string;
    role: string;
  };
  token:string;
  error?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.user) {
        // Store user data in localStorage or session storage
        if (formData.rememberMe) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(data.user));
          sessionStorage.setItem('token', data.token);
        }
        // Always set the token cookie for backend auth
        document.cookie = `token=${data.token}; path=/;`;
        document.cookie = `role=${data.user.role}; path=/;`;
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/users-list');
        } else {
          router.push('/');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col"
      style={{
        background: '#1a2332',
        backgroundImage: 'url("/images/login-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Logo */}
      <div className="p-5 lg:p-8">
        <div 
          className="w-[206px] h-[71px] relative"
          style={{
            aspectRatio: '206/71.053'
          }}
        >
          <Image
            src="/images/logo.png"
            alt="SCS Tech Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>
  
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 lg:px-8">
        {/* Main Heading */}
        <h1 
          className="text-white text-center font-bold mb-12 tracking-[2px]"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(24px, 5vw, 39px)',
            fontWeight: 700,
            lineHeight: '45px',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          SCS TECH CASE STUDIES
        </h1>
        
        {/* Login Form */}
        <div className="w-full max-w-[400px] lg:max-w-[450px]">
          <div 
            className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-[20px] p-8 lg:p-10"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}
  
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-white mb-2"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '16px',
                    fontWeight: 500
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full h-[56px] px-6 py-2 bg-white/10 border-2 border-white/10 rounded-[12px] text-white placeholder-white/60 transition-all duration-300 focus:outline-none focus:border-[#EE2B2C] focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(238,43,44,0.1)]"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-white mb-2"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '16px',
                    fontWeight: 500
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full h-[56px] px-6 py-2 bg-white/10 border-2 border-white/10 rounded-[12px] text-white placeholder-white/60 transition-all duration-300 focus:outline-none focus:border-[#EE2B2C] focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(238,43,44,0.1)]"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              {/* Remember Me + Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-2">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-[18px] h-[18px] accent-[#EE2B2C] rounded"
                  />
                  <span 
                    style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    Remember Me
                  </span>
                </label>
              </div>
              
              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[56px] bg-[#EE2B2C] hover:bg-[#ff4444] text-white font-semibold rounded-[16px] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(238,43,44,0.3)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  padding: '7.11px 71.097px'
                }}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}