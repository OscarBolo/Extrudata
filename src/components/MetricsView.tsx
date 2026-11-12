import React, { useMemo } from 'react';
import { ExtrusionLog, ExtrusionMachine } from '../types/extrusion';
import {
  TrendingUp,
  BarChart3,
  Gauge,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface Props {
  logs: ExtrusionLog[];
  machines: ExtrusionMachine[];
}

export const MetricsView: React.FC<Props> = ({ logs, machines }) => {
  // Production stats
  const stats = useMemo(() => {
    const totalKg = logs.reduce((acc, l) => acc + (l.producedKg || 0), 0);
    const totalScrap = logs.reduce((acc, l) => acc + (l.scrapKg || 0), 0);
    const totalMeters = logs.reduce((acc, l) => acc + (l.producedMeters || 0), 0);
    const scrapPercent = totalKg > 0 ? ((totalScrap / (totalKg + totalScrap)) * 100).toFixed(1) : '0';

    const qualityCounts = {
      Excelente: logs.filter((l) => l.visualQuality === 'Excelente').length,
      Aceptable: logs.filter((l) => l.visualQuality === 'Aceptable').length,
      'Con Observaciones': logs.filter((l) => l.visualQuality === 'Con Observaciones').length,
      Rechazado: logs.filter((l) => l.visualQuality === 'Rechazado').length,
    };

    // By machine production
    const byMachine = machines.map((mach) => {
      const machLogs = logs.filter((l) => l.machineId === mach.id);
      const kg = machLogs.reduce((acc, l) => acc + (l.producedKg || 0), 0);
      const scrap = machLogs.reduce((acc, l) => acc + (l.scrapKg || 0), 0);
      const avgPressure =
        machLogs.length > 0
          ? Math.round(machLogs.reduce((acc, l) => acc + (l.meltPressureBar || 0), 0) / machLogs.length)
          : 0;
      const avgRpm =
        machLogs.length > 0
          ? Math.round((machLogs.reduce((acc, l) => acc + (l.screwRpm || 0), 0) / machLogs.length) * 10) / 10
          : 0;
      return {
        id: mach.id,
        code: mach.code,
        name: mach.name,
        kg,
        scrap,
        avgPressure,
        avgRpm,
        logCount: machLogs.length,
      };
    });

    const maxKg = Math.max(1, ...byMachine.map((m) => m.kg));

    return {
      totalKg,
      totalScrap,
      totalMeters,
      scrapPercent,
      qualityCounts,
      byMachine,
      maxKg,
    };
  }, [logs, machines]);

  return (
    <div className="space-y-4 pb-16">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Telemetría y Control de Procesos (SPC)
          </h2>
          <p className="text-xs text-slate-400">Análisis de producción, estabilidad térmica y merma</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
          {logs.length} Registros Analizados
        </span>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-800 shadow-md">
          <span className="text-[11px] font-medium text-slate-400 block">Total Producido</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-mono text-cyan-300">{stats.totalKg.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-bold">kg</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> Materia prima procesada
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-800 shadow-md">
          <span className="text-[11px] font-medium text-slate-400 block">Merma / Purga Total</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-mono text-amber-400">{stats.totalScrap}</span>
            <span className="text-xs text-slate-400 font-bold">kg</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Tasa global: <strong className="text-amber-300">{stats.scrapPercent}%</strong>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-800 shadow-md">
          <span className="text-[11px] font-medium text-slate-400 block">Metros Lineales</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-mono text-slate-100">{stats.totalMeters.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-bold">m</span>
          </div>
          <span className="text-[10px] text-cyan-400 block mt-1">Tubería y film medido</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-800 shadow-md">
          <span className="text-[11px] font-medium text-slate-400 block">Conformidad de Calidad</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {logs.length > 0
                ? `${Math.round(((stats.qualityCounts.Excelente + stats.qualityCounts.Aceptable) / logs.length) * 100)}%`
                : '100%'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Excelente / Aceptable
          </span>
        </div>
      </div>

      {/* Production by Extrusion Line (Bar Chart) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Producción Acumulada por Línea (Kg)
          </span>
        </div>

        <div className="space-y-3">
          {stats.byMachine.map((m) => {
            const pct = Math.round((m.kg / stats.maxKg) * 100);
            return (
              <div key={m.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    <strong className="text-cyan-400 font-mono mr-1.5">{m.code}</strong>
                    {m.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">
                      {m.avgPressure ? `Presión media: ${m.avgPressure} bar` : 'Sin datos'}
                    </span>
                    <span className="font-mono font-bold text-white">{m.kg} kg</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quality Distribution Pills */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
        <span className="text-xs font-bold text-slate-200 block">
          Distribución de Calidad Visual en Inspecciones
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 block font-medium">Excelente</span>
            <span className="text-lg font-black font-mono text-emerald-300">{stats.qualityCounts.Excelente}</span>
            <span className="text-[10px] text-slate-400 block">lotes conformes</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 block font-medium">Aceptable</span>
            <span className="text-lg font-black font-mono text-cyan-300">{stats.qualityCounts.Aceptable}</span>
            <span className="text-[10px] text-slate-400 block">dentro de tolerancia</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <span className="text-[10px] text-amber-400 block font-medium">Con Observaciones</span>
            <span className="text-lg font-black font-mono text-amber-300">{stats.qualityCounts['Con Observaciones']}</span>
            <span className="text-[10px] text-slate-400 block">requieren ajuste</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
            <span className="text-[10px] text-rose-400 block font-medium">Rechazado</span>
            <span className="text-lg font-black font-mono text-rose-300">{stats.qualityCounts.Rechazado}</span>
            <span className="text-[10px] text-slate-400 block">fuera de norma</span>
          </div>
        </div>
      </div>

      {/* Recent Pressure & RPM Log Scatter / Table */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2.5">
        <span className="text-xs font-bold text-slate-200 block">
          Últimas Mediciones de Presión y RPM
        </span>
        <div className="space-y-1.5">
          {logs.slice(0, 5).map((l) => (
            <div
              key={l.id}
              className="p-2.5 rounded-xl bg-slate-850/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold font-mono text-cyan-400 mr-2">{l.machineCode}</span>
                <span className="text-slate-300 truncate">{l.productDescription}</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-300">{l.screwRpm} RPM</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    l.meltPressureBar > 230
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-800 text-amber-300'
                  }`}
                >
                  {l.meltPressureBar} bar
                </span>
                <span className="text-emerald-400">{l.meltTempC}°C</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
