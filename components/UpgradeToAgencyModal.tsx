'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaIdCard, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


interface UpgradeToAgencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Add onSuccess callback
}

export default function UpgradeToAgencyModal({ isOpen, onClose, onSuccess }: UpgradeToAgencyModalProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        licenseNumber: '',
    });

    // Pre-fill form with user data when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                licenseNumber: user.licenseNumber || '',
            });
            setError('');
            setSuccess('');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const digitsOnly = value.replace(/\D/g, '');
        setFormData({
            ...formData,
            phoneNumber: digitsOnly,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.phoneNumber) {
                throw new Error('Phone number is required');
            }

            if (!formData.licenseNumber) {
                throw new Error('License number is required');
            }

            // 1. First perform the upgrade
            const upgradeData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: parseInt(formData.phoneNumber, 10),
                address: formData.address,
                licenseNumber: formData.licenseNumber,
            };

            await api.upgradeToAgency(upgradeData);

            setSuccess('Upgrade successful! Proceeding to setup...');
            toast.success('Account upgraded successfully!');

            // Call onSuccess to trigger next steps instead of logging out immediately
            setTimeout(() => {
                onSuccess();
            }, 1000);

        } catch (err: any) {
            console.error('Upgrade failed:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(err.message || 'Failed to upgrade account. Please try again.');
            }
            toast.error('Something went wrong during upgrade.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition"
                    >
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-2">Become a Partner</h2>
                    <p className="text-white/90">Upgrade your account to verify and manage an agency.</p>
                </div>

                {/* Form */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
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
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    required
                                />
                            </div>
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
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="mb-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaPhone className="text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Business Phone"
                                value={formData.phoneNumber}
                                onChange={handlePhoneChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaMapMarkerAlt className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="address"
                                placeholder="Business Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                required
                            />
                        </div>



                        {/* License */}
                        <div className="mb-6 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaIdCard className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="licenseNumber"
                                placeholder="License Number"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1 ml-2">Required for verification</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !!success}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition duration-300 disabled:opacity-50 shadow-lg shadow-blue-500/30"
                        >
                            {loading ? 'Processing...' : 'Upgrade Now'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
