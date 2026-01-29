'use client';

import { useState } from 'react';
import { FaFacebookF, FaGoogle, FaLinkedinIn, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { signup_agency, login } from '@/lib/api';
import { FaXTwitter } from 'react-icons/fa6';
import ProfilePictureModal from '../../components/ProfilePictureModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface SignupFormProps {
  switchToLogin: () => void;
}

export default function SignupForm({ switchToLogin }: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    phoneNumber: '', // Keep as string in state for form input
    address: '',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();
  const { updateUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper function to convert phone string to number
  const convertPhoneToNumber = (phoneString: string): number => {
    // Remove all non-digit characters (spaces, dashes, parentheses, plus sign)
    const digitsOnly = phoneString.replace(/\D/g, '');

    // Parse to number
    const phoneNumber = parseInt(digitsOnly, 10);

    // Check if it's a valid number
    if (isNaN(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    return phoneNumber;
  };

  const handleModalComplete = () => {
    setShowProfileModal(false);
    router.push('/agency-dashboard'); // Redirect to agency dashboard after profile setup
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Basic client-side validation
      if (!formData.phoneNumber.trim()) {
        setError('Please provide a phone number.');
        setLoading(false);
        return;
      }

      if (!formData.licenseNumber.trim()) {
        setError('Please enter your license number.');
        setLoading(false);
        return;
      }

      // Prepare data for API - convert phoneNumber from string to number
      const apiData = {
        ...formData,
        phoneNumber: convertPhoneToNumber(formData.phoneNumber),
      };

      await signup_agency(apiData);
      setSuccess('Registration successful! Setting up your profile...');

      // Automatically login to get the token for profile picture upload
      try {
        const loginData = await login(formData.userName, formData.password);
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('auth_token', loginData.token);
        updateUser(loginData.user);

        // Show the profile picture modal
        setShowProfileModal(true);
      } catch (loginErr) {
        console.error('Auto-login failed after agency signup:', loginErr);
        setSuccess('Registration successful! Please login to continue.');
      }

    } catch (err: any) {
      // Handle specific phone number conversion error
      if (err.message === 'Invalid phone number format') {
        setError('Please enter a valid phone number (digits only).');
      } else if (err.response?.data?.message) {
        // Backend error
        setError(err.response.data.message);
      } else if (err.message) {
        // Other errors
        setError(err.message || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add input formatting for phone number (optional)
  const formatPhoneInput = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX for US numbers (adjust as needed)
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = formatPhoneInput(rawValue);

    setFormData({
      ...formData,
      phoneNumber: rawValue, // Store the raw digits for conversion
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto py-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">Sign Up</h2>

        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 p-2 bg-green-100 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* First & Last Name - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="mb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400 text-sm" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 text-sm" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="text-gray-400 text-sm" />
            </div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (e.g., 681154869)"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              pattern="\d{10,}"
              title="Please enter at least 10 digits"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* License Number */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaIdCard className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center mb-3">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-[200px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-full hover:from-blue-600 hover:to-blue-700 transition duration-300 disabled:opacity-50 text-sm"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </div>

        {/* Social Signup */}
        <p className="text-gray-600 text-center text-sm mt-4 mb-3">Or Sign Up with social platforms</p>

        <div className="flex justify-center space-x-3 mb-2">
          <a href="#" className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition">
            <FaFacebookF className="text-xs" />
          </a>
          <a href="#" className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition">
            <FaLinkedinIn className="text-xs" />
          </a>
          <a href="#" className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition">
            <FaGoogle className="text-xs" />
          </a>
          <a href="#" className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition">
            <FaXTwitter className="text-xs" />
          </a>
        </div>
      </form>

      <ProfilePictureModal
        isOpen={showProfileModal}
        onClose={() => handleModalComplete()}
        onComplete={() => handleModalComplete()}
      />
    </>
  );
}