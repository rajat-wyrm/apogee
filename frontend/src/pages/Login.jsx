/**
 * ULTIMATE LOGIN PAGE
 * Dragon logo, social login, 3D background, lightning fast
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import DragonLogo from '../components/auth/DragonLogo';
import CosmicBackground from '../components/auth/CosmicBackground';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineDeviceMobile,
  HiOutlineMail as HiOutlineGmail,
  HiOutlineUserGroup,
  HiOutlineGlobe,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineSparkles
} from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple, FaGithub, FaTwitter } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // email, phone, social
  
  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();

  // Pre-filled demo credentials for quick access
  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@apogee.com',
      password: 'demo123456'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (loginMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else if (loginMethod === 'phone') {
      if (!formData.email) {
        newErrors.email = 'Phone number is required';
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid phone number';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(async () => {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      socialLogin(provider);
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Floating stats for visual interest
  const floatingStats = [
    { icon: HiOutlineUserGroup, value: '50K+', label: 'Users', color: 'blue' },
    { icon: HiOutlineGlobe, value: '120+', label: 'Countries', color: 'green' },
    { icon: HiOutlineChartBar, value: '1M+', label: 'Tasks', color: 'purple' },
    { icon: HiOutlineClock, value: '99.9%', label: 'Uptime', color: 'orange' },
  ];

  return (
    <>
      {/* Cosmic 3D Background */}
      <CosmicBackground intensity={0.7} />

      {/* Floating stats in background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingStats.map((stat, i) => (
          <motion.div
            key={i}
            className="absolute backdrop-blur-md bg-white/5 dark:bg-gray-900/20 rounded-2xl p-4 border border-white/10"
            style={{
              left: `${10 + i * 25}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          >
            <stat.icon className={`w-8 h-8 text-${stat.color}-500/30`} />
            <p className={`text-2xl font-bold text-${stat.color}-500/30`}>{stat.value}</p>
            <p className={`text-xs text-${stat.color}-500/20`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden py-12">
        {/* Glass overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-[2px]" />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-pulse" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo and Brand */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-6"
          >
            <div className="flex justify-center mb-3">
              <DragonLogo size="lg" animated={true} />
            </div>
            
            <motion.h1 
              variants={itemVariants}
              className="mt-3 text-5xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent bg-size-200 animate-gradient"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              APOGEE
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mt-1 text-gray-400 dark:text-gray-400 text-sm"
            >
              Rise to the pinnacle of productivity
            </motion.p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/30 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 md:p-8"
          >
            {/* Login Method Tabs */}
            <div className="flex mb-6 bg-black/20 rounded-xl p-1">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  loginMethod === 'email'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  loginMethod === 'phone'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Phone
              </button>
              <button
                onClick={() => setLoginMethod('social')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  loginMethod === 'social'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Social
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* Email/Phone Login Form */}
              {(loginMethod === 'email' || loginMethod === 'phone') && (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Email/Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                      {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {loginMethod === 'email' ? (
                          <HiOutlineMail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        ) : (
                          <HiOutlineDeviceMobile className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        )}
                      </div>
                      <input
                        type={loginMethod === 'email' ? 'email' : 'tel'}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={loginMethod === 'email' ? 'your@email.com' : '+1 234 567 8900'}
                        className={`w-full pl-10 pr-10 py-3 bg-white/10 dark:bg-gray-800/50 border-2 rounded-xl focus:outline-none transition-all text-white placeholder-gray-500 text-sm ${
                          errors.email 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-600/50 focus:border-blue-500'
                        }`}
                      />
                      {!errors.email && formData.email && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-red-500"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 bg-white/10 dark:bg-gray-800/50 border-2 rounded-xl focus:outline-none transition-all text-white placeholder-gray-500 text-sm ${
                          errors.password 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-600/50 focus:border-blue-500'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? (
                          <HiOutlineEyeOff className="w-5 h-5" />
                        ) : (
                          <HiOutlineEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-red-500"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  {/* Demo Credentials Button */}
                  <motion.button
                    type="button"
                    onClick={fillDemoCredentials}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-gray-300 transition-all flex items-center justify-center space-x-2"
                  >
                    <HiOutlineSparkles className="w-4 h-4 text-yellow-500" />
                    <span>Use Demo Credentials</span>
                  </motion.button>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                        rememberMe 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-600 group-hover:border-blue-500'
                      }`}>
                        {rememberMe && (
                          <HiOutlineCheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="ml-2 text-xs text-gray-300 group-hover:text-white transition-colors">
                        Remember me
                      </span>
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign in to Apogee</span>
                          <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </motion.form>
              )}

              {/* Social Login */}
              {loginMethod === 'social' && (
                <motion.div
                  key="social-login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <p className="text-center text-sm text-gray-400 mb-4">
                    Continue with your social account
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin('google')}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all"
                    >
                      <FcGoogle className="w-5 h-5" />
                      <span className="text-sm text-white">Google</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin('facebook')}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#1877f2]/20 hover:bg-[#1877f2]/30 border border-[#1877f2]/30 rounded-xl transition-all"
                    >
                      <FaFacebook className="w-5 h-5 text-[#1877f2]" />
                      <span className="text-sm text-white">Facebook</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin('apple')}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all"
                    >
                      <FaApple className="w-5 h-5 text-white" />
                      <span className="text-sm text-white">Apple</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin('github')}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all"
                    >
                      <FaGithub className="w-5 h-5 text-white" />
                      <span className="text-sm text-white">GitHub</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin('twitter')}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 rounded-xl transition-all"
                    >
                      <FaTwitter className="w-5 h-5 text-[#1DA1F2]" />
                      <span className="text-sm text-white">Twitter</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin('gmail')}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#EA4335]/20 hover:bg-[#EA4335]/30 border border-[#EA4335]/30 rounded-xl transition-all"
                    >
                      <SiGmail className="w-5 h-5 text-[#EA4335]" />
                      <span className="text-sm text-white">Gmail</span>
                    </motion.button>
                  </div>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    We'll never post to your social accounts without permission
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign Up Link */}
            <motion.p 
              variants={itemVariants}
              className="text-center text-xs text-gray-400 mt-6"
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Create free account
              </Link>
            </motion.p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-gray-500"
          >
            <span className="flex items-center space-x-1">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span>256-bit Encryption</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span>ISO 27001</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span>SOC 2 Type II</span>
            </span>
          </motion.div>

          {/* Footer */}
          <motion.p 
            variants={itemVariants}
            className="mt-6 text-center text-xs text-gray-600"
          >
            © 2026 Apogee, Inc. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;