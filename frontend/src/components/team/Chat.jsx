/**
 * Chat Component
 * Real-time team messaging with beautiful UI
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from 'react-avatar';
import {
  HiOutlinePaperAirplane,
  HiOutlineEmojiHappy,
  HiOutlinePhotograph,
  HiOutlineMicrophone,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineUser
} from 'react-icons/hi';
import { format } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';

const Chat = ({ currentUser, team, onSendMessage, messages = [] }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState('general');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const chatRooms = [
    { id: 'general', name: 'General', icon: '💬', unread: 3 },
    { id: 'announcements', name: 'Announcements', icon: '📢', unread: 0 },
    { id: 'tasks', name: 'Tasks', icon: '✅', unread: 5 },
    { id: 'random', name: 'Random', icon: '🎲', unread: 1 },
    { id: 'team-' + team?.id, name: team?.name || 'Team Chat', icon: '👥', unread: 2 }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    onSendMessage({
      id: Date.now(),
      text: inputMessage,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date(),
      room: selectedChat
    });
    
    setInputMessage('');
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getMessageStatus = (message) => {
    if (message.read) {
      return <HiOutlineCheckCircle className="w-3 h-3 text-blue-500" />;
    } else if (message.delivered) {
      return <HiOutlineCheckCircle className="w-3 h-3 text-gray-400" />;
    } else {
      return <HiOutlineClock className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="flex h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Chat Rooms Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Chat Rooms</h3>
          <div className="space-y-1">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedChat(room.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedChat === room.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{room.icon}</span>
                  <span className="text-sm font-medium">{room.name}</span>
                </div>
                {room.unread > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    selectedChat === room.id
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {room.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Team Members */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Team Members</h3>
            <div className="space-y-2">
              {team?.members?.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                  <div className="relative">
                    <Avatar
                      name={member.name}
                      size="32"
                      round="8px"
                      className="border-2 border-white dark:border-gray-800"
                      color="#6366f1"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 ${
                      member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    } rounded-full border-2 border-white dark:border-gray-800`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {chatRooms.find(r => r.id === selectedChat)?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {team?.members?.length} members online
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <HiOutlineUser className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages
              .filter(m => m.room === selectedChat)
              .map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start space-x-3 ${
                    message.userId === currentUser.id ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar
                    name={message.userName}
                    size="36"
                    round="10px"
                    className="flex-shrink-0"
                    color="#6366f1"
                  />
                  <div className={`flex flex-col max-w-[70%] ${
                    message.userId === currentUser.id ? 'items-end' : 'items-start'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {message.userName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </span>
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.userId === currentUser.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {getMessageStatus(message)}
                      <span>{message.read ? 'Read' : message.delivered ? 'Delivered' : 'Sent'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">Someone is typing...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 dark:text-white"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              
              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full mb-2"
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiOutlineEmojiHappy className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleFileUpload}
                className="p-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiOutlinePhotograph className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiOutlinePaperAirplane className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;