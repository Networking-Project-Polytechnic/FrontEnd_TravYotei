'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function Home() {
  const [isSignUpMode, setIsSignUpMode] = useState(true);

  return (
    <div className="min-h-screen bg-white font-poppins overflow-hidden">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Form container - NOW WITH RELATIVE POSITIONING */}
        <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
          
          {/* Background circle - NOW ABSOLUTE AND INSIDE FORM */}
          <div className={`absolute w-[1100px] h-[1100px] rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 transition-all duration-700 ease-in-out z-0 ${
            isSignUpMode 
              ? 'top-0 left-0 -translate-x-1/2 -translate-y-1/2'  // Top-left for Signup
              : 'top-0 right-0 translate-x-1/2 -translate-y-1/2'   // Top-right for Signin
          }`}></div>

          <div className="flex flex-col md:flex-row h-full relative z-10">
            {/* Forms Container */}
            <div className="w-full md:w-1/2 p-8 md:p-16 transition-all duration-700 ease-in-out z-20">
              <div className="relative w-full h-full">
                {/* Sign In Form */}
                <div className={`m-10 absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${
                  isSignUpMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                  <LoginForm switchToSignup={() => setIsSignUpMode(true)} />
                </div>

                {/* Sign Up Form */}
                <div className={`mb-10 mt-0 absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${
                  isSignUpMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  <SignupForm switchToLogin={() => setIsSignUpMode(false)} />
                </div>
              </div>
            </div>

            {/* Panels Container */}
            <div className={`w-full md:w-1/2 relative ${isSignUpMode ? 'md:order-first' : 'md:order-last'}`}>
              {/* Left Panel */}
              <div className={`absolute top-0 left-0 w-full h-full p-8 md:p-16 flex flex-col justify-between transition-all duration-700 ease-in-out ${
                isSignUpMode ? 'md:-translate-x-full opacity-0' : 'opacity-100'
              }`}>
                <div className="text-center md:text-right text-white">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                    New to <span className="text-travyotei">TravYotei</span> ?
                  </h3>
                  <p className="mb-2">Transform chaos into seamless travel plans</p>
                  <p className="mb-6">Elevate your agency with one-click efficiency</p>
                  <p className="text-lg font-bold mb-8">Join the revolution</p>
                  <button
                    onClick={() => setIsSignUpMode(true)}
                    className="-mt-1 mb-3 cursor-pointer px-8 py-3 border-2 border-white rounded-full text-white font-semibold hover:bg-white hover:text-black transition duration-300"
                  >
                    Sign up
                  </button>
                </div>
                <div className="mt-0 md:-mt-8">
                  <img 
                    src="location.svg" 
                    alt="Location" 
                    className="w-60 max-w-md mx-auto md:mr-auto z-20"
                  />
                </div>
              </div>

              {/* Right Panel */}
              <div className={`absolute inset-0 p-8 md:p-16 flex flex-col justify-between items-start transition-all duration-700 ease-in-out ${
                isSignUpMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <div className="text-left text-white max-w-[320px]">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4">One of us ?</h3>
                  <p className="mb-8">Your next adventure begins with the right crew</p>
                  <button
                    onClick={() => setIsSignUpMode(false)}
                    className="cursor-pointer hover:text-black px-8 py-3 border-2 border-white rounded-full text-white font-semibold hover:bg-white hover:text-secondary-blue transition duration-300"
                  >
                    Sign in
                  </button>
                </div>

                <div className="mt-8 md:mt-0 w-full flex justify-start">
                  <img 
                    src="vehicle.png" 
                    alt="Vehicle" 
                    className="w-72 md:w-64 lg:w-72"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}