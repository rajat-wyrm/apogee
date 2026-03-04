/**
 * Team Member Card Component
 * Beautiful card displaying team member info
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Avatar from 'react-avatar';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineStar,
  HiOutlineCog,
  HiOutlineDotsVertical
} from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const TeamMemberCard = ({ member, onAssign, onMessage, onViewProfile }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
      offline: 'bg-gray-400'
    };
    return colors[status] || colors.offline;
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      manager: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      member: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return badges[role] || badges.member;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      {/* Header with gradient */}
      <div className="relative h-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <Avatar
              name={member.name}
              size="80"
              round="20px"
              className="border-4 border-white dark:border-gray-800 shadow-lg"
              color="#6366f1"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`} />
          </div>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors backdrop-blur-sm"
        >
          <HiOutlineDotsVertical className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-12 right-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10"
          >
            <div className="py-1">
              <button
                onClick={() => {
                  onViewProfile(member);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  onMessage(member);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Send Message
              </button>
              <button
                onClick={() => {
                  onAssign(member);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Assign Task
              </button>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                Remove from Team
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="pt-14 p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {member.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
            {member.role}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <HiOutlineMail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{member.email}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <HiOutlinePhone className="w-4 h-4 flex-shrink-0" />
            <span>{member.phone || 'No phone'}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.tasksCompleted}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tasks</p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.projects}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.rating}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
          </div>
        </div>

        {/* Skills/Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {member.skills?.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Last Active */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <HiOutlineClock className="w-3 h-3" />
            <span>Active {formatDistanceToNow(new Date(member.lastActive), { addSuffix: true })}</span>
          </div>
          <button
            onClick={() => onMessage(member)}
            className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <HiOutlineUserGroup className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;