/**
 * Dashboard.jsx
 * Ultimate dashboard with all features
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  HiOutlineX
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const stats = [
    { title: "Total Tasks", value: 156, change: "+12%", icon: HiOutlineClipboardList, color: "from-blue-600 to-blue-700" },
    { title: "Completed", value: 98, change: "+8%", icon: HiOutlineCheckCircle, color: "from-green-600 to-green-700" },
    { title: "In Progress", value: 42, change: "+15%", icon: HiOutlineClock, color: "from-yellow-600 to-yellow-700" },
    { title: "Streak", value: 12, change: "days", icon: HiOutlineFire, color: "from-orange-600 to-orange-700" },
    { title: "Productivity", value: "94%", change: "+5%", icon: HiOutlineTrendingUp, color: "from-purple-600 to-purple-700" },
    { title: "Focus Time", value: "128h", change: "+23h", icon: HiOutlineStar, color: "from-pink-600 to-pink-700" }
  ];

  const recentTasks = [
    { id: 1, title: "Complete project proposal", project: "Website Redesign", priority: "high", due: "Today", status: "pending" },
    { id: 2, title: "Review pull requests", project: "Backend API", priority: "medium", due: "Tomorrow", status: "in_progress" },
    { id: 3, title: "Update documentation", project: "Documentation", priority: "low", due: "Yesterday", status: "completed" },
    { id: 4, title: "Fix navigation bug", project: "Frontend", priority: "high", due: "Today", status: "pending" },
    { id: 5, title: "Design system updates", project: "UI/UX", priority: "medium", due: "Tomorrow", status: "in_progress" },
    { id: 6, title: "API integration", project: "Backend", priority: "high", due: "Today", status: "pending" },
    { id: 7, title: "Code review", project: "Team", priority: "medium", due: "Tomorrow", status: "in_progress" },
    { id: 8, title: "Deploy to production", project: "DevOps", priority: "high", due: "Today", status: "pending" }
  ];

  const projects = [
    { id: 1, name: "Website Redesign", tasks: 24, completed: 18, color: "from-blue-600 to-blue-700" },
    { id: 2, name: "Backend API", tasks: 32, completed: 24, color: "from-purple-600 to-purple-700" },
    { id: 3, name: "Mobile App", tasks: 18, completed: 12, color: "from-pink-600 to-pink-700" },
    { id: 4, name: "Documentation", tasks: 12, completed: 8, color: "from-green-600 to-green-700" }
  ];

  const activities = [
    { id: 1, user: "John", action: "completed task", target: "API documentation", time: "2 min ago" },
    { id: 2, user: "Sarah", action: "created project", target: "Mobile App", time: "15 min ago" },
    { id: 3, user: "Mike", action: "commented on", target: "Design review", time: "1 hour ago" },
    { id: 4, user: "Emma", action: "assigned task", target: "Bug fix", time: "2 hours ago" },
    { id: 5, user: "Alex", action: "updated status", target: "Deployment", time: "3 hours ago" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              </div>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks, projects, people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <HiOutlineBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <HiOutlineCog size={20} />
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <HiOutlineLogout size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-20 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-64"
      }`}>
        <div className="p-4">
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Menu</p>
            <nav className="space-y-1">
              {[
                { id: "overview", label: "Overview", icon: HiOutlineClipboardList },
                { id: "projects", label: "Projects", icon: HiOutlineFolder },
                { id: "tasks", label: "Tasks", icon: HiOutlineCheckCircle },
                { id: "calendar", label: "Calendar", icon: HiOutlineCalendar },
                { id: "analytics", label: "Analytics", icon: HiOutlineChartBar },
                { id: "team", label: "Team", icon: HiOutlineUsers }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Projects</p>
            <div className="space-y-2">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{project.name}</span>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.color}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : ""}`}>
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
              Welcome back to your dashboard
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{stat.title}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <button className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white hover:shadow-lg transition-all">
              <HiOutlinePlus className="w-6 h-6 mb-2" />
              <p className="text-sm font-medium">New Task</p>
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white hover:shadow-lg transition-all">
              <HiOutlineFolder className="w-6 h-6 mb-2" />
              <p className="text-sm font-medium">New Project</p>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white hover:shadow-lg transition-all">
              <HiOutlineUsers className="w-6 h-6 mb-2" />
              <p className="text-sm font-medium">Invite Team</p>
            </button>
            <button className="p-4 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl text-white hover:shadow-lg transition-all">
              <HiOutlineChartBar className="w-6 h-6 mb-2" />
              <p className="text-sm font-medium">View Reports</p>
            </button>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">View all</button>
              </div>

              <div className="space-y-3">
                {recentTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => {}}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className={`font-medium ${
                          task.status === "completed" 
                            ? "line-through text-gray-500 dark:text-gray-400" 
                            : "text-gray-900 dark:text-white"
                        }`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{task.project}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        task.priority === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{task.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Feed</h2>
              
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                      {activity.user[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">View all</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.color}`} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {project.completed}/{project.tasks} tasks
                  </p>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${project.color} rounded-full`}
                      style={{ width: `${(project.completed / project.tasks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
