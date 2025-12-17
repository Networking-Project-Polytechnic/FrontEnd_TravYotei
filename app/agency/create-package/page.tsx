// app/page.tsx
'use client';

import { useState, FormEvent } from 'react';

interface PackageFormData {
  start_route: string;
  end_route: string;
  departure_time: string;
  arrival_time: string;
  status: 'in transit' | 'delivered';
  senderName: string;
  receiverName: string;
}

export default function PackageRegistrationPage() {
  const [formData, setFormData] = useState<PackageFormData>({
    start_route: '',
    end_route: '',
    departure_time: '',
    arrival_time: '',
    status: 'in transit',
    senderName: '',
    receiverName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Package Registration Data:', formData);
    alert('Package registered successfully!');
    // Reset form
    setFormData({
      start_route: '',
      end_route: '',
      departure_time: '',
      arrival_time: '',
      status: 'in transit',
      senderName: '',
      receiverName: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Package Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Register a new package for shipping and tracking
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Gradient Header Bar */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 w-full"></div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Route Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                  Route Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Route <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="start_route"
                      value={formData.start_route}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., New York, NY"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      End Route <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="end_route"
                      value={formData.end_route}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Los Angeles, CA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Departure Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="departure_time"
                      value={formData.departure_time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Arrival Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="arrival_time"
                      value={formData.arrival_time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Package Status */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                  Package Status
                </h2>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.status === 'in transit' 
                        ? 'bg-cyan-50 border-cyan-300 ring-2 ring-cyan-200' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="status"
                        value="in transit"
                        checked={formData.status === 'in transit'}
                        onChange={handleChange}
                        className="h-5 w-5 text-cyan-600 focus:ring-cyan-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900">In Transit</span>
                        <p className="text-sm text-gray-500">Package is currently in transit</p>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.status === 'delivered' 
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="status"
                        value="delivered"
                        checked={formData.status === 'delivered'}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900">Delivered</span>
                        <p className="text-sm text-gray-500">Package has been delivered</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Sender Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter sender's full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Receiver Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter receiver's full name"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setFormData({
                      start_route: '',
                      end_route: '',
                      departure_time: '',
                      arrival_time: '',
                      status: 'in transit',
                      senderName: '',
                      receiverName: '',
                    })}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear Form
                  </button>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    Register Package
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{formData.start_route || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{formData.end_route || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                  formData.status === 'in transit' 
                    ? 'bg-cyan-100 text-cyan-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {formData.status}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sender:</span>
                <span className="font-medium">{formData.senderName || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Receiver:</span>
                <span className="font-medium">{formData.receiverName || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Schedule:</span>
                <span className="font-medium">
                  {formData.departure_time || '--:--'} → {formData.arrival_time || '--:--'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}