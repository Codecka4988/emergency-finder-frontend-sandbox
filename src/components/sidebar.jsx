import React, { useState, useEffect, useRef } from 'react';

function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [width, setWidth] = useState(400); 
  const isResizing = useRef(false);

  // Fully restored hospital data array
  const mockHospitals = [
    { id: 1, name: 'City Emergency Hospital', distance: '1.2 km', type: 'General', beds: 14 },
    { id: 2, name: 'Apex Trauma Center', distance: '2.8 km', type: 'Trauma Care', beds: 3 },
    { id: 3, name: 'Metro Childrens Hospital', distance: '4.1 km', type: 'Pediatric', beds: 8 },
    { id: 4, name: 'Gorakhpur Medical Faculty', distance: '5.5 km', type: 'Multi-Specialty', beds: 22 },
    { id: 5, name: 'LifeLine Critical Care', distance: '6.3 km', type: 'Trauma Care', beds: 2 },
    { id: 6, name: 'St. Marys Emergency Unit', distance: '7.9 km', type: 'General', beds: 11 },
  ];

  const startResizing = (e) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newWidth = Math.max(280, Math.min(e.clientX, 600));
    setWidth(newWidth);
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-5 left-4 z-[1001] p-3 rounded-xl shadow-xl border transition-all duration-300 font-bold bg-blue-600 border-blue-500 text-white hover:bg-blue-700 cursor-pointer"
        style={{ transform: isOpen ? `translateX(${width}px)` : 'translateX(0px)' }}
      >
        {isOpen ? '◀ Hide' : '▶ Show Console'}
      </button>

      <div 
        className={`absolute top-0 left-0 h-full z-[1000] flex flex-col shadow-2xl transform backdrop-blur-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDarkMode 
            ? 'bg-slate-950/90 border-slate-800 text-slate-100' 
            : 'bg-white/90 border-slate-200 text-slate-900'
        }`}
        style={{ width: `${width}px`, transition: isResizing.current ? 'none' : 'transform 0.5s ease-in-out' }}
      >
        <div className={`p-6 border-b flex flex-col ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              <span>🏥</span> Smart Finder
            </h1>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`text-xs font-bold px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30' 
                  : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
              }`}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Locating optimal trauma channels in real-time
          </p>
          
          <div className="relative mt-5">
            <input
              type="text"
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-4 pr-10 py-2.5 rounded-xl text-sm transition-all shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' 
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
            <span className="absolute right-3 top-3 text-slate-400 text-sm">🔍</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          <h2 className={`text-xs font-bold uppercase tracking-wider px-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Nearest Facilities ({mockHospitals.length})
          </h2>

          {mockHospitals.map((hospital) => (
            <div 
              key={hospital.id}
              className={`p-5 rounded-2xl border shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 transform ${
                isDarkMode 
                  ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 shadow-black/20' 
                  : 'bg-white border-slate-100 hover:bg-slate-50/80 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <h3 className={`font-bold text-sm leading-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {hospital.name}
                </h3>
                <span className="text-xs font-extrabold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-lg whitespace-nowrap">
                  {hospital.distance}
                </span>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  {hospital.type}
                </span>
                <span className={`font-bold text-xs px-2.5 py-0.5 rounded-md ${
                  hospital.beds < 5 
                    ? 'text-rose-400 bg-rose-500/10' 
                    : 'text-emerald-400 bg-emerald-500/10'
                }`}>
                  🛏️ {hospital.beds} ICU beds left
                </span>
              </div>
            </div>
          ))}
        </div>

        <div 
          onMouseDown={startResizing}
          className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-transparent hover:bg-blue-500/40 transition-colors"
        />
      </div>
    </>
  );
}

export default Sidebar;