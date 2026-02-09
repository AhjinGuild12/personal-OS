
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddTask(newTitle);
      setNewTitle('');
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="p-4 border-b-4 border-black flex gap-4 bg-[#fdf6e3]">
        <div className="flex-1 neo-border bg-white px-4 py-2 flex items-center shadow-neo-sm">
           <input 
            type="text" 
            placeholder="Type to add a new task ..." 
            className="w-full outline-none font-bold"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="px-6 py-2 neo-border bg-black text-white font-bold shadow-neo-sm neo-transition"
        >
          Set date
        </button>
      </form>

      {tasks.length === 0 ? (
        <div className="p-12 text-center font-bold text-gray-500">No tasks found. Relax!</div>
      ) : (
        <div className="divide-y-2 divide-dotted divide-black">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${task.completed ? 'opacity-70' : ''}`}
            >
              <button 
                onClick={() => onToggleTask(task.id)}
                className={`w-6 h-6 neo-border flex items-center justify-center neo-transition ${task.completed ? 'bg-[#81b29a]' : 'bg-white'}`}
              >
                {task.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <span className={`flex-1 font-bold text-lg ${task.completed ? 'line-through decoration-black decoration-2' : ''}`}>
                {task.title}
              </span>
              
              <div className="px-4 py-1 neo-border bg-white shadow-neo-sm text-sm font-bold">
                {task.dueDate}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
