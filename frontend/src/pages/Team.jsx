/**
 * Team Page
 * Complete team collaboration hub
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { teamAPI } from '../services/api';
import TeamMemberCard from '../components/team/TeamMemberCard';
import Chat from '../components/team/Chat';
import TeamAnalytics from '../components/team/TeamAnalytics';
import {
  HiOutlineUsers,
  HiOutlineChat,
  HiOutlineChartBar,
  HiOutlineUserAdd,
  HiOutlineCog,
  HiOutlineSearch
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Team = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    id: 'user1',
    name: 'You',
    status: 'online'
  });

  // Sample data - replace with real API data
  useEffect(() => {
    fetchTeamData();
    loadSampleMessages();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      // Replace with actual API calls
      const sampleMembers = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'admin',
          status: 'online',
          tasksCompleted: 45,
          projects: 8,
          rating: 4.9,
          skills: ['React', 'Node.js', 'TypeScript'],
          lastActive: new Date(),
          phone: '+1 234 567 890'
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'manager',
          status: 'away',
          tasksCompleted: 38,
          projects: 6,
          rating: 4.7,
          skills: ['UI/UX', 'Figma', 'Adobe XD'],
          lastActive: new Date(Date.now() - 1000 * 60 * 30),
          phone: '+1 234 567 891'
        },
        {
          id: '3',
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          role: 'member',
          status: 'busy',
          tasksCompleted: 32,
          projects: 5,
          rating: 4.5,
          skills: ['Python', 'Django', 'PostgreSQL'],
          lastActive: new Date(Date.now() - 1000 * 60 * 15),
          phone: '+1 234 567 892'
        },
        {
          id: '4',
          name: 'Diana Prince',
          email: 'diana@example.com',
          role: 'member',
          status: 'online',
          tasksCompleted: 50,
          projects: 9,
          rating: 5.0,
          skills: ['DevOps', 'AWS', 'Docker'],
          lastActive: new Date(),
          phone: '+1 234 567 893'
        }
      ];

      setTeam({
        id: 'team1',
        name: 'Product Development',
        members: sampleMembers
      });
      setMembers(sampleMembers);
    } catch (error) {
      console.error('Failed to fetch team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleMessages = () => {
    setMessages([
      {
        id: '1',
        text: 'Hey team! Great work on the latest release! 🚀',
        userId: '2',
        userName: 'Bob Smith',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        room: 'general',
        delivered: true,
        read: true
      },
      {
        id: '2',
        text: 'Thanks Bob! The design team did an amazing job.',
        userId: '1',
        userName: 'Alice Johnson',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        room: 'general',
        delivered: true,
        read: true
      },
      {
        id: '3',
        text: 'When is the next sprint planning meeting?',
        userId: '3',
        userName: 'Charlie Brown',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        room: 'general',
        delivered: true,
        read: false
      },
      {
        id: '4',
        text: 'I think it\'s scheduled for tomorrow at 10 AM',
        userId: '4',
        userName: 'Diana Prince',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        room: 'general',
        delivered: true,
        read: false
      },
      {
        id: '5',
        text: 'Great! I\'ll prepare the agenda.',
        userId: '1',
        userName: 'Alice Johnson',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        room: 'general',
        delivered: true,
        read: false
      }
    ]);
  };

  const handleSendMessage = (message) => {
    setMessages(prev => [...prev, message]);
    toast.success('Message sent');
  };

  const handleInviteMember = () => {
    toast.success('Invitation sent!');
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'members', name: 'Members', icon: HiOutlineUsers },
    { id: 'chat', name: 'Chat', icon: HiOutlineChat },
    { id: 'analytics', name: 'Analytics', icon: HiOutlineChartBar }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <HiOutlineUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Team Collaboration
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Work together, achieve more
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleInviteMember}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <HiOutlineUserAdd className="w-5 h-5" />
              <span>Invite Member</span>
            </button>
            <button className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <HiOutlineCog className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-lg inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              />
            </div>

            {/* Members Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onAssign={() => toast.success(`Task assigned to ${member.name}`)}
                    onMessage={() => {
                      setActiveTab('chat');
                      toast.success(`Starting chat with ${member.name}`);
                    }}
                    onViewProfile={() => toast.info(`Viewing ${member.name}'s profile`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && team && (
          <Chat
            currentUser={currentUser}
            team={team}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <TeamAnalytics data={team} />
        )}
      </div>
    </div>
  );
};

export default Team;