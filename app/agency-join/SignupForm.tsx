'use client';

import { useState } from 'react';
import { FaFacebookF, FaGoogle, FaLinkedinIn, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import ProfilePictureModal from '../../components/ProfilePictureModal';
import BioModal from '../../components/BioModal';
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
  const [showBioModal, setShowBioModal] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const router = useRouter();
  const { signup, refreshProfile } = useAuth(); // Use AuthContext methods

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

  const handleProfileModalComplete = () => {
    setShowProfileModal(false);
    setShowBioModal(true);
  };

  const handleBioModalComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('skip_auth_redirect');
    }
    setShowBioModal(false);
    router.push('/Dashboard'); // Final redirect to agency dashboard
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

      // IMPORTANT: Set this flag BEFORE calling signup to prevent immediate redirection
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('skip_auth_redirect', 'true');
      }

      // Use AuthContext signup
      // Note: signup handles auto-login if no token is returned
      await signup(apiData);
      setSuccess('Registration successful! Setting up your profile...');

      // Show the profile picture modal
      setShowProfileModal(true);

    } catch (err: any) {
      // Clean up the flag if signup fails
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('skip_auth_redirect');
      }
      // Handle specific phone number conversion error
      if (err.message === 'Invalid phone number format') {
        setError('Please enter a valid phone number (digits only).');
      } else if (err.response?.data?.message) {
        // Backend error
        setError(err.response.data.message);
      } else if (err.message) {
        // Other errors - check for common error patterns
        const errorMsg = err.message.toLowerCase();
        if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          setError('Network error. Please check your connection and try again.');
        } else if (errorMsg.includes('400') || errorMsg.includes('bad request')) {
          setError('Invalid form data. Please check all fields and try again.');
        } else if (errorMsg.includes('409') || errorMsg.includes('conflict')) {
          setError('Username or email already exists. Please use different credentials.');
        } else if (errorMsg.includes('500') || errorMsg.includes('server')) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.message || 'Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Format phone input as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits for simplicity
    const digitsOnly = value.replace(/\D/g, '');

    setFormData({
      ...formData,
      phoneNumber: digitsOnly,
    });
  };


  return (
    <>
      <form onSubmit={handleSubmit} className="w-full mb-7 max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="text-gray-400" />
            </div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (9 digits)"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => setIsPhoneFocused(false)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              pattern="\d{9}"
              title="Please enter exactly 9 digits"
              maxLength={9}
            />
            {isPhoneFocused && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded shadow-lg z-50 whitespace-nowrap animate-in fade-in zoom-in duration-200">
                9 digits only (e.g., 681154869)
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Business Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* License Number */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaIdCard className="text-gray-400" />
            </div>
            <input
              type="text"
              name="licenseNumber"
              placeholder="Business License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 ml-4">Required for agency verification</p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center mb-3">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-[232px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:from-blue-600 hover:to-blue-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </div>

        {/* Switch to login */}
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Login here
            </button>
          </p>
        </div>

        {/* Social Signup */}
        <p className="text-gray-600 text-center text-sm mt-4 mb-3">Or Sign Up with social platforms</p>
        <div className="flex justify-center space-x-3 mb-2">
          <a
            href="#"
            className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition"
          >
            <FaFacebookF className="text-xs" />
          </a>
          <a
            href="#"
            className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition"
          >
            <FaLinkedinIn className="text-xs" />
          </a>
          <a
            href="#"
            className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition"
          >
            <FaGoogle className="text-xs" />
          </a>
          <a
            href="#"
            className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition"
          >
            <FaXTwitter className="text-xs" />
          </a>
        </div>
      </form>

      <ProfilePictureModal
        isOpen={showProfileModal}
        onClose={() => handleProfileModalComplete()}
        onComplete={() => handleProfileModalComplete()}
      />

      <BioModal
        isOpen={showBioModal}
        onClose={() => handleBioModalComplete()}
        onComplete={() => handleBioModalComplete()}
      />
    </>
  );
}
