
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Globe3D from './components/Globe3D';
import { TrendChart, SectionTitle, StatBox, StatusRow, VulnerabilitySection, PredictionBarChart, AssetRankList, SecurityZoneList } from './components/StatPanel';

const BottomTickerItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="relative flex flex-col items-center group cursor-default">
    {/* Label with background decoration */}
    <div className="relative mb-2 px-6 py-0.5">
       {/* Background dotted box effect */}
       <div className="absolute inset-0 bg-blue-900/20 border-x border-cyan-500/20 opacity-40" />
       <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-full h-[1px] bg-cyan-500/10" />
       </div>
       <span className="relative z-10 text-xs font-black italic text-yellow-400 tracking-widest uppercase">
         {label}
       </span>
    </div>

    {/* Large Value */}
    <div className="text-3xl font-black text-white tracking-tight z-10 font-cyber mb-1 group-hover:text-cyan-400 transition-colors">
      {value}
    </div>

    {/* Isometric Base */}
    <div className="relative w-24 h-6 flex items-center justify-center mt-[-5px]">
       {/* Outer Ring */}
       <div className="absolute w-20 h-4 border border-cyan-500/40 rounded-[100%] scale-y-[0.3]" />
       {/* Middle Glow Ring */}
       <div className="absolute w-16 h-3 border border-cyan-400/60 rounded-[100%] scale-y-[0.3] shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
       {/* Inner Core */}
       <div className="absolute w-10 h-2 bg-cyan-500/30 rounded-[100%] scale-y-[0.3] blur-[1px]" />
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#000814] text-cyan-50 selection:bg-cyan-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 h-full flex flex-col">
        <Header />

        <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden px-8 pb-4 mt-2">
          {/* Left Panel */}
          <div className="col-span-3 flex flex-col space-y-6 overflow-y-auto pr-4 custom-scroll">
            <div className="flex flex-col">
              <SectionTitle title="告警处理(24H)" />
              <div className="flex gap-4 mb-8">
                <StatBox label="告警量" value="0.99M" />
                <StatBox label="告警工单" value="0" />
                <StatBox label="告警处理率" value="0.0%" color="text-cyan-400" />
              </div>
              <div className="flex flex-col gap-2">
                <StatusRow label="待处置" iconCount={8} value="0.99M" />
                <StatusRow label="处置中" iconCount={1} value="6" />
                <StatusRow label="已处置" iconCount={1} value="0" />
                <StatusRow label="误报" iconCount={1} value="0" />
              </div>
            </div>

            <div className="flex flex-col">
              <SectionTitle 
                title="攻击日志/告警趋势" 
                extra={
                  <>
                    <span className="text-orange-400 border-b-2 border-orange-400 px-1 cursor-pointer">日</span>
                    <span className="cursor-pointer hover:text-white transition-colors">周</span>
                    <span className="cursor-pointer hover:text-white transition-colors">月</span>
                  </>
                } 
              />
              <TrendChart />
            </div>

            <div className="flex flex-col">
              <SectionTitle title="脆弱性统计" />
              <VulnerabilitySection />
            </div>
          </div>

          {/* Center Panel (3D Globe) */}
          <div className="col-span-6 flex flex-col items-center justify-center relative">
             <div className="w-full h-full relative">
               <Globe3D />
             </div>

             {/* Bottom Status Tickers - High Fidelity Rebuild */}
             <div className="absolute bottom-10 left-0 w-full px-10">
                {/* Connecting Dotted Line */}
                <div className="absolute bottom-[10px] left-0 w-full h-[1px] border-b border-dashed border-cyan-500/30 opacity-60 z-0" />
                
                <div className="relative z-10 flex justify-between">
                  <BottomTickerItem label="侦察" value="96.44M" />
                  <BottomTickerItem label="渗透" value="89.55M" />
                  <BottomTickerItem label="攻击" value="13.78M" />
                  <BottomTickerItem label="控制" value="48.22M" />
                  <BottomTickerItem label="破坏" value="48.74M" />
                </div>
             </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-3 flex flex-col space-y-6 overflow-y-auto pl-4 custom-scroll">
            <div className="flex flex-col">
              <SectionTitle title="攻击日志预测(24H)" />
              <PredictionBarChart />
            </div>
            <div className="flex flex-col">
              <SectionTitle title="受攻击资产TOP5(24H)" />
              <AssetRankList />
            </div>
            <div className="flex flex-col">
              <SectionTitle title="受攻击安全域TOP5(24H)" />
              <SecurityZoneList />
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <footer className="flex justify-between items-center px-8 py-2 text-[9px] text-cyan-400/20 uppercase tracking-[0.2em] border-t border-cyan-500/5 bg-black/40">
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-green-500 rounded-full" /> SECURITY STATUS: NOMINAL</span>
            <span>OS VERSION: KERNEL-7.4.2</span>
          </div>
          <div className="font-mono">ENCRYPTION: AES-256-GCM [ACTIVE]</div>
          <div className="flex gap-6">
            <span>TIMESTAMP: {currentTime}</span>
            <span className="text-cyan-400/40">© 2025 CYBER-SENTINEL SYSTEMS</span>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .grid-pattern {
          background-image: linear-gradient(rgba(0, 242, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 242, 255, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.1);
        }
      `}} />
    </div>
  );
};

export default App;
