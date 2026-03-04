import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HiOutlineClipboardList, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineFire,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCog
} from "react-icons/hi";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 24,
    completed: 16,
    pending: 8,
    streak: 7,
    productivity: 85
  });
  const [greeting, setGreeting] = useState("");

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

  const statCards = [
    { title: "Total Tasks", value: stats.totalTasks, icon: HiOutlineClipboardList, color: "from-blue-600 to-blue-700" },
    { title: "Completed", value: stats.completed, icon: HiOutlineCheckCircle, color: "from-green-600 to-green-700" },
    { title: "Pending", value: stats.pending, icon: HiOutlineClock, color: "from-yellow-600 to-yellow-700" },
    { title: "Day Streak", value: stats.streak, icon: HiOutlineFire, color: "from-orange-600 to-orange-700", suffix: "days" }
  ];

  const recentTasks = [
    { id: 1, title: "Complete project proposal", status: "pending", priority: "high", due: "Today" },
    { id: 2, title: "Review pull requests", status: "in_progress", priority: "medium", due: "Tomorrow" },
    { id: 3, title: "Update documentation", status: "completed", priority: "low", due: "Yesterday" },
    { id: 4, title: "Fix navigation bug", status: "pending", priority: "high", due: "Today" },
    { id: 5, title: "Design system updates", status: "in_progress", priority: "medium", due: "Tomorrow" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Apogee
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <HiOutlineUser size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <HiOutlineCog size={20} />
              </button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <HiOutlineLogout size={18} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {greeting}, User! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your tasks today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}{stat.suffix ? ` ${stat.suffix}` : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    style={{ width: `${(stat.value / 30) * 100}%` }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Tasks
              </h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            
            <div className="space-y-3">
              {recentTasks.map((task) => (
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">Due: {task.due}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                    task.priority === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Productivity Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Productivity
            </h2>
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Chart coming soon...</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
