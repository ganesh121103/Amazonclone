import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaDatabase, FaUserShield, FaMoon, FaUserPlus, FaCreditCard, FaBoxOpen, FaClipboardCheck } from 'react-icons/fa';
import { MdSkipNext, MdNavigateNext } from 'react-icons/md';

const OnboardingScreen = ({ onSkip }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    setIsVisible(true);
  }, [step]);

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

  const instructions = [
    {
      icon: <FaUserPlus className="text-4xl text-blue-500 mb-4" />,
      title: '1. Create an Account',
      description: 'Sign up for a new account or log in with demo credentials (admin / admin) to explore all features.'
    },
    {
      icon: <FaBoxOpen className="text-4xl text-amazon-orange mb-4" />,
      title: '2. Browse & Shop',
      description: 'Explore the product catalog, view detailed descriptions, and add your favorite items to the cart.'
    },
    {
      icon: <FaCreditCard className="text-4xl text-green-500 mb-4" />,
      title: '3. Secure Checkout',
      description: 'Proceed to checkout, enter your shipping details, and complete your mock purchase seamlessly.'
    },
    {
      icon: <FaClipboardCheck className="text-4xl text-purple-500 mb-4" />,
      title: '4. Track & Manage',
      description: 'Navigate to your profile to track orders, or use the admin dashboard to manage the entire store.'
    }
  ];

  const handleNext = () => {
    setIsVisible(false);
    setTimeout(() => {
      setStep(2);
    }, 300);
  };

  const activeData = step === 1 ? features : instructions;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <div 
        className={`max-w-5xl w-full transition-all duration-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        {/* Header section */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="flex gap-2 mb-8">
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-12 bg-amazon-orange' : 'w-4 bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-12 bg-amazon-orange' : 'w-4 bg-gray-300 dark:bg-gray-600'}`}></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {step === 1 ? (
              <>Welcome to the <span className="text-amazon-orange">Amazon Clone</span></>
            ) : (
              <>How to Use the <span className="text-amazon-orange">App</span></>
            )}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {step === 1 
              ? "A fully-featured, modern e-commerce application built with the MERN stack. Here's what you can explore:"
              : "Follow these simple steps to explore the full capabilities of the platform:"
            }
          </p>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {activeData.map((item, index) => (
            <div 
              key={`${step}-${index}`} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700"
              style={{ animation: isVisible ? `fadeInUp 0.5s ease-out ${index * 0.15}s forwards` : 'none', opacity: 0, transform: 'translateY(20px)' }}
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-row items-center gap-4">
            {step === 1 ? (
              <>
                <button
                  onClick={handleNext}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-gray-900 transition-all duration-200 bg-amazon-orange border border-transparent rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazon-orange dark:focus:ring-offset-gray-900 shadow-[0_0_20px_rgba(255,153,0,0.3)] hover:shadow-[0_0_30px_rgba(255,153,0,0.5)] transform hover:scale-105"
                >
                  <span className="mr-2">How to Use</span>
                  <MdNavigateNext className="text-2xl transform group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onSkip}
                  className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">Skip</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => setStep(1), 300);
                  }}
                  className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={onSkip}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-gray-900 transition-all duration-200 bg-green-500 border border-transparent rounded-full hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:scale-105"
                >
                  <span className="mr-2">Get Started</span>
                  <MdSkipNext className="text-2xl transform group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === 1 ? 'Click to learn how to use the app or skip directly.' : 'You are all set to start using the full application!'}
          </p>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
};

export default OnboardingScreen;
