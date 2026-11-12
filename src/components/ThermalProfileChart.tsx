import React from 'react';
import { ThermalZone } from '../types/extrusion';
import { Thermometer, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  zones: ThermalZone[];
  compact?: boolean;
}

export const ThermalProfileChart: React.FC<Props> = ({ zones, compact = false }) => {
  if (!zones || zones.length === 0) {
    return (
      <div className="p-3 text-center text-xs text-slate-500">
        Sin zonas térmicas configuradas
      </div>
    );
  }

  // Calculate min and max for scaling
  const allTemps = zones.flatMap((z) => [z.targetTemp, z.actualTemp]);
  const minTemp = Math.max(0, Math.min(...allTemps) - 20);
  const maxTemp = Math.max(260, Math.max(...allTemps) + 20);
  const range = maxTemp - minTemp || 1;

  // Max temperature delta across zones
  const maxDeviation = Math.max(
    ...zones.map((z) => Math.abs(z.actualTemp - z.targetTemp))
  );

  return (
    <div className="space-y-3">
      {/* Overview header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Thermometer className="w-4 h-4 text-amber-400" />
          <span>Perfil Térmico del Cilindro y Cabezal</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className="w-2.5 h-0.5 bg-slate-400 inline-block border-t border-dashed border-slate-300"></span> Setpoint
          </span>
          <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-semibold">
            <span className="w-2.5 h-1 bg-cyan-400 rounded-full inline-block"></span> Real
          </span>
          {maxDeviation <= 3 ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
              <CheckCircle2 className="w-3 h-3" /> Estable (±{maxDeviation}°C)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
              <AlertCircle className="w-3 h-3" /> Desvío máx {maxDeviation}°C
            </span>
          )}
        </div>
      </div>

      {/* SVG Diagram showing extrusion barrel schematic & temperature line */}
      <div className="relative bg-slate-900/80 rounded-xl p-3 border border-slate-800/80">
        <svg
          viewBox={`0 0 ${Math.max(340, zones.length * 60)} ${compact ? 120 : 160}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="50%" stop-color="#06b6d4" />
              <stop offset="100%" stop-color="#f97316" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="20" x2={zones.length * 60} y2="20" stroke="#334155" stroke-dasharray="2,3" stroke-width="0.8" />
          <line x1="20" y1="70" x2={zones.length * 60} y2="70" stroke="#334155" stroke-dasharray="2,3" stroke-width="0.8" />
          <line x1="20" y1="120" x2={zones.length * 60} y2="120" stroke="#334155" stroke-dasharray="2,3" stroke-width="0.8" />

          {/* Barrel back representation */}
          <rect
            x="20"
            y={compact ? "90" : "130"}
            width={zones.length * 60 - 20}
            height={compact ? "18" : "24"}
            rx="4"
            fill="#1e293b"
            stroke="#475569"
            stroke-width="1.5"
          />

          {/* Zones coordinates calculation */}
          {(() => {
            const chartHeight = compact ? 80 : 110;
            const yOffset = 15;
            const pointsActual = zones.map((z, idx) => {
              const x = 30 + idx * 55;
              const y = yOffset + chartHeight - ((z.actualTemp - minTemp) / range) * chartHeight;
              return { x, y, z, idx };
            });

            const pointsTarget = zones.map((z, idx) => {
              const x = 30 + idx * 55;
              const y = yOffset + chartHeight - ((z.targetTemp - minTemp) / range) * chartHeight;
              return { x, y };
            });

            const actualPathD = pointsActual.reduce((acc, p, i) => {
              return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
            }, '');

            const targetPathD = pointsTarget.reduce((acc, p, i) => {
              return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
            }, '');

            const areaPathD = `${actualPathD} L ${pointsActual[pointsActual.length - 1].x} ${yOffset + chartHeight} L ${pointsActual[0].x} ${yOffset + chartHeight} Z`;

            return (
              <>
                {/* Shaded Area under actual */}
                <path d={areaPathD} fill="url(#areaGradient)" />

                {/* Target dashed line */}
                <path
                  d={targetPathD}
                  fill="none"
                  stroke="#94a3b8"
                  stroke-width="1.8"
                  stroke-dasharray="4,4"
                  opacity="0.7"
                />

                {/* Actual line */}
                <path
                  d={actualPathD}
                  fill="none"
                  stroke="url(#curveGradient)"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                {/* Data points */}
                {pointsActual.map(({ x, y, z, idx }) => {
                  const delta = Math.abs(z.actualTemp - z.targetTemp);
                  const isAlert = delta > 5;
                  const isWarning = delta > 2 && delta <= 5;
                  const dotColor = isAlert ? '#ef4444' : isWarning ? '#f59e0b' : '#38bdf8';

                  const barrelY = compact ? 90 : 130;
                  const barrelH = compact ? 18 : 24;

                  return (
                    <g key={idx}>
                      {/* Vertical connector line */}
                      <line
                        x1={x}
                        y1={y}
                        x2={x}
                        y2={barrelY}
                        stroke="#334155"
                        stroke-width="1"
                        stroke-dasharray="1,2"
                      />

                      {/* Heating band on the barrel schematic */}
                      <rect
                        x={x - 20}
                        y={barrelY + 2}
                        width="40"
                        height={barrelH - 4}
                        rx="2"
                        fill={isAlert ? '#dc2626' : '#ea580c'}
                        opacity="0.8"
                      />
                      <text
                        x={x}
                        y={barrelY + barrelH / 2 + 3}
                        fill="#ffffff"
                        font-size={compact ? "8" : "9"}
                        font-weight="bold"
                        text-anchor="middle"
                      >
                        Z{idx + 1}
                      </text>

                      {/* Actual dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isAlert ? 5 : 4}
                        fill="#0f172a"
                        stroke={dotColor}
                        stroke-width="2.5"
                      />

                      {/* Temp text */}
                      <text
                        x={x}
                        y={y - 8}
                        fill="#f8fafc"
                        font-size={compact ? "9" : "10"}
                        font-weight="600"
                        text-anchor="middle"
                      >
                        {z.actualTemp}°
                      </text>

                      {/* Target small text */}
                      <text
                        x={x}
                        y={y + 14}
                        fill="#94a3b8"
                        font-size={compact ? "8" : "8.5"}
                        text-anchor="middle"
                        opacity="0.8"
                      >
                        ({z.targetTemp}°)
                      </text>
                    </g>
                  );
                })}
              </>
            );
          })()}
        </svg>
      </div>

      {/* Zone pills summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
        {zones.map((zone, idx) => {
          const delta = zone.actualTemp - zone.targetTemp;
          const absDelta = Math.abs(delta);
          const statusBg =
            absDelta > 5
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : absDelta > 2
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-slate-800/60 border-slate-700/50 text-slate-300';

          return (
            <div
              key={idx}
              className={`p-1.5 rounded-lg border text-center flex flex-col justify-between ${statusBg}`}
            >
              <div className="text-[10px] text-slate-400 truncate font-medium" title={zone.name}>
                {zone.name.split('(')[0].trim() || `Z${idx + 1}`}
              </div>
              <div className="my-0.5">
                <span className="text-xs font-bold text-white">{zone.actualTemp}°C</span>
                <span className="text-[10px] text-slate-400 block">Obj: {zone.targetTemp}°</span>
              </div>
              <div className="text-[9px] font-mono">
                {delta === 0 ? (
                  <span className="text-emerald-400">0.0°</span>
                ) : delta > 0 ? (
                  <span className="text-rose-400">+{delta}°</span>
                ) : (
                  <span className="text-cyan-400">{delta}°</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
