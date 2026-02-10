
import React from 'react';
import { Sigma, Database, Radar, Target, FileCheck, LineChart } from 'lucide-react';

const NavTab: React.FC<{ label: string }> = ({ label }) => (
  <div className="relative group cursor-pointer h-8">
    <div className="px-8 h-full bg-blue-900/20 border border-blue-500/40 -skew-x-[30deg] transition-all hover:bg-blue-400/20 hover:border-blue-400 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] flex items-center justify-center">
      <span className="block skew-x-[30deg] text-[13px] font-bold text-white tracking-[0.1em] whitespace-nowrap">
        {label}
      </span>
    </div>
  </div>
);

const StatusCircle: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  status: string; 
  statusColor?: string 
}> = ({ icon, label, status, statusColor = 'text-white' }) => (
  <div className="flex items-center gap-3 group cursor-default">
    {/* Double Ring Circle */}
    <div className="relative w-14 h-14 flex items-center justify-center">
      {/* Outer faint ring */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/10" />
      {/* Inner glowing ring */}
      <div className="absolute inset-1.5 rounded-full border-2 border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]" />
      
      {/* Orange Indicator Dot - High Fidelity placement */}
      <div className="absolute top-[2px] right-[2px] w-2.5 h-2.5 bg-[#ff8a00] rounded-full shadow-[0_0_8px_#ff8a00] z-10" />
      
      {/* Icon */}
      <div className="text-cyan-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>
    
    {/* Labels */}
    <div className="flex flex-col justify-center">
      <span className="text-sm text-white/90 font-bold tracking-wider mb-0.5">{label}</span>
      <span className={`text-lg font-black tracking-tighter leading-none ${statusColor}`}>
        {status}
      </span>
    </div>
  </div>
);

const Header: React.FC = () => {
  const leftLinks = ['风险态势', '资产态势', '攻击态势'];
  const rightLinks = ['运行态势', '脆弱性态势', '情报态势'];

  return (
    <div className="relative w-full z-50 select-none font-cyber pt-2 bg-[#000814]">
      {/* Top Blue Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-600/30 via-transparent to-transparent pointer-events-none" />

      {/* Main Title and Nav Row */}
      <div className="relative w-full flex items-center justify-center px-10 h-12">
        {/* Left Nav */}
        <div className="flex-1 flex justify-end gap-3 mr-12">
          {leftLinks.map(link => <NavTab key={link} label={link} />)}
        </div>

        {/* Center Title */}
        <div className="relative px-4">
          <h1 className="text-4xl font-black text-white tracking-[0.1em] italic text-glow-title">
            态势中心
          </h1>
        </div>

        {/* Right Nav */}
        <div className="flex-1 flex justify-start gap-3 ml-12">
          {rightLinks.map(link => <NavTab key={link} label={link} />)}
        </div>
      </div>

      {/* Decorative Line System with "Situation Overview" Badge */}
      <div className="relative w-full flex flex-col items-center mt-2">
        {/* The horizontal glow lines */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] flex items-center pointer-events-none">
           <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-cyan-400 relative mx-4">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#00f2ff]" />
           </div>
           <div className="w-[300px]" /> {/* Spacer for the badge */}
           <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-cyan-400/50 to-cyan-400 relative mx-4">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#00f2ff]" />
           </div>
        </div>

        {/* The Badge Area */}
        <div className="flex items-center gap-6 relative z-10">
          <div className="text-blue-500/40 text-xs italic font-black">////////</div>
          
          <div className="relative group">
            {/* Hexagon-like clipped container */}
            <div className="px-10 py-1 bg-[#001428] border border-orange-500/60 shadow-[0_0_15px_rgba(255,138,0,0.2)] clip-badge relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
               <span className="relative z-10 text-[11px] font-bold text-orange-400 tracking-[0.5em] uppercase">
                 态势总览
               </span>
            </div>
            {/* Side Decorative Borders */}
            <div className="absolute -left-1 top-0 h-full w-[2px] bg-orange-500/40 -skew-x-[25deg]" />
            <div className="absolute -right-1 top-0 h-full w-[2px] bg-orange-500/40 -skew-x-[25deg]" />
          </div>

          <div className="text-blue-500/40 text-xs italic font-black">\\\\\\\\</div>
        </div>
      </div>

      {/* Expanded Status Row */}
      <div className="w-full flex justify-between px-20 py-6 mt-2">
        <StatusCircle 
          icon={<Sigma size={24} />} 
          label="全网总览" 
          status="51分" 
          statusColor="text-white"
        />
        <StatusCircle 
          icon={<Database size={24} />} 
          label="资产态势" 
          status="优秀" 
          statusColor="text-[#00ff9d]"
        />
        <StatusCircle 
          icon={<Radar size={24} />} 
          label="运行态势" 
          status="待改进" 
          statusColor="text-[#ffb700]"
        />
        <StatusCircle 
          icon={<Target size={24} />} 
          label="攻击态势" 
          status="无攻击" 
          statusColor="text-[#00ff9d]"
        />
        <StatusCircle 
          icon={<FileCheck size={24} />} 
          label="脆弱性态势" 
          status="待改进" 
          statusColor="text-[#ffb700]"
        />
        <StatusCircle 
          icon={<LineChart size={24} />} 
          label="运营态势" 
          status="待改进" 
          statusColor="text-[#ffb700]"
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-glow-title {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 
                       0 0 20px rgba(34, 211, 238, 0.3);
          font-family: 'Orbitron', sans-serif;
        }
        .clip-badge {
          clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);
        }
      `}} />
    </div>
  );
};

export default Header;
