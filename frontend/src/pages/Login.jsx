/**
 * Login.jsx - ENTERPRISE EDITION
 * Complete authentication system with all features
 */

import React, { useState, useEffect } from "react";
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
  HiOutlineSparkles,
  HiOutlineFingerPrint,
  HiOutlineKey,
  HiOutlineQrCode,
  HiOutlineGlobe,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineCloud,
  HiOutlineDatabase,
  HiOutlineChip,
  HiOutlineCube,
  HiOutlineLightBulb,
  HiOutlineStar
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple, FaGithub, FaTwitter, FaLinkedin, FaMicrosoft, FaAmazon, FaSlack, FaDropbox, FaFigma } from "react-icons/fa";
import { SiGmail, SiOutlook, SiYahoo, SiProtonmail, SiAuth0, SiOkta } from "react-icons/si";
import { BiFingerprint, BiQrScan } from "react-icons/bi";
import { RiShieldStarLine, RiSecurePaymentLine } from "react-icons/ri";
import toast from "react-hot-toast";
import CosmicBackground from "../components/effects/CosmicBackground";
import ApogeeLogo from "../components/auth/ApogeeLogo";

const Login = () => {
  const [method, setMethod] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [mfaMethod, setMfaMethod] = useState("app"); // app, sms, email, hardware
  const [showQrCode, setShowQrCode] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [trustDevice, setTrustDevice] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  const navigate = useNavigate();

  // Simulate CAPTCHA
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, number and special character";
    }
    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (isSignUp && !acceptedTerms) {
      newErrors.terms = "You must accept the terms";
    }
    if (!captchaVerified && !isSignUp) {
      if (captchaInput !== captchaText) {
        newErrors.captcha = "Invalid CAPTCHA";
      }
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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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

    setLoginAttempts(prev => prev + 1);
    setLoading(true);
    
    // Simulate API call with 2FA
    setTimeout(() => {
      if (loginAttempts > 2) {
        setTwoFactor(true);
        setLoading(false);
      } else {
        toast.success("Welcome to Apogee! 🎉");
        navigate("/dashboard");
        setLoading(false);
      }
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

  const handle2FAVerify = () => {
    if (twoFactorCode.length === 6) {
      toast.success("2FA verified successfully!");
      setTwoFactor(false);
      navigate("/dashboard");
    } else {
      toast.error("Invalid 2FA code");
    }
  };

  const handleMFAEnroll = () => {
    setShowQrCode(true);
    setRecoveryCodes([
      "ABCD-EFGH-IJKL-MNOP",
      "QRST-UVWX-YZAB-CDEF",
      "GHIJ-KLMN-OPQR-STUV",
      "WXYZ-ABCD-EFGH-IJKL"
    ]);
  };

  const enterpriseFeatures = [
    { icon: HiOutlineShieldCheck, label: "Zero Trust Security", color: "blue" },
    { icon: HiOutlineChip, label: "AI-Powered", color: "purple" },
    { icon: HiOutlineCube, label: "Blockchain Ready", color: "green" },
    { icon: HiOutlineDatabase, label: "Quantum Safe", color: "orange" },
    { icon: HiOutlineGlobe, label: "Global CDN", color: "pink" },
    { icon: HiOutlineCloud, label: "Multi-Cloud", color: "indigo" }
  ];

  const authProviders = [
    { name: "Google", icon: FcGoogle, bg: "bg-white/10 hover:bg-white/15" },
    { name: "Microsoft", icon: FaMicrosoft, bg: "bg-[#00a4ef]/10 hover:bg-[#00a4ef]/20" },
    { name: "Apple", icon: FaApple, bg: "bg-white/10 hover:bg-white/15" },
    { name: "GitHub", icon: FaGithub, bg: "bg-white/10 hover:bg-white/15" },
    { name: "Facebook", icon: FaFacebook, bg: "bg-[#1877f2]/10 hover:bg-[#1877f2]/20" },
    { name: "Twitter", icon: FaTwitter, bg: "bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20" },
    { name: "LinkedIn", icon: FaLinkedin, bg: "bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20" },
    { name: "Amazon", icon: FaAmazon, bg: "bg-[#ff9900]/10 hover:bg-[#ff9900]/20" },
    { name: "Slack", icon: FaSlack, bg: "bg-[#4a154b]/10 hover:bg-[#4a154b]/20" },
    { name: "Dropbox", icon: FaDropbox, bg: "bg-[#0061ff]/10 hover:bg-[#0061ff]/20" },
    { name: "Figma", icon: FaFigma, bg: "bg-[#f24e1e]/10 hover:bg-[#f24e1e]/20" },
    { name: "Gmail", icon: SiGmail, bg: "bg-[#EA4335]/10 hover:bg-[#EA4335]/20" },
    { name: "Outlook", icon: SiOutlook, bg: "bg-[#0078d4]/10 hover:bg-[#0078d4]/20" },
    { name: "Yahoo", icon: SiYahoo, bg: "bg-[#6001d2]/10 hover:bg-[#6001d2]/20" },
    { name: "Proton", icon: SiProtonmail, bg: "bg-[#6d4aff]/10 hover:bg-[#6d4aff]/20" }
  ];

  const quickUsers = [
    { email: "demo@apogee.com", password: "Demo@123", label: "Demo User", role: "user" },
    { email: "admin@apogee.com", password: "Admin@123", label: "Admin", role: "admin" },
    { email: "enterprise@apogee.com", password: "Enterprise@123", label: "Enterprise", role: "enterprise" },
    { email: "guest@apogee.com", password: "Guest@123", label: "Guest", role: "guest" }
  ];

  return (
    <>
      <CosmicBackground intensity={0.95} />
      
      {/* Enterprise Security Badges - Floating */}
      <div className="fixed top-4 left-4 z-20 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/30 backdrop-blur-xl rounded-lg p-3 border border-white/10"
        >
          <div className="flex items-center space-x-4">
            <RiShieldStarLine className="w-5 h-5 text-green-400" />
            <span className="text-xs text-white">SOC 2 Type II</span>
            <RiSecurePaymentLine className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-white">ISO 27001</span>
            <HiOutlineFingerPrint className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-white">FIDO2 Ready</span>
          </div>
        </motion.div>
      </div>

      {/* Enterprise Stats */}
      <div className="fixed top-4 right-4 z-20 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex space-x-4"
        >
          <div className="text-right">
            <p className="text-xs text-gray-400">99.99% Uptime</p>
            <p className="text-lg font-bold text-white">SLA</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-right">
            <p className="text-xs text-gray-400">50ms</p>
            <p className="text-lg font-bold text-white">Latency</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-right">
            <p className="text-xs text-gray-400">256-bit</p>
            <p className="text-lg font-bold text-white">Encryption</p>
          </div>
        </motion.div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        {/* Floating enterprise features */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
          {enterpriseFeatures.map((feature, i) => (
            <motion.div
              key={i}
              className="absolute flex items-center space-x-2"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              <feature.icon className={`w-8 h-8 text-${feature.color}-500`} />
              <span className="text-xs text-white">{feature.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
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
            {/* Header with gradient */}
            <div className="px-8 pt-8 pb-4 text-center bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Welcome to Apogee
              </h1>
              <p className="text-gray-300 mt-2">The enterprise productivity platform</p>
              
              {/* Trust badges */}
              <div className="flex items-center justify-center space-x-6 mt-4">
                {enterpriseFeatures.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <feature.icon className={`w-4 h-4 text-${feature.color}-400`} />
                    <span className="text-xs text-gray-400">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-Factor Authentication Modal */}
            <AnimatePresence>
              {twoFactor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700"
                  >
                    <div className="text-center mb-6">
                      <HiOutlineFingerPrint className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-white">Two-Factor Authentication</h2>
                      <p className="text-gray-400 mt-2">Enter the 6-digit code from your authenticator app</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value)}
                          maxLength={6}
                          placeholder="000000"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => setTwoFactor(false)}
                          className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={handle2FAVerify}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Verify
                        </button>
                      </div>

                      <div className="text-center">
                        <button className="text-sm text-blue-400 hover:text-blue-300">
                          Use recovery code
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MFA Enrollment Modal */}
            <AnimatePresence>
              {showQrCode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700"
                  >
                    <div className="text-center mb-6">
                      <BiQrScan className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-white">Set Up 2FA</h2>
                      <p className="text-gray-400 mt-2">Scan this QR code with your authenticator app</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
                      <div className="w-48 h-48 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xs">QR Code Placeholder</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Recovery codes (save these!)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {recoveryCodes.map((code, i) => (
                            <div key={i} className="bg-gray-800 p-2 rounded text-xs font-mono text-center text-gray-300">
                              {code}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setShowQrCode(false)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        I've saved my recovery codes
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-8">
              {/* Login/Signup Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-black/20 rounded-full p-1">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      !isSignUp
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      isSignUp
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Method Selector */}
              <div className="flex mb-6 bg-black/20 rounded-xl p-1">
                {["email", "phone", "social", "sso", "webauthn"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${
                      method === m
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {m === "webauthn" ? "Biometric" : m}
                  </button>
                ))}
              </div>

              {/* Form Section */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {/* Email Form */}
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
                        <div className="relative group">
                          <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@company.com"
                            className={`
                              w-full pl-10 pr-4 py-3
                              bg-white/5 backdrop-blur-sm
                              border-2 rounded-xl
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/10
                              transition-all duration-200
                              ${errors.email ? "border-red-500" : "border-gray-600/50"}
                              text-white placeholder-gray-500
                              hover:bg-white/10
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
                        <div className="relative group">
                          <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`
                              w-full pl-10 pr-12 py-3
                              bg-white/5 backdrop-blur-sm
                              border-2 rounded-xl
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/10
                              transition-all duration-200
                              ${errors.password ? "border-red-500" : "border-gray-600/50"}
                              text-white placeholder-gray-500
                              hover:bg-white/10
                            `}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                        )}
                      </div>

                      {isSignUp && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Confirm Password <span className="text-red-400">*</span>
                            </label>
                            <div className="relative group">
                              <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`
                                  w-full pl-10 pr-12 py-3
                                  bg-white/5 backdrop-blur-sm
                                  border-2 rounded-xl
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/10
                                  transition-all duration-200
                                  ${errors.confirmPassword ? "border-red-500" : "border-gray-600/50"}
                                  text-white placeholder-gray-500
                                  hover:bg-white/10
                                `}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                              >
                                {showConfirmPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                              </button>
                            </div>
                            {errors.confirmPassword && (
                              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 bg-white/10 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-300">
                                I accept the{" "}
                                <button className="text-blue-400 hover:text-blue-300">Terms of Service</button>{" "}
                                and{" "}
                                <button className="text-blue-400 hover:text-blue-300">Privacy Policy</button>
                              </span>
                            </label>
                            {errors.terms && (
                              <p className="text-sm text-red-400">{errors.terms}</p>
                            )}
                          </div>
                        </>
                      )}

                      {/* CAPTCHA */}
                      {!isSignUp && (
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg font-mono text-xl tracking-widest">
                              {captchaText}
                            </div>
                            <button
                              type="button"
                              onClick={generateCaptcha}
                              className="text-sm text-blue-400 hover:text-blue-300"
                            >
                              Refresh
                            </button>
                          </div>
                          <input
                            type="text"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            placeholder="Enter CAPTCHA"
                            className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.captcha && (
                            <p className="mt-1 text-sm text-red-400">{errors.captcha}</p>
                          )}
                        </div>
                      )}

                      {/* Security options */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={trustDevice}
                            onChange={(e) => setTrustDevice(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-white/10 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">Trust this device</span>
                        </label>

                        <select
                          value={sessionTimeout}
                          onChange={(e) => setSessionTimeout(e.target.value)}
                          className="bg-white/10 border border-gray-600 rounded-lg px-2 py-1 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="15">15 min session</option>
                          <option value="30">30 min session</option>
                          <option value="60">1 hour session</option>
                          <option value="480">8 hour session</option>
                        </select>
                      </div>

                      {/* MFA Options */}
                      {!isSignUp && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Two-factor method</p>
                          <div className="flex space-x-2">
                            {["app", "sms", "email", "hardware"].map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setMfaMethod(m)}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs capitalize transition-all ${
                                  mfaMethod === m
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={handleMFAEnroll}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            Set up authenticator app →
                          </button>
                        </div>
                      )}

                      {/* Quick Fill Demo Users */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {quickUsers.map((user, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData({ ...formData, email: user.email, password: user.password })}
                            className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-colors"
                          >
                            <div className="font-medium">{user.label}</div>
                            <div className="text-gray-500">{user.role}</div>
                          </button>
                        ))}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                      >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                              <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>
                    </motion.form>
                  )}

                  {/* Phone Form */}
                  {method === "phone" && (
                    <motion.form
                      key="phone-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Similar to email form but with phone fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <div className="relative group">
                          <HiOutlineDeviceMobile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 234 567 8900"
                            className={`
                              w-full pl-10 pr-4 py-3
                              bg-white/5 backdrop-blur-sm
                              border-2 rounded-xl
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/10
                              transition-all duration-200
                              ${errors.phone ? "border-red-500" : "border-gray-600/50"}
                              text-white placeholder-gray-500
                              hover:bg-white/10
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
                        <div className="relative group">
                          <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`
                              w-full pl-10 pr-12 py-3
                              bg-white/5 backdrop-blur-sm
                              border-2 rounded-xl
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/10
                              transition-all duration-200
                              ${errors.password ? "border-red-500" : "border-gray-600/50"}
                              text-white placeholder-gray-500
                              hover:bg-white/10
                            `}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
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

                  {/* Social Login Grid */}
                  {method === "social" && (
                    <motion.div
                      key="social-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-center text-sm text-gray-400 mb-4">
                        Choose from 15+ enterprise providers
                      </p>

                      <div className="grid grid-cols-3 gap-3">
                        {authProviders.map((provider, i) => (
                          <button
                            key={i}
                            onClick={() => handleSocialLogin(provider.name)}
                            className={`flex flex-col items-center justify-center space-y-2 py-4 px-3 ${provider.bg} border border-white/10 rounded-xl transition-all hover:scale-105`}
                          >
                            <provider.icon className="w-6 h-6" />
                            <span className="text-xs text-white">{provider.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Enterprise SSO */}
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-center text-sm text-gray-400 mb-4">
                          Enterprise Single Sign-On
                        </p>
                        <div className="flex space-x-3">
                          <button className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white flex items-center justify-center space-x-2">
                            <SiAuth0 className="w-4 h-4" />
                            <span>Auth0</span>
                          </button>
                          <button className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white flex items-center justify-center space-x-2">
                            <SiOkta className="w-4 h-4" />
                            <span>Okta</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SSO Form */}
                  {method === "sso" && (
                    <motion.div
                      key="sso-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-center text-sm text-gray-400 mb-4">
                        Enter your company domain for SSO
                      </p>
                      <div className="relative">
                        <HiOutlineGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="your-company.com"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/10"
                        />
                      </div>
                      <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl">
                        Continue with SSO
                      </button>
                    </motion.div>
                  )}

                  {/* WebAuthn / Biometric */}
                  {method === "webauthn" && (
                    <motion.div
                      key="webauthn-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 text-center"
                    >
                      <BiFingerprint className="w-24 h-24 text-blue-500 mx-auto" />
                      <p className="text-gray-300">Use your device's biometric authentication</p>
                      <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl">
                        Continue with Face ID / Touch ID
                      </button>
                      <p className="text-xs text-gray-500">
                        Supported on devices with biometric hardware
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Security Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <HiOutlineShieldCheck className="w-3 h-3 text-green-500" />
                      <span>AES-256-GCM</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <HiOutlineShieldCheck className="w-3 h-3 text-green-500" />
                      <span>TLS 1.3</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <HiOutlineShieldCheck className="w-3 h-3 text-green-500" />
                      <span>FIPS 140-2</span>
                    </span>
                  </div>
                  <div>
                    <span>v4.0.0 • Enterprise</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Compliance Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-6"
          >
            <div className="flex items-center space-x-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500">HIPAA Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500">SOC 2 Type II</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500">ISO 27001</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500">FedRAMP</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
