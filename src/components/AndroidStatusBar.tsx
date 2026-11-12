import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Cpu, Bell, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

interface Props {
  activeAlarmsCount?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  phoneFrameMode: boolean;
  onTogglePhoneFrame: () => void;
}

export const AndroidStatusBar: React.FC<Props> = ({
  activeAlarmsCount = 0,
  soundEnabled,
  onToggleSound,
  phoneFrameMode,
  onTogglePhoneFrame,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/95 border-b border-slate-800/80 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 select-none z-30">
      {/* Left: Time and Plant indicator */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-200 tracking-tight">{timeStr || '12:00'}</span>
        <span className="text-[10px] bg-slate-800/80 text-cyan-400 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          PLANTA ACTIVA
        </span>
        {activeAlarmsCount > 0 && (
          <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded-full flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>{activeAlarmsCount} alerta{activeAlarmsCount > 1 ? 's' : ''}</span>
          </span>
        )}
      </div>

      {/* Right: Quick Android controls & status */}
      <div className="flex items-center gap-2.5">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Sonidos de alarma activados' : 'Sonidos silenciados'}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {/* View mode toggle (Phone frame vs full width) */}
        <button
          onClick={onTogglePhoneFrame}
          title={phoneFrameMode ? 'Cambiar a vista expandida' : 'Simular móvil Android'}
          className={`px-1.5 py-0.5 rounded text-[10px] transition border ${
            phoneFrameMode
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60'
          }`}
        >
          {phoneFrameMode ? 'Modo Móvil' : 'Modo Amplio'}
        </button>

        {/* System icons */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <Wifi className="w-3 h-3 text-slate-300" />
          <span className="text-[9px] font-bold text-slate-300">5G</span>
          <div className="flex items-center gap-0.5">
            <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[9px] font-mono">94%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
