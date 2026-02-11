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
  {
    id: AppId.TODOS,
    icon: 'M5 13l4 4L19 7',
    iconBg: '#e07a5f',
    title: 'To-dos',
    description: 'Simple task list',
  },
  {
    id: AppId.CURRENCY_CONVERTER,
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: '#f2cc8f',
    title: 'Currency Converter',
    description: 'Multi-currency conversion',
  },
  {
    id: AppId.WORLD_CLOCK,
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: '#81b29a',
    title: 'World Clock',
    description: 'Multi-timezone display',
  },
  {
    id: AppId.WEATHER,
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    iconBg: '#7eb8d0',
    title: 'Weather',
    description: 'City weather overview',
  },
  {
    id: AppId.CAMERA,
    icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
    iconBg: '#fdf6e3',
    title: 'Life in Polaroid',
    description: 'Camera & photos',
  },
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
