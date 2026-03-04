/**
 * Login.jsx
 * Ultimate login page with multiple authentication methods
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff,
  HiOutlineDeviceMobile,
  HiOutlineUser,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineSparkles
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple, FaGithub, FaTwitter } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import toast from "react-hot-toast";
import CosmicBackground from "../components/effects/CosmicBackground";
import ApogeeLogo from "../components/auth/ApogeeLogo";

const Login = () => {
  const [method, setMethod] = useState("email"); // email, phone, social
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateEmail = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const validatePhone = () => {
    const newErrors = {};
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = method === "email" ? validateEmail() : validatePhone();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Welcome to Apogee! 🎉");
      navigate("/dashboard");
      setLoading(false);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    toast.loading(`Connecting to ${provider}...`, { id: "social" });
    
    setTimeout(() => {
      toast.success(`Signed in with ${provider}! 🎉`, { id: "social" });
      navigate("/dashboard");
      setLoading(false);
    }, 2000);
  };

  const quickUsers = [
    { email: "demo@apogee.com", password: "demo123", label: "Demo User" },
    { email: "admin@apogee.com", password: "admin123", label: "Admin" }
  ];

  const fillCredentials = (email, password) => {
    setFormData({ ...formData, email, password });
    toast.success("Credentials filled!");
  };

  return (
    <>
      <CosmicBackground intensity={0.9} />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        {/* Floating stats in background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-blue-500/30"
              style={{
                left: `${10 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              <HiOutlineSparkles size={48 + i * 20} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <ApogeeLogo size="lg" animated={true} />
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/30 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-4 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Welcome to Apogee
              </h1>
              <p className="text-gray-400 mt-2">The pinnacle of productivity</p>
            </div>

            {/* Method Selector */}
            <div className="px-8 pb-4">
              <div className="flex bg-black/20 rounded-xl p-1">
                {["email", "phone", "social"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${
                      method === m
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Section */}
            <div className="px-8 pb-8">
              <AnimatePresence mode="wait">
                {method === "email" && (
                  <motion.form
                    key="email-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`
                            w-full pl-10 pr-4 py-3
                            bg-white/10 backdrop-blur-sm
                            border-2 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            transition-all duration-200
                            ${errors.email ? "border-red-500" : "border-gray-600/50"}
                            text-white placeholder-gray-400
                          `}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`
                            w-full pl-10 pr-12 py-3
                            bg-white/10 backdrop-blur-sm
                            border-2 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            transition-all duration-200
                            ${errors.password ? "border-red-500" : "border-gray-600/50"}
                            text-white placeholder-gray-400
                          `}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                      )}
                    </div>

                    {/* Quick Fill Demo Users */}
                    <div className="flex gap-2 pt-2">
                      {quickUsers.map((user, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => fillCredentials(user.email, user.password)}
                          className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-colors"
                        >
                          {user.label}
                        </button>
                      ))}
                    </div>
                  </motion.form>
                )}

                {method === "phone" && (
                  <motion.form
                    key="phone-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlineDeviceMobile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 234 567 8900"
                          className={`
                            w-full pl-10 pr-4 py-3
                            bg-white/10 backdrop-blur-sm
                            border-2 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            transition-all duration-200
                            ${errors.phone ? "border-red-500" : "border-gray-600/50"}
                            text-white placeholder-gray-400
                          `}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`
                            w-full pl-10 pr-12 py-3
                            bg-white/10 backdrop-blur-sm
                            border-2 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            transition-all duration-200
                            ${errors.password ? "border-red-500" : "border-gray-600/50"}
                            text-white placeholder-gray-400
                          `}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                      )}
                    </div>
                  </motion.form>
                )}

                {method === "social" && (
                  <motion.div
                    key="social-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <p className="text-center text-sm text-gray-400 mb-4">
                      Continue with your favorite platform
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSocialLogin("Google")}
                        className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all"
                      >
                        <FcGoogle className="w-5 h-5" />
                        <span className="text-sm text-white">Google</span>
                      </button>

                      <button
                        onClick={() => handleSocialLogin("Facebook")}
                        className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#1877f2]/20 hover:bg-[#1877f2]/30 border border-[#1877f2]/30 rounded-xl transition-all"
                      >
                        <FaFacebook className="w-5 h-5 text-[#1877f2]" />
                        <span className="text-sm text-white">Facebook</span>
                      </button>

                      <button
                        onClick={() => handleSocialLogin("Apple")}
                        className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all"
                      >
                        <FaApple className="w-5 h-5 text-white" />
                        <span className="text-sm text-white">Apple</span>
                      </button>

                      <button
                        onClick={() => handleSocialLogin("GitHub")}
                        className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all"
                      >
                        <FaGithub className="w-5 h-5 text-white" />
                        <span className="text-sm text-white">GitHub</span>
                      </button>

                      <button
                        onClick={() => handleSocialLogin("Twitter")}
                        className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 rounded-xl transition-all"
                      >
                        <FaTwitter className="w-5 h-5 text-[#1DA1F2]" />
                        <span className="text-sm text-white">Twitter</span>
                      </button>

                      <button
                        onClick={() => handleSocialLogin("Gmail")}
                        className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#EA4335]/20 hover:bg-[#EA4335]/30 border border-[#EA4335]/30 rounded-xl transition-all"
                      >
                        <SiGmail className="w-5 h-5 text-[#EA4335]" />
                        <span className="text-sm text-white">Gmail</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Common Options */}
              {(method === "email" || method === "phone") && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 bg-white/10 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Remember me</span>
                    </label>
                    <button className="text-sm text-blue-400 hover:text-blue-300">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="relative w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              )}

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{" "}
                <button className="text-blue-400 hover:text-blue-300 font-semibold">
                  Create free account
                </button>
              </p>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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
        </motion.div>
      </div>
    </>
  );
};

export default Login;
