"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic login di sini
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Background Image with Logo */}
      <div className="w-1/2 relative bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/ramen-bg.jpg')" }}
        />
        <div className="relative z-10 flex items-center justify-center h-full">
          <Image 
            src="/logo-ramein.png" 
            alt="RAMEIN Logo" 
            width={300} 
            height={300}
            priority
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-[#f5f5f0]">
        <div className="w-full max-w-md px-8">
          <h1 className="text-5xl font-bold text-black text-center" style={{ fontFamily: 'Poppins, sans-serif', marginBottom: '70px' }}>
            Sign in to your account
          </h1>
          
          <form onSubmit={handleLogin}>
            <div className="relative" style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-12 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div className="relative" style={{ marginBottom: '25px' }}>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-12 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}