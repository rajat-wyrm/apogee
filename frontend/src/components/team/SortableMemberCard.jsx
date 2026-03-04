/**
 * Sortable Member Card
 * Makes TeamMemberCard draggable
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HiOutlineMenu } from 'react-icons/hi';

const SortableMemberCard = ({ member, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: member.id,
    data: {
      type: 'member',
      member,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'default',
    transformOrigin: '0 0',
    scale: isDragging ? 1.05 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group transition-all duration-200 ${
        isDragging ? 'z-50 shadow-2xl' : ''
      }`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <HiOutlineMenu className="w-5 h-5" />
      </button>
      
      {children}
    </div>
  );
};

export default SortableMemberCard;