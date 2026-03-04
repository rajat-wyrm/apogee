/**
 * Avatar Upload Component
 * Beautiful drag-and-drop avatar upload with preview
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCamera, HiOutlineX, HiOutlineCheckCircle, HiOutlineCloudUpload } from 'react-icons/hi';
import { useDropzone } from 'react-dropzone';

const AvatarUpload = ({ currentAvatar, onUpload, onRemove }) => {
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        setUploadStatus('uploading');
        
        // Simulate upload progress (replace with actual upload)
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setUploadStatus('success');
            onUpload(file);
          }
        }, 200);
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleRemove = () => {
    setPreview(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    onRemove();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {/* Avatar Container */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`relative w-32 h-32 rounded-2xl overflow-hidden cursor-pointer ${
            isDragActive ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-white dark:ring-offset-gray-800' : ''
          }`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          
          {/* Avatar Image */}
          <img
            src={preview || currentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent('User')}&background=6366f1&color=fff&size=128`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <HiOutlineCamera className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>

        {/* Upload Progress */}
        <AnimatePresence>
          {uploadStatus === 'uploading' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-lg flex items-center space-x-2"
            >
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{uploadProgress}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Badge */}
        <AnimatePresence>
          {uploadStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
            >
              <HiOutlineCheckCircle className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Hint */}
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        PNG, JPG, GIF up to 5MB
      </p>

      {/* Remove Button */}
      {(preview || currentAvatar) && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRemove}
          className="mt-4 flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          <HiOutlineX className="w-4 h-4" />
          <span>Remove photo</span>
        </motion.button>
      )}
    </div>
  );
};

export default AvatarUpload;