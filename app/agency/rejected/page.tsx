'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut, XCircle, Mail } from 'lucide-react';

export default function AgencyRejectedPage() {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Account Creation Declined</h1>
                    <p className="text-gray-600">
                        We're sorry, <span className="font-semibold">{user?.firstName}</span>.
                    </p>
                    <p className="text-gray-600">
                        Your agency account request has been declined by an administrator.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        If you believe this is a mistake, please contact our support team.
                    </p>
                </div>

                <div className="pt-4 space-y-3">
                    <a
                        href="mailto:support@travyotei.com"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-medium"
                    >
                        <Mail className="w-5 h-5" />
                        <span>Contact Support</span>
                    </a>

                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
