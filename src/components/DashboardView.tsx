import React from 'react';
import { ExtrusionLog, ExtrusionMachine } from '../types/extrusion';
import {
  Activity,
  Layers,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Gauge,
  Thermometer,
  Zap,
  Play,
  Pause,
  RotateCw,
} from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  machines: ExtrusionMachine[];
  logs: ExtrusionLog[];
  onOpenNewLog: (machineId?: string) => void;
  onSelectLog: (log: ExtrusionLog) => void;
  onSelectMachine: (machineId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<Props> = ({
  machines,
  logs,
  onOpenNewLog,
  onSelectLog,
  onSelectMachine,
  onNavigateToTab,
}) => {
  const runningMachines = machines.filter((m) => m.status === 'running');
  const purgingMachines = machines.filter((m) => m.status === 'purging');
  const alertLogs = logs.filter((l) => l.alarmTriggered);

  // Today's total produced kg
  const todayKg = logs.slice(0, 10).reduce((acc, l) => acc + (l.producedKg || 0), 0);
  const totalScrap = logs.slice(0, 10).reduce((acc, l) => acc + (l.scrapKg || 0), 0);
  const scrapPercent = todayKg > 0 ? ((totalScrap / (todayKg + totalScrap)) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4 pb-20">
      {/* Top Welcome / Plant Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Monitoreo de Extrusión en Planta
          </h2>
          <p className="text-xs text-slate-400">
            {runningMachines.length} de {machines.length} líneas en marcha continua
          </p>
        </div>

        <button
          onClick={() => onOpenNewLog()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-cyan-950/60 active:scale-95 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Registrar</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-medium">Líneas Activas</span>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="text-2xl font-black font-mono text-emerald-400">{runningMachines.length}</span>
            <span className="text-xs text-slate-400">/ {machines.length}</span>
          </div>
          <span className="text-[10px] text-emerald-400/90 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Produciendo
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-medium">Volumen Turno</span>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="text-2xl font-black font-mono text-cyan-300">{todayKg.toLocaleString()}</span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <span className="text-[10px] text-slate-400">Últimos registros</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-medium">Tasa de Merma</span>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="text-2xl font-black font-mono text-amber-400">{scrapPercent}%</span>
            <span className="text-xs text-slate-400">({totalScrap} kg)</span>
          </div>
          <span className="text-[10px] text-amber-400/90">Purga y recorte</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-medium">Alertas de Proceso</span>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className={`text-2xl font-black font-mono ${alertLogs.length > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {alertLogs.length}
            </span>
            <span className="text-xs text-slate-400">incidencias</span>
          </div>
          <span className="text-[10px] text-slate-400">Presión / Mantenimiento</span>
        </div>
      </div>

      {/* Extrusion Lines Quick Cards Carousel */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            Líneas de Extrusión en Planta
          </span>
          <button
            onClick={() => onNavigateToTab('machines')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            Ver todas ({machines.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {machines.map((mach) => {
            const isRunning = mach.status === 'running';
            const isPurging = mach.status === 'purging';
            const statusColor = isRunning
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : isPurging
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-400';

            // Find last log for this machine
            const lastLog = logs.find((l) => l.machineId === mach.id);

            return (
              <div
                key={mach.id}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm font-mono text-cyan-400">{mach.code}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor}`}>
                        {isRunning ? 'En Marcha' : isPurging ? 'Purgando' : 'Parada'}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1 line-clamp-1">{mach.name}</h3>
                    <span className="text-[10px] text-slate-400 block">{mach.location}</span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                    Ø{mach.screwDiameterMm}mm • {mach.ldRatio}
                  </span>
                </div>

                {/* Current Product & telemetry preview */}
                <div className="p-2 rounded-xl bg-slate-850/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Producto:</span>
                    <span className="font-medium text-slate-200 truncate max-w-[170px]">
                      {mach.currentProduct || 'Sin producto asignado'}
                    </span>
                  </div>
                  {lastLog && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>{lastLog.screwRpm} RPM</span>
                      <span className="text-amber-400 font-bold">{lastLog.meltPressureBar} bar</span>
                      <span className="text-cyan-400">{lastLog.meltTempC}°C</span>
                    </div>
                  )}
                </div>

                {/* Quick actions for this machine */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onSelectMachine(mach.id);
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    Detalles y Zonas
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      onOpenNewLog(mach.id);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Registrar Parámetros
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Extrusion Logs Feed */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            Últimos Registros del Turno
          </span>
          <button
            onClick={() => onNavigateToTab('history')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            Ver historial completo <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {logs.slice(0, 4).map((log) => {
            const dateStr = new Date(log.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={log.id}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectLog(log);
                }}
                className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between cursor-pointer shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center font-mono shrink-0">
                    <span className="text-[10px] text-cyan-400 font-bold">{log.machineCode}</span>
                    <span className="text-[9px] text-slate-400">{dateStr}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {log.productDescription}
                    </h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{log.operatorName}</span>
                      <span>• {log.shift.split('(')[0].trim()}</span>
                      <span className="font-mono text-cyan-400">{log.producedKg} kg</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-right font-mono text-xs">
                  <div>
                    <span className="text-amber-400 font-bold block">{log.meltPressureBar} bar</span>
                    <span className="text-[10px] text-slate-400">{log.meltTempC}°C</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
