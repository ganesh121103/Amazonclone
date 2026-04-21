import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaDatabase, FaUserShield, FaMoon } from 'react-icons/fa';
import { MdSkipNext } from 'react-icons/md';

const OnboardingScreen = ({ onSkip }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <FaShoppingCart className="text-4xl text-amazon-orange mb-4" />,
      title: 'Full E-commerce Flow',
      description: 'Experience a complete shopping journey from browsing products to cart management and secure checkout.'
    },
    {
      icon: <FaDatabase className="text-4xl text-blue-500 mb-4" />,
      title: 'Smart Mock Mode',
      description: 'Works seamlessly even without a database connection using advanced in-memory data fallback.'
    },
    {
      icon: <FaUserShield className="text-4xl text-green-500 mb-4" />,
      title: 'Admin Capabilities',
      description: 'Manage products, view users, and process orders through a comprehensive admin dashboard (Use admin/admin to login).'
    },
    {
      icon: <FaMoon className="text-4xl text-purple-500 mb-4" />,
      title: 'Modern UI & Dark Mode',
      description: 'Enjoy a sleek, fully responsive design that automatically adapts to your preferred light or dark theme.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <div 
        className={`max-w-5xl w-full transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        {/* Header section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to the <span className="text-amazon-orange">Amazon Clone</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A fully-featured, modern e-commerce application built with the MERN stack. Here's what you can explore:
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <button
            onClick={onSkip}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-amazon-orange border border-transparent rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazon-orange dark:focus:ring-offset-gray-900 shadow-[0_0_20px_rgba(255,153,0,0.3)] hover:shadow-[0_0_30px_rgba(255,153,0,0.5)] transform hover:scale-105"
          >
            <span className="mr-2">Skip & Get Started</span>
            <MdSkipNext className="text-2xl transform group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click skip to continue to the main application as a guest or to login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
