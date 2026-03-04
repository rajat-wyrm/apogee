/**
 * Dashboard.jsx - ENTERPRISE EDITION
 * Complete productivity platform with all features
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineClipboardList, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineFire,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlinePlus,
  HiOutlineFolder,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineTrendingUp,
  HiOutlineRefresh,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineDownload,
  HiOutlineUpload,
  HiOutlineShare,
  HiOutlineDuplicate,
  HiOutlineArchive,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineLockClosed,
  HiOutlineGlobe,
  HiOutlineCloud,
  HiOutlineDatabase,
  HiOutlineChip,
  HiOutlineCube,
  HiOutlineLightBulb,
  HiOutlineSparkles,
  HiOutlineRocket,
  HiOutlineGift,
  HiOutlineTrophy,
  HiOutlineAward,
  HiOutlineHeart,
  HiOutlineThumbUp,
  HiOutlineAnnotation,
  HiOutlineChat,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineVideoCamera,
  HiOutlineMicrophone,
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineDesktopComputer,
  HiOutlineDeviceMobile,
  HiOutlineDeviceTablet,
  HiOutlinePrinter,
  HiOutlineQrcode,
  HiOutlineScissors,
  HiOutlinePaperClip,
  HiOutlineLink,
  HiOutlineAtSymbol,
  HiOutlineHashtag,
  HiOutlineCode,
  HiOutlineTerminal,
  HiOutlineCommandLine,
  HiOutlineBug,
  HiOutlineBeaker,
  HiOutlineFlask,
  HiOutlineLab,
  HiOutlineRss,
  HiOutlineWifi,
  HiOutlineServer,
  HiOutlineCpu,
  HiOutlineHardDrive,
  HiOutlineSdCard,
  HiOutlineBatteryCharging,
  HiOutlineBattery50,
  HiOutlineBattery0,
  HiOutlineLightningBolt,
  HiOutlineColorSwatch,
  HiOutlinePaintBrush,
  HiOutlinePencilAlt,
  HiOutlinePhotograph,
  HiOutlineCamera,
  HiOutlineFilm,
  HiOutlineMusicNote,
  HiOutlineVolumeUp as HiOutlineMusic,
  HiOutlineBookOpen,
  HiOutlineLibrary,
  HiOutlineAcademicCap,
  HiOutlineCertificate,
  HiOutlineBadgeCheck,
  HiOutlineShieldCheck,
  HiOutlineShieldExclamation,
  HiOutlineShieldX
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, ScatterChart, Scatter, Treemap, Sankey,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, Sector, RadialBarChart, RadialBar
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Task completed", message: "You completed 'API Documentation'", time: "2 min ago", read: false, type: "success" },
    { id: 2, title: "New comment", message: "Sarah commented on your task", time: "15 min ago", read: false, type: "info" },
    { id: 3, title: "Project deadline", message: "Website redesign due tomorrow", time: "1 hour ago", read: false, type: "warning" },
    { id: 4, title: "Team meeting", message: "Sprint planning at 10 AM", time: "3 hours ago", read: true, type: "info" },
    { id: 5, title: "Achievement unlocked", message: "You completed 100 tasks!", time: "5 hours ago", read: true, type: "success" }
  ]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [dateRange, setDateRange] = useState("week");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Online/offline detection
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Advanced analytics data
  const weeklyData = [
    { day: "Mon", tasks: 12, completed: 8, time: 4.5, efficiency: 75 },
    { day: "Tue", tasks: 15, completed: 12, time: 5.2, efficiency: 80 },
    { day: "Wed", tasks: 18, completed: 15, time: 6.1, efficiency: 83 },
    { day: "Thu", tasks: 14, completed: 11, time: 4.8, efficiency: 78 },
    { day: "Fri", tasks: 20, completed: 18, time: 7.3, efficiency: 90 },
    { day: "Sat", tasks: 8, completed: 6, time: 3.2, efficiency: 75 },
    { day: "Sun", tasks: 6, completed: 4, time: 2.1, efficiency: 66 }
  ];

  const monthlyData = [
    { month: "Jan", tasks: 120, completed: 95, time: 45 },
    { month: "Feb", tasks: 135, completed: 110, time: 52 },
    { month: "Mar", tasks: 150, completed: 125, time: 58 },
    { month: "Apr", tasks: 140, completed: 118, time: 54 },
    { month: "May", tasks: 165, completed: 140, time: 62 },
    { month: "Jun", tasks: 180, completed: 155, time: 68 }
  ];

  const categoryData = [
    { name: "Development", value: 45, color: "#3B82F6" },
    { name: "Design", value: 25, color: "#8B5CF6" },
    { name: "Research", value: 15, color: "#10B981" },
    { name: "Testing", value: 10, color: "#F59E0B" },
    { name: "Documentation", value: 5, color: "#6366F1" }
  ];

  const priorityData = [
    { name: "Critical", value: 8, color: "#EF4444" },
    { name: "High", value: 22, color: "#F97316" },
    { name: "Medium", value: 45, color: "#EAB308" },
    { name: "Low", value: 25, color: "#22C55E" }
  ];

  const teamPerformance = [
    { subject: "Velocity", Alex: 95, Sarah: 88, Mike: 92, fullMark: 100 },
    { subject: "Quality", Alex: 88, Sarah: 94, Mike: 85, fullMark: 100 },
    { subject: "Efficiency", Alex: 92, Sarah: 86, Mike: 90, fullMark: 100 },
    { subject: "Collaboration", Alex: 85, Sarah: 96, Mike: 82, fullMark: 100 },
    { subject: "Innovation", Alex: 78, Sarah: 92, Mike: 88, fullMark: 100 }
  ];

  const stats = [
    { title: "Total Tasks", value: 1250, change: "+12.3%", icon: HiOutlineClipboardList, color: "blue", bg: "from-blue-600 to-blue-700" },
    { title: "Completed", value: 845, change: "+8.2%", icon: HiOutlineCheckCircle, color: "green", bg: "from-green-600 to-green-700" },
    { title: "In Progress", value: 324, change: "+15.7%", icon: HiOutlineClock, color: "yellow", bg: "from-yellow-600 to-yellow-700" },
    { title: "Streak", value: 23, change: "days", icon: HiOutlineFire, color: "orange", bg: "from-orange-600 to-orange-700" },
    { title: "Productivity", value: "94%", change: "+5.2%", icon: HiOutlineTrendingUp, color: "purple", bg: "from-purple-600 to-purple-700" },
    { title: "Focus Time", value: "247h", change: "+32h", icon: HiOutlineStar, color: "pink", bg: "from-pink-600 to-pink-700" },
    { title: "Projects", value: 12, change: "+3", icon: HiOutlineFolder, color: "indigo", bg: "from-indigo-600 to-indigo-700" },
    { title: "Team", value: 8, change: "+2", icon: HiOutlineUsers, color: "cyan", bg: "from-cyan-600 to-cyan-700" }
  ];

  const recentTasks = [
    { id: 1, title: "Complete project proposal", project: "Website Redesign", priority: "high", due: "Today", status: "pending", assignee: "Alex", comments: 3, attachments: 2 },
    { id: 2, title: "Review pull requests", project: "Backend API", priority: "medium", due: "Tomorrow", status: "in_progress", assignee: "Sarah", comments: 5, attachments: 1 },
    { id: 3, title: "Update documentation", project: "Documentation", priority: "low", due: "Yesterday", status: "completed", assignee: "Mike", comments: 2, attachments: 0 },
    { id: 4, title: "Fix navigation bug", project: "Frontend", priority: "high", due: "Today", status: "pending", assignee: "Alex", comments: 4, attachments: 3 },
    { id: 5, title: "Design system updates", project: "UI/UX", priority: "medium", due: "Tomorrow", status: "in_progress", assignee: "Emma", comments: 6, attachments: 4 },
    { id: 6, title: "API integration", project: "Backend", priority: "high", due: "Today", status: "pending", assignee: "Mike", comments: 2, attachments: 1 },
    { id: 7, title: "Code review", project: "Team", priority: "medium", due: "Tomorrow", status: "in_progress", assignee: "Sarah", comments: 8, attachments: 2 },
    { id: 8, title: "Deploy to production", project: "DevOps", priority: "critical", due: "Today", status: "pending", assignee: "Alex", comments: 1, attachments: 5 }
  ];

  const projects = [
    { id: 1, name: "Website Redesign", tasks: 24, completed: 18, color: "blue", progress: 75, deadline: "2024-06-15", team: ["Alex", "Emma", "Mike"] },
    { id: 2, name: "Backend API", tasks: 32, completed: 24, color: "purple", progress: 75, deadline: "2024-06-30", team: ["Sarah", "Mike", "John"] },
    { id: 3, name: "Mobile App", tasks: 18, completed: 12, color: "pink", progress: 66, deadline: "2024-07-15", team: ["Emma", "Alex", "Lisa"] },
    { id: 4, name: "Documentation", tasks: 12, completed: 8, color: "green", progress: 66, deadline: "2024-06-10", team: ["Mike", "Sarah"] },
    { id: 5, name: "Analytics Dashboard", tasks: 28, completed: 15, color: "orange", progress: 53, deadline: "2024-07-01", team: ["Alex", "Emma", "John"] },
    { id: 6, name: "Security Audit", tasks: 15, completed: 10, color: "red", progress: 66, deadline: "2024-06-20", team: ["Mike", "Sarah"] },
    { id: 7, name: "Performance Optimization", tasks: 20, completed: 8, color: "yellow", progress: 40, deadline: "2024-07-05", team: ["Alex", "Mike"] },
    { id: 8, name: "Testing Suite", tasks: 22, completed: 16, color: "teal", progress: 72, deadline: "2024-06-25", team: ["Emma", "Sarah", "Lisa"] }
  ];

  const activities = [
    { id: 1, user: "John", action: "completed task", target: "API documentation", time: "2 min ago", avatar: "JD" },
    { id: 2, user: "Sarah", action: "created project", target: "Mobile App", time: "15 min ago", avatar: "SJ" },
    { id: 3, user: "Mike", action: "commented on", target: "Design review", time: "1 hour ago", avatar: "MK" },
    { id: 4, user: "Emma", action: "assigned task", target: "Bug fix", time: "2 hours ago", avatar: "EW" },
    { id: 5, user: "Alex", action: "updated status", target: "Deployment", time: "3 hours ago", avatar: "AL" },
    { id: 6, user: "Lisa", action: "uploaded file", target: "Assets.zip", time: "5 hours ago", avatar: "LS" },
    { id: 7, user: "John", action: "merged PR", target: "#234 - Feature branch", time: "6 hours ago", avatar: "JD" },
    { id: 8, user: "Sarah", action: "started review", target: "Code changes", time: "7 hours ago", avatar: "SJ" }
  ];

  const achievements = [
    { id: 1, name: "1000 Tasks", icon: HiOutlineTrophy, progress: 85, color: "gold" },
    { id: 2, name: "30 Day Streak", icon: HiOutlineFire, progress: 76, color: "orange" },
    { id: 3, name: "Team Player", icon: HiOutlineUsers, progress: 92, color: "blue" },
    { id: 4, name: "Early Bird", icon: HiOutlineSun, progress: 64, color: "yellow" },
    { id: 5, name: "Night Owl", icon: HiOutlineMoon, progress: 58, color: "purple" }
  ];

  const upcomingDeadlines = [
    { id: 1, task: "Project proposal", project: "Website", date: "2024-06-05", priority: "high" },
    { id: 2, task: "Client presentation", project: "Mobile App", date: "2024-06-06", priority: "high" },
    { id: 3, task: "Code freeze", project: "Backend", date: "2024-06-07", priority: "medium" },
    { id: 4, task: "Documentation review", project: "Docs", date: "2024-06-08", priority: "low" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Online/Offline Indicator */}
      {!onlineStatus && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-sm z-50">
          You are offline. Changes will be synced when connection is restored.
        </div>
      )}

      {/* Fullscreen toggle */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-2 bg-white/10 backdrop-blur-xl rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <HiOutlineX size={20} />
          </button>
        </div>
      )}

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <HiOutlineX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "⌘/Ctrl + K", action: "Search" },
                  { key: "⌘/Ctrl + N", action: "New Task" },
                  { key: "⌘/Ctrl + P", action: "New Project" },
                  { key: "⌘/Ctrl + B", action: "Toggle Sidebar" },
                  { key: "⌘/Ctrl + ,", action: "Settings" },
                  { key: "⌘/Ctrl + ?", action: "Help" },
                  { key: "⌘/Ctrl + D", action: "Toggle Dark Mode" },
                  { key: "⌘/Ctrl + F", action: "Focus Mode" },
                  { key: "Esc", action: "Close Modals" },
                  { key: "⌘/Ctrl + S", action: "Save" },
                  { key: "⌘/Ctrl + Z", action: "Undo" },
                  { key: "⌘/Ctrl + Y", action: "Redo" }
                ].map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-300">{shortcut.action}</span>
                    <span className="text-xs font-mono bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {shortcut.key}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                {sidebarOpen ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Apogee
                </span>
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">v4.0 Enterprise</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks, projects, people... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                    ⌘
                  </kbd>
                  <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                    K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === "dark" ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                >
                  <HiOutlineBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markNotificationAsRead(notification.id)}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 mt-2 rounded-full ${
                                notification.type === "success" ? "bg-green-500" :
                                notification.type === "warning" ? "bg-yellow-500" :
                                notification.type === "error" ? "bg-red-500" : "bg-blue-500"
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 p-1 pr-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">AL</span>
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alex Lee
                  </span>
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Lee</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">alex@apogee.com</p>
                      </div>
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          Profile Settings
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          Account Security
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          Billing & Plan
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                        <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-20 overflow-y-auto ${
        sidebarOpen ? "translate-x-0" : "-translate-x-72"
      }`}>
        <div className="p-4">
          {/* User summary */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <p className="text-sm opacity-90">Free Plan</p>
            <p className="text-2xl font-bold mt-1">85%</p>
            <p className="text-xs opacity-90 mt-1">of monthly limit used</p>
            <div className="w-full h-1 bg-white/20 rounded-full mt-3">
              <div className="w-3/4 h-full bg-white rounded-full" />
            </div>
          </div>

          {/* Main menu */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Menu</p>
            <nav className="space-y-1">
              {[
                { id: "overview", label: "Overview", icon: HiOutlineClipboardList, count: null },
                { id: "projects", label: "Projects", icon: HiOutlineFolder, count: 12 },
                { id: "tasks", label: "Tasks", icon: HiOutlineCheckCircle, count: 156 },
                { id: "calendar", label: "Calendar", icon: HiOutlineCalendar, count: null },
                { id: "analytics", label: "Analytics", icon: HiOutlineChartBar, count: null },
                { id: "team", label: "Team", icon: HiOutlineUsers, count: 8 },
                { id: "integrations", label: "Integrations", icon: HiOutlineCloud, count: 6 },
                { id: "settings", label: "Settings", icon: HiOutlineCog, count: null }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === item.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Projects */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Active Projects</p>
            <div className="space-y-2">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-${project.color}-600`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{project.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{project.progress}%</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              + Add project
            </button>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quick Links</p>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                📁 All files
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                🏷️ Labels
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                ⏰ Reminders
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                📊 Reports
              </button>
            </div>
          </div>

          {/* Help section */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowShortcuts(true)}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <HiOutlineCommandLine size={18} />
              <span>Keyboard Shortcuts</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <HiOutlineBookOpen size={18} />
              <span>Documentation</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <HiOutlineChat size={18} />
              <span>Support</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {greeting}, Alex! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's your productivity overview
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.bg} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    stat.change.includes("+") ? "text-green-600 bg-green-100 dark:bg-green-900/30" : "text-gray-600 bg-gray-100 dark:bg-gray-700"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{stat.title}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weekly Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <Tooltip
                      contentStyle={{ background: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }}
                    />
                    <Area type="monotone" dataKey="tasks" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTasks)" />
                    <Area type="monotone" dataKey="completed" stroke="#10B981" fillOpacity={1} fill="url(#colorCompleted)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks by Category</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Recent Tasks with advanced features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <HiOutlineFilter size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <HiOutlineDownload size={18} />
                </button>
                <button
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {viewMode === "grid" ? <HiOutlineMenu size={18} /> : <HiOutlineClipboardList size={18} />}
                </button>
              </div>
            </div>

            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer group ${
                    selectedItems.includes(task.id) ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => {
                    if (selectedItems.includes(task.id)) {
                      setSelectedItems(selectedItems.filter(id => id !== task.id));
                    } else {
                      setSelectedItems([...selectedItems, task.id]);
                    }
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(task.id)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === "critical" ? "bg-red-500" :
                      task.priority === "high" ? "bg-orange-500" :
                      task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        task.status === "completed" 
                          ? "line-through text-gray-500 dark:text-gray-400" 
                          : "text-gray-900 dark:text-white"
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{task.project}</span>
                        <span>•</span>
                        <span>Assignee: {task.assignee}</span>
                        <span>•</span>
                        <span>💬 {task.comments}</span>
                        <span>📎 {task.attachments}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      task.priority === "high" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      task.priority === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{task.due}</span>
                    <div className="hidden group-hover:flex items-center space-x-2">
                      <button className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                        <HiOutlinePencil size={14} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                        <HiOutlineTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Two column layout for additional features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Feed</h2>
              
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h2>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <achievement.icon className={`w-6 h-6 text-${achievement.color}-500`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{achievement.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{achievement.progress}%</span>
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${achievement.color}-500 rounded-full`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Floating action button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform">
        <HiOutlinePlus size={24} />
      </button>
    </div>
  );
};

export default Dashboard;
