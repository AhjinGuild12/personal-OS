
import React from 'react';
import { Task } from '../types';
import TaskList from './TaskList';

interface TaskManagerProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onToggleTask, onAddTask }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#81b29a] neo-border shadow-neo">
          <h4 className="font-heading font-black text-4xl mb-2">{tasks.length}</h4>
          <p className="font-bold uppercase tracking-widest text-xs">Total Tasks</p>
        </div>
        <div className="p-6 bg-[#f2cc8f] neo-border shadow-neo">
          <h4 className="font-heading font-black text-4xl mb-2">{tasks.filter(t => !t.completed).length}</h4>
          <p className="font-bold uppercase tracking-widest text-xs">Pending</p>
        </div>
        <div className="p-6 bg-white neo-border shadow-neo">
          <h4 className="font-heading font-black text-4xl mb-2">{tasks.filter(t => t.completed).length}</h4>
          <p className="font-bold uppercase tracking-widest text-xs">Completed</p>
        </div>
      </div>

      <div className="bg-white neo-border shadow-neo">
        <div className="p-6 bg-black text-white flex justify-between items-center">
          <h2 className="text-2xl font-heading font-black">All Tasks</h2>
          <span className="bg-white text-black px-3 py-1 neo-border font-bold">Priority List</span>
        </div>
        <TaskList tasks={tasks} onToggleTask={onToggleTask} onAddTask={onAddTask} />
      </div>
    </div>
  );
};

export default TaskManager;
