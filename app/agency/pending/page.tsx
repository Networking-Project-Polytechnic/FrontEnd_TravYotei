'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut, Clock } from 'lucide-react';

export default function AgencyPendingPage() {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-10 h-10 text-yellow-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Account Under Review</h1>
                    <p className="text-gray-600">
                        Hello <span className="font-semibold">{user?.firstName || 'Adventure Partner'}</span>!
                    </p>
                    <p className="text-gray-600">
                        Your agency account is currently waiting for validation by an administrator.
                        You will be notified once your account is active.
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
