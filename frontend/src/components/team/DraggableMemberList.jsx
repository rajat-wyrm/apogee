/**
 * Draggable Member List
 * Uses @dnd-kit for smooth drag-and-drop
 */

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';

const DraggableMemberList = ({ 
  members, 
  onReorder, 
  children,
  handleDragStart,
  handleDragEnd,
  activeId 
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndInternal = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = members.findIndex((m) => m.id === active.id);
      const newIndex = members.findIndex((m) => m.id === over?.id);
      const newOrder = arrayMove(members, oldIndex, newIndex);
      onReorder?.(newOrder);
    }
    handleDragEnd?.();
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndInternal}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={members.map(m => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {children}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeId ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-500 opacity-90 p-4">
            <p className="text-sm font-medium">Dragging...</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DraggableMemberList;