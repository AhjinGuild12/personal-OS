
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import BrainView from './components/BrainView';
import { AppTab, Task, Project } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Budget and contract', dueDate: '04 Aug 22', completed: true },
    { id: '2', title: 'Website design', dueDate: '18 Aug 22', completed: true },
    { id: '3', title: 'Design new dashboard', dueDate: '19 Aug 2022', completed: true },
    { id: '4', title: 'Design search page', dueDate: '22 Aug 2022', completed: false },
  ]);

  const [activeProject] = useState<Project>({
    id: 'p1',
    name: 'Mobile app design',
    progress: 48,
    date: '04 Oct 2022',
    team: ['https://picsum.photos/seed/p1/32', 'https://picsum.photos/seed/p2/32', 'https://picsum.photos/seed/p3/32']
  });

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      dueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
      completed: false
    };
    setTasks([newTask, ...tasks]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 bg-[#fdf6e3] p-4 md:p-8 lg:p-12 overflow-y-auto">
        <header className="mb-8">
          <p className="text-gray-600 font-bold uppercase tracking-widest text-xs mb-1">Content overview</p>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl md:text-6xl font-heading font-black">Dashboard</h1>
            <div className="w-12 h-12 neo-border rounded-full overflow-hidden shadow-neo">
              <img src="https://picsum.photos/seed/user/100" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {activeTab === AppTab.DASHBOARD && (
          <Dashboard 
            activeProject={activeProject} 
            tasks={tasks} 
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
          />
        )}

        {activeTab === AppTab.TASKS && (
          <TaskManager 
            tasks={tasks} 
            onToggleTask={handleToggleTask} 
            onAddTask={handleAddTask} 
          />
        )}

        {activeTab === AppTab.BRAIN && (
          <BrainView tasks={tasks} />
        )}

        {activeTab === AppTab.CALENDAR && (
          <div className="flex flex-col items-center justify-center h-64 neo-border bg-white shadow-neo p-8">
             <h2 className="text-2xl font-heading font-bold mb-4">Calendar Coming Soon</h2>
             <p className="text-gray-600">Syncing with your temporal field...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
