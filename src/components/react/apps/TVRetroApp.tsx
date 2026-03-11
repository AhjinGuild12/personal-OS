import React, { useState, useEffect, useRef } from 'react';
import { FOLDER_IDS, getChildren } from '../../../data/fileSystem';
import { playClick } from '../../../utils/sounds';

interface TVRetroAppProps {
    initialVideoId?: string;
}

const TVRetroApp: React.FC<TVRetroAppProps> = ({ initialVideoId }) => {
    // Get all videos from My Videos folder for the playlist
    const allVideos = getChildren(FOLDER_IDS.MY_VIDEOS).filter(
        (f) => f.type === 'video' && f.videoId
    );

    const [currentVideoIndex, setCurrentVideoIndex] = useState(() => {
        if (!initialVideoId) return 0;
        const idx = allVideos.findIndex((v) => v.videoId === initialVideoId);
        return idx === -1 ? 0 : idx;
    });

    const [isPoweredOn, setIsPoweredOn] = useState(true);
    const [volume, setVolume] = useState(50);
    const [knobRotation, setKnobRotation] = useState(0);

    const currentVideo = allVideos[currentVideoIndex];

    const handleChannelChange = (direction: 'next' | 'prev') => {
        playClick();
        setKnobRotation((prev) => prev + (direction === 'next' ? 30 : -30));

        // Brief static effect could be added here if we had a way to trigger it easily
        // For now, just switch the video
        setCurrentVideoIndex((prev) => {
            if (direction === 'next') {
                return (prev + 1) % allVideos.length;
            } else {
                return (prev - 1 + allVideos.length) % allVideos.length;
            }
        });
    };

    const handlePowerToggle = () => {
        playClick();
        setIsPoweredOn((prev) => !prev);
    };

    return (
        <div className="h-full w-full flex items-center justify-center bg-[#2a2a2a] p-4 font-mono select-none">
            {/* TV Cabinet */}
            <div
                className="relative w-full max-w-[600px] aspect-[4/3] rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl"
                style={{
                    background: 'linear-gradient(135deg, #5a4637 0%, #3d3024 100%)',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 10px 10px 20px rgba(0,0,0,0.5)',
                    border: '4px solid #2a1f18'
                }}
            >
                {/* Wood grain texture overlay (simulated with CSS patterns if possible, or just gradient) */}

                {/* Main TV Area Grid */}
                <div className="flex-1 flex gap-4 h-full">

                    {/* Screen Section (Left) */}
                    <div className="relative flex-1 bg-black rounded-[40px] overflow-hidden border-[6px] border-[#222] shadow-[inset_0_0_20px_rgba(0,0,0,1)]">

                        {/* Screen Content */}
                        <div className="relative w-full h-full">
                            {isPoweredOn && currentVideo ? (
                                <>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full object-cover pointer-events-none"
                                        style={{ filter: 'contrast(1.2) saturation(1.1) sepia(0.2)' }}
                                    />
                                    {/* Scanlines overlay */}
                                    <div
                                        className="absolute inset-0 pointer-events-none z-10"
                                        style={{
                                            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                                            backgroundSize: '100% 4px, 6px 100%',
                                            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5)'
                                        }}
                                    />
                                    {/* Screen curve reflection/glare */}
                                    <div
                                        className="absolute inset-0 pointer-events-none z-20"
                                        style={{
                                            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
                                            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                                        }}
                                    />
                                </>
                            ) : (
                                /* Static Noise (Off State) */
                                <div className="w-full h-full bg-[#111] flex items-center justify-center overflow-hidden relative">
                                    {/* CSS Static Effect */}
                                    <div
                                        className="absolute inset-0 opacity-20"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                        }}
                                    />
                                    <div className="w-2 h-2 bg-white rounded-full opacity-50 animate-ping"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Control Panel Section (Right) */}
                    <div className="w-24 flex flex-col items-center justify-center gap-8 py-8 bg-[#2a1f18]/30 rounded-r-xl border-l border-[#3a2f28]/50">

                        {/* Channel Knobs */}
                        <div className="flex flex-col gap-2 items-center">
                            <span className="text-[10px] text-[#a89f91] uppercase tracking-widest font-bold">CH</span>
                            <div
                                className="w-16 h-16 rounded-full bg-[#e0e0e0] border-b-4 border-r-4 border-[#999] shadow-lg flex items-center justify-center cursor-pointer active:scale-95 transition-transform relative"
                                onClick={() => handleChannelChange('next')}
                                style={{ transform: `rotate(${knobRotation}deg)` }}
                            >
                                <div className="w-12 h-12 rounded-full border-2 border-[#ccc] bg-[#f0f0f0] flex items-center justify-center">
                                    <div className="w-8 h-1 bg-[#333] rounded-full transform rotate-90"></div>
                                </div>
                            </div>
                        </div>

                        {/* Volume Knob (Visual mostly) */}
                        <div className="flex flex-col gap-2 items-center">
                            <span className="text-[10px] text-[#a89f91] uppercase tracking-widest font-bold">VOL</span>
                            <div className="w-12 h-12 rounded-full bg-[#333] border-b-2 border-r-2 border-black shadow-lg flex items-center justify-center">
                                <div className="w-1 h-6 bg-white rounded-full transform rotate-45"></div>
                            </div>
                        </div>

                        {/* Power Button */}
                        <div className="mt-auto flex flex-col gap-2 items-center">
                            <div
                                className={`w-8 h-8 rounded-full border-2 cursor-pointer shadow-md transition-all ${isPoweredOn ? 'bg-red-500 border-red-700 shadow-[0_0_10px_rgba(255,0,0,0.6)]' : 'bg-[#333] border-black'}`}
                                onClick={handlePowerToggle}
                            ></div>
                            <span className="text-[10px] text-[#a89f91] uppercase tracking-widest font-bold">PWR</span>
                        </div>

                    </div>

                </div>

                {/* Brand / Label */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-[#a89f91] font-bold text-xs tracking-[0.2em] opacity-80">
                    NEO-VISION 2000
                </div>

            </div>
        </div>
    );
};

export default TVRetroApp;
