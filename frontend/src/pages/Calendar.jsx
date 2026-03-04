/**
 * Calendar Page - FIXED
 */

import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { taskAPI } from '../services/api';
import ThreeDBackground from '../components/effects/ThreeDBackground';
import CalendarHeader from '../components/calendar/CalendarHeader';
import TaskPreviewModal from '../components/calendar/TaskPreviewModal';
import toast from 'react-hot-toast';

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAll();
      setTasks(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info) => {
    const task = tasks.find(t => t.id === info.event.id);
    if (task) {
      setSelectedTask(task);
      setIsPreviewOpen(true);
    }
  };

  const calendarEvents = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.due_date,
    allDay: true,
    backgroundColor: task.priority === 'high' ? '#ef4444' : 
                    task.priority === 'medium' ? '#f59e0b' : '#3b82f6',
    borderColor: 'transparent',
    textColor: '#ffffff',
  }));

  return (
    <>
      <ThreeDBackground intensity={0.5} />
      
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            onRefresh={fetchTasks}
          />

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6">
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
                events={calendarEvents}
                eventClick={handleEventClick}
                height="auto"
                firstDay={1}
              />
            )}
          </div>
        </div>
      </div>

      <TaskPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </>
  );
};

export default Calendar;
