import React from 'react';
import { AppId } from '../../types';
import { playClick } from '../../utils/sounds';

interface MyAppsAppProps {
  onOpenApp: (appId: AppId) => void;
}

const MINI_APPS = [
  {
    id: AppId.CALCULATOR,
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    iconBg: '#e07a5f',
    title: 'Calculator',
    description: 'Basic arithmetic calculator',
  },
  // Future apps can be added here
];

const MyAppsApp: React.FC<MyAppsAppProps> = ({ onOpenApp }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#f2cc8f] border-b-[3px] border-black p-4">
        <h1 className="font-heading font-black text-2xl">MY APPS</h1>
        <p className="text-sm font-bold mt-1 opacity-70">Utility applications</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {MINI_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                playClick();
                onOpenApp(app.id);
              }}
              className="group p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                         hover:bg-[#fdf6e3] active:translate-x-[3px] active:translate-y-[3px]
                         active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-75"
            >
              <div className="flex flex-col items-center gap-4">
                {/* App Icon */}
                <div
                  className="w-16 h-16 border-[3px] border-black flex items-center justify-center
                             shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: app.iconBg }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={app.icon} />
                  </svg>
                </div>

                {/* App Info */}
                <div className="text-center">
                  <h3 className="font-heading font-black text-lg">{app.title}</h3>
                  <p className="text-sm font-bold text-gray-600 mt-1">{app.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAppsApp;
