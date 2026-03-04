/**
 * Calendar Page
 * Immersive 3D calendar with task management
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { taskAPI } from '../services/api';
import ThreeDBackground from '../components/effects/ThreeDBackground';
import CalendarHeader from '../components/calendar/CalendarHeader';
import TaskPreviewModal from '../components/calendar/TaskPreviewModal';
import TaskForm from '../components/TaskForm';
import {
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineDocumentText
} from 'react-icons/hi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [stats, setStats] = useState({
    today: 0,
    upcoming: 0,
    overdue: 0,
    completed: 0
  });

  const calendarRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAll();
      setTasks(response.data.data || []);
      calculateStats(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasksData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = {
      today: 0,
      upcoming: 0,
      overdue: 0,
      completed: 0
    };

    tasksData.forEach(task => {
      if (task.status === 'completed') {
        stats.completed++;
        return;
      }

      if (!task.due_date) return;

      const dueDate = new Date(task.due_date);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        stats.overdue++;
      } else if (dueDate >= today && dueDate < tomorrow) {
        stats.today++;
      } else {
        stats.upcoming++;
      }
    });

    setStats(stats);
  };

  const handleDateClick = (info) => {
    // Open task creation modal with pre-filled date
    setIsFormOpen(true);
    // You can pass the date to the form
  };

  const handleEventClick = (info) => {
    const task = tasks.find(t => t.id === info.event.id);
    if (task) {
      setSelectedTask(task);
      setIsPreviewOpen(true);
    }
  };

  const handleEventDrop = async (info) => {
    try {
      const taskId = info.event.id;
      const newDate = format(info.event.start, 'yyyy-MM-dd');
      
      await taskAPI.update(taskId, { due_date: newDate });
      toast.success('Task rescheduled');
      fetchTasks(); // Refresh to get updated data
    } catch (error) {
      console.error('Failed to update task date:', error);
      toast.error('Failed to reschedule task');
      info.revert();
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await taskAPI.toggleComplete(taskId);
      toast.success('Task updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskAPI.delete(taskId);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
    setIsPreviewOpen(false);
  };

  const handleFormSubmit = async (taskData) => {
    if (selectedTask) {
      // Update existing task
      try {
        await taskAPI.update(selectedTask.id, taskData);
        toast.success('Task updated');
      } catch (error) {
        toast.error('Failed to update task');
      }
    } else {
      // Create new task
      try {
        await taskAPI.create(taskData);
        toast.success('Task created');
      } catch (error) {
        toast.error('Failed to create task');
      }
    }
    
    setIsFormOpen(false);
    setSelectedTask(null);
    fetchTasks();
  };

  const calendarEvents = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.due_date,
    allDay: true,
    backgroundColor: task.status === 'completed' 
      ? '#10b981' 
      : task.priority === 'high' 
        ? '#ef4444'
        : task.priority === 'medium'
          ? '#f59e0b'
          : '#3b82f6',
    borderColor: 'transparent',
    textColor: '#ffffff',
    extendedProps: {
      description: task.description,
      priority: task.priority,
      status: task.status,
      project: task.project_name
    }
  }));

  return (
    <>
      {/* 3D Background */}
      <ThreeDBackground intensity={0.7} />

      <div className="min-h-screen pt-20 pb-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Stats */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <HiOutlineSparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Interactive Calendar
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Drag, drop, and manage your tasks in 3D space
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.today}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcoming}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-red-500 dark:text-red-400">Overdue</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-green-500 dark:text-green-400">Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Calendar Header */}
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={() => {
              const calendarApi = calendarRef.current?.getApi();
              calendarApi?.prev();
              setCurrentDate(calendarApi?.getDate() || new Date());
            }}
            onNextMonth={() => {
              const calendarApi = calendarRef.current?.getApi();
              calendarApi?.next();
              setCurrentDate(calendarApi?.getDate() || new Date());
            }}
            onToday={() => {
              const calendarApi = calendarRef.current?.getApi();
              calendarApi?.today();
              setCurrentDate(calendarApi?.getDate() || new Date());
            }}
            onViewChange={(view) => {
              const calendarApi = calendarRef.current?.getApi();
              calendarApi?.changeView(view);
              setCurrentView(view);
            }}
            currentView={currentView}
            onRefresh={fetchTasks}
          />

          {/* Calendar Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700"
          >
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ) : (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={false}
                initialView={currentView}
                initialDate={currentDate}
                events={calendarEvents}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                eventResize={handleEventDrop}
                height="auto"
                contentHeight="auto"
                aspectRatio={1.8}
                firstDay={1}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                allDayText="All Day"
                moreLinkText="more"
                noEventsText="No tasks scheduled"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                dayHeaderFormat={{
                  weekday: 'short',
                  month: 'numeric',
                  day: 'numeric',
                  omitCommas: true
                }}
                buttonText={{
                  today: 'Today',
                  month: 'Month',
                  week: 'Week',
                  day: 'Day'
                }}
                views={{
                  dayGridMonth: {
                    titleFormat: { year: 'numeric', month: 'long' }
                  },
                  timeGridWeek: {
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                  },
                  timeGridDay: {
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                  }
                }}
                eventClassNames={(arg) => {
                  const classes = ['rounded-lg', 'border-none', 'shadow-md', 'cursor-pointer'];
                  if (arg.event.extendedProps.status === 'completed') {
                    classes.push('opacity-50');
                  }
                  return classes;
                }}
                loading={(isLoading) => {
                  // Handle loading state
                }}
              />
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <button
              onClick={() => setIsFormOpen(true)}
              className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                  <HiOutlineDocumentText className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">New Task</span>
              </div>
            </button>

            <button className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg group-hover:scale-110 transition-transform">
                  <HiOutlineChartBar className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Analytics</span>
              </div>
            </button>

            <button className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg group-hover:scale-110 transition-transform">
                  <HiOutlineUsers className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Team</span>
              </div>
            </button>

            <button className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                  <HiOutlineSparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Insights</span>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Modals */}
        <TaskPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onEdit={handleTaskEdit}
          onDelete={handleTaskDelete}
          onComplete={handleTaskComplete}
        />

        <TaskForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedTask(null);
          }}
          onSubmit={handleFormSubmit}
          task={selectedTask}
          projects={[]} // Add projects here
        />
      </div>
    </>
  );
};

export default Calendar;