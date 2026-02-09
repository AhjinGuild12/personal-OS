
import React, { useState } from 'react';
import { Task, Project } from '../types';
import TaskList from './TaskList';

interface DashboardProps {
  activeProject: Project;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeProject, tasks, onToggleTask, onAddTask }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Done'>('All');

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'Pending') return !t.completed;
    if (activeFilter === 'Done') return t.completed;
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Event Card */}
      <div className="lg:col-span-12 flex flex-col md:flex-row gap-4 items-center p-6 bg-white neo-border shadow-neo">
        <div className="w-16 h-16 neo-border bg-[#f2cc8f] flex items-center justify-center shadow-neo">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-heading font-black">Upcoming Events</h2>
          <p className="text-gray-500 font-bold">Don't miss important events this week</p>
        </div>
        <div className="md:ml-auto">
          <button className="px-6 py-2 neo-border bg-black text-white font-bold shadow-neo neo-transition">View All</button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="lg:col-span-8 p-8 bg-white neo-border shadow-neo">
        <h3 className="text-3xl font-heading font-black mb-6">{activeProject.name}</h3>
        <div className="mb-8">
          <div className="flex justify-between font-bold mb-2">
            <span>Progress</span>
            <span>{activeProject.progress}%</span>
          </div>
          <div className="h-4 w-full bg-[#fdf6e3] neo-border">
            <div 
              className="h-full bg-[#f2cc8f] border-r-2 border-black" 
              style={{ width: `${activeProject.progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="px-4 py-2 neo-border bg-white font-bold shadow-neo">
            {activeProject.date}
          </div>
          <div className="flex -space-x-2">
            {activeProject.team.map((avatar, i) => (
              <img key={i} src={avatar} alt="Team" className="w-10 h-10 rounded-full neo-border" />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Info */}
      <div className="lg:col-span-4 p-6 bg-[#f2cc8f] neo-border shadow-neo">
        <h3 className="text-xl font-heading font-black mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="p-4 bg-white neo-border shadow-neo flex justify-between items-center">
            <span className="font-bold">Tasks Done</span>
            <span className="text-2xl font-black">{tasks.filter(t => t.completed).length}</span>
          </div>
          <div className="p-4 bg-white neo-border shadow-neo flex justify-between items-center">
            <span className="font-bold">Efficiency</span>
            <span className="text-2xl font-black">88%</span>
          </div>
          <button className="w-full py-3 neo-border bg-white font-bold shadow-neo neo-transition">See Insights</button>
        </div>
      </div>

      {/* Task Section */}
      <div className="lg:col-span-12">
        <div className="flex gap-4 mb-6">
          {(['All', 'Pending', 'Done'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-3 neo-border font-heading font-bold shadow-neo neo-transition ${
                activeFilter === filter ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {filter === 'All' ? 'All Tasks' : filter}
            </button>
          ))}
        </div>

        <div className="bg-white neo-border shadow-neo">
          <TaskList 
            tasks={filteredTasks} 
            onToggleTask={onToggleTask} 
            onAddTask={onAddTask} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
