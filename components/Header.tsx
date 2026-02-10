
import React from 'react';
import { Sigma, Database, Radar, Target, FileCheck, LineChart } from 'lucide-react';

const NavTab: React.FC<{ label: string; active?: boolean }> = ({ label, active = false }) => (
  <div className="relative group cursor-pointer h-9">
    {/* Main Skewed Background */}
    <div className={`
      relative px-10 h-full flex items-center justify-center transition-all duration-300
      -skew-x-[25deg] border-t border-b border-blue-500/30
      ${active ? 'bg-blue-600/30 border-blue-400' : 'bg-blue-900/10 border-blue-500/20 hover:bg-blue-400/20 hover:border-blue-400'}
      shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]
    `}>
      {/* Side skewed borders */}
      <div className="absolute left-0 top-0 h-full w-[1px] bg-blue-400/40" />
      <div className="absolute right-0 top-0 h-full w-[1px] bg-blue-400/40" />
      
      {/* Text Content (Un-skewed) */}
      <span className="block skew-x-[25deg] text-[15px] font-black text-white tracking-[0.15em] whitespace-nowrap drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
        {label}
      </span>
    </div>
    
    {/* Bottom Glow Line on Hover */}
    <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-[0_0_8px_#22d3ee]" />
  </div>
);

const StatusCircle: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  status: string; 
  statusColor?: string 
}> = ({ icon, label, status, statusColor = 'text-white' }) => (
  <div className="flex items-center gap-4 group cursor-default">
    {/* Cyber Ring Container */}
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Outer rotating decorative ring */}
      <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/20 animate-[spin_20s_linear_infinite]" />
      
      {/* Main glowing rings */}
      <div className="absolute inset-2 rounded-full border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.15)]" />
      <div className="absolute inset-3 rounded-full border-[1.5px] border-cyan-300/20" />
      
      {/* Indicator light */}
      <div className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316] z-10 animate-pulse" />
      
      <div className="text-cyan-400 group-hover:scale-110 transition-transform duration-300 z-10">
        {icon}
      </div>
    </div>
    
    <div className="flex flex-col justify-center">
      <span className="text-xs text-white/50 font-bold tracking-widest mb-0.5 uppercase">{label}</span>
      <span className={`text-xl font-black tracking-tighter leading-none ${statusColor} drop-shadow-[0_0_8px_currentColor]`}>
        {status}
      </span>
    </div>
  </div>
);

const Header: React.FC = () => {
  return (
    <div className="relative w-full z-50 select-none font-cyber pt-4 bg-gradient-to-b from-blue-900/20 to-transparent">
      {/* 1. Main Navigation Row */}
      <div className="relative w-full flex items-center justify-center px-16 h-14">
        {/* Left Links */}
        <div className="flex-1 flex justify-end gap-4 mr-16">
          <NavTab label="风险态势" />
          <NavTab label="资产态势" />
          <NavTab label="攻击态势" />
        </div>

        {/* Center Title - "态势中心" */}
        <div className="relative px-8">
           <h1 className="text-5xl font-black text-white tracking-[0.2em] italic drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
            态势中心
          </h1>
        </div>

        {/* Right Links */}
        <div className="flex-1 flex justify-start gap-4 ml-16">
          <NavTab label="运行态势" />
          <NavTab label="脆弱性态势" />
          <NavTab label="情报态势" />
        </div>
      </div>

      {/* 2. Complex Sub-Header Divider System */}
      <div className="relative w-full flex items-center justify-center mt-2 px-10">
        {/* Horizontal Line System */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
          {/* Left Line */}
          <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-cyan-400 relative">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-200 shadow-[0_0_15px_#00f2ff]" />
          </div>
          
          {/* Central Gap for Badge and Slashes */}
          <div className="w-[480px]" />
          
          {/* Right Line */}
          <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-cyan-400/40 to-cyan-400 relative">
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-200 shadow-[0_0_15px_#00f2ff]" />
          </div>
        </div>

        {/* Decorative Badge and Slashes */}
        <div className="relative z-10 flex items-center gap-10">
          {/* Left Slashes */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-[3px] h-4 bg-blue-500/40 -skew-x-[30deg]" />
            ))}
          </div>

          {/* Central Badge "态势总览" */}
          <div className="relative">
            {/* Outer Trapezoid Frame */}
            <div className="absolute -inset-x-6 inset-y-0 border-x-2 border-orange-500/50 -skew-x-[25deg]" />
            
            {/* Inner Content Badge */}
            <div className="px-12 py-1.5 bg-blue-950/60 border-t border-b border-orange-500/40 -skew-x-[25deg] shadow-[0_0_20px_rgba(249,115,22,0.15)]">
               <span className="block skew-x-[25deg] text-[13px] font-black text-orange-400 tracking-[0.4em] uppercase text-center">
                 态势总览
               </span>
            </div>
          </div>

          {/* Right Slashes */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-[3px] h-4 bg-blue-500/40 skew-x-[30deg]" />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Status Circle Row */}
      <div className="w-full grid grid-cols-6 px-24 py-4 mt-0">
        <StatusCircle 
          icon={<Sigma size={28} />} 
          label="全网总览" 
          status="51分" 
          statusColor="text-white"
        />
        <StatusCircle 
          icon={<Database size={28} />} 
          label="资产态势" 
          status="优秀" 
          statusColor="text-[#00ff9d]"
        />
        <StatusCircle 
          icon={<Radar size={28} />} 
          label="运行态势" 
          status="待改进" 
          statusColor="text-[#ffb700]"
        />
        <StatusCircle 
          icon={<Target size={28} />} 
          label="攻击态势" 
          status="无攻击" 
          statusColor="text-[#00ff9d]"
        />
        <StatusCircle 
          icon={<FileCheck size={28} />} 
          label="脆弱性态势" 
          status="待改进" 
          statusColor="text-[#ffb700]"
        />
        <StatusCircle 
          icon={<LineChart size={28} />} 
          label="运营态势" 
          status="待改进" 
          statusColor="text-[#ffb700]"
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-glow-title {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 
                       0 0 30px rgba(34, 211, 238, 0.3);
        }
      `}} />
    </div>
  );
};

export default Header;
