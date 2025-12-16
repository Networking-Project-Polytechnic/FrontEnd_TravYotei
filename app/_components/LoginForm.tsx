'use client';

import { useState } from 'react';
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { login } from '@/lib/api';

interface LoginFormProps {
  switchToSignup: () => void;
}

export default function LoginForm({ switchToSignup }: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      console.log('Login successful:', response);
      // Handle successful login (redirect, store token, etc.)
      // localStorage.setItem('token', response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="text-gray-400" />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit"
          disabled={loading}
          className="w-58 cursor-pointer items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:from-blue-600 hover:to-blue-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
      

      <p className="text-gray-600 text-center mt-6 mb-4">Or Sign In with social platforms</p>
        {/* // Social icons: */}
        <div className="flex justify-center space-x-4">
        <a href="#" className="w-11 h-11 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition">
            <FaFacebookF className="text-lg" />
        </a>
        <a href="#" className="w-11 h-11 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition">
            <FaTwitter className="text-lg" />
        </a>
        <a href="#" className="w-11 h-11 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition">
            <FaGoogle className="text-lg" />
        </a>
        <a href="#" className="w-11 h-11 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition">
            <FaLinkedinIn className="text-lg" />
        </a>
        </div>
    </form>
  );
}