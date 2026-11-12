import React, { useState } from 'react';
import {
  ExtrusionMachine,
  PipeProduct,
  ExtrusionLog,
  MachineStatus,
} from '../types/extrusion';
import { ThermalProfileChart } from './ThermalProfileChart';
import {
  RefreshCw,
  PlusCircle,
  Gauge,
  Thermometer,
  Layers,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  ChevronRight,
  TrendingUp,
  Settings,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  machine: ExtrusionMachine;
  product: PipeProduct;
  logs: ExtrusionLog[];
  onChangeWorkstation: () => void;
  onOpenNewLog: () => void;
  onSelectLog: (log: ExtrusionLog) => void;
  onEditProductReference?: (product: PipeProduct) => void;
}

export const ActiveWorkstationView: React.FC<Props> = ({
  machine,
  product,
  logs,
  onChangeWorkstation,
  onOpenNewLog,
  onSelectLog,
  onEditProductReference,
}) => {
  const [activeTab, setActiveTab] = useState<'saved_params' | 'history'>('saved_params');

  // Logs specifically matching this machine AND this product description or name
  const filteredLogs = logs.filter(
    (l) =>
      l.machineId === machine.id &&
      (l.productDescription?.toLowerCase().includes(product.name.toLowerCase()) ||
        l.productDescription?.toLowerCase().includes(product.code.toLowerCase()) ||
        product.name.toLowerCase().includes(l.productDescription?.toLowerCase() || '---'))
  );

  // Fallback logs for this machine if no exact product match yet
  const machineLogs = logs.filter((l) => l.machineId === machine.id);

  // Use product recommended zones or fall back to machine default zones
  const activeThermalZones =
    product.recommendedZones && product.recommendedZones.length > 0
      ? product.recommendedZones
      : machine.defaultZones.map((name, i) => ({
          name,
          targetTemp: 175 + i * 5,
          actualTemp: 175 + i * 5,
        }));

  const isCorrugated = product.category === 'Tubo Corrugado';

  return (
    <div className="space-y-4 pb-20">
      {/* Active Workstation Banner (Machine & Pipe Selected) */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-cyan-500/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Puesto de Fabricación Activo
            </span>

            {/* Machine Name */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/30">
                {machine.code}
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                {machine.name}
              </h2>
            </div>

            {/* Selected Pipe / Corrugated */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isCorrugated
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                }`}
              >
                {isCorrugated ? '🌊 CORRUGADO' : '⭕ TUBO LISO'} Ø{product.diameterMm}mm
              </span>
              <span className="text-xs font-bold text-slate-100">
                {product.name}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
              <span>{product.polymerType.split('(')[0].trim()}</span>
              <span>• {product.color}</span>
              {product.standardNorm && <span>• {product.standardNorm}</span>}
            </p>
          </div>

          {/* Change Selection Button */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onChangeWorkstation();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-750 text-cyan-400 hover:text-cyan-300 text-xs font-bold shrink-0 cursor-pointer transition shadow-sm active:scale-95"
            title="Seleccionar otra máquina o tubo"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cambiar Máquina / Tubo</span>
            <span className="sm:hidden">Cambiar</span>
          </button>
        </div>
      </div>

      {/* Primary Action Button: Log new parameters */}
      <button
        onClick={() => {
          triggerHaptic('medium');
          onOpenNewLog();
        }}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-extrabold text-sm shadow-xl shadow-cyan-950/70 flex items-center justify-center gap-2.5 active:scale-95 transition cursor-pointer"
      >
        <PlusCircle className="w-5 h-5" />
        <span>+ Guardar Nuevo Registro para este Tubo en {machine.code}</span>
      </button>

      {/* Segmented View Switch: Saved Specifications vs Historical Logs */}
      <div className="grid grid-cols-2 bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('saved_params');
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'saved_params'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Datos y Parámetros Guardados</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('history');
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'history'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Historial Guardado ({filteredLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: SAVED PARAMETERS & TELEMETRY */}
      {activeTab === 'saved_params' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Key Saved Operating Parameters Grid */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Parámetros de Operación Guardados para {product.code}
              </span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">
                RECETA ESTÁNDAR
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-750">
                <span className="text-[10px] text-slate-400 block font-medium">Velocidad Husillo</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-cyan-300">
                    {product.defaultRpm || 50}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">RPM</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Objetivo estándar</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-750">
                <span className="text-[10px] text-slate-400 block font-medium">Presión en Cabezal</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-amber-300">
                    {product.defaultPressureBar || 160}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">bar</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Máx antes de purga</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-750">
                <span className="text-[10px] text-slate-400 block font-medium">Temp. Masa Fundida</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-emerald-300">
                    {product.defaultMeltTempC || 190}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">°C</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Termopar de inmersión</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-750">
                <span className="text-[10px] text-slate-400 block font-medium">Velocidad Línea</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-slate-100">
                    {product.defaultSpeedMpm || 15}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">m/min</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Tirador / Corrugador</span>
              </div>
            </div>

            {/* Additional Process Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-slate-800">
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Vacío Calibrador:</span>
                <span className="font-mono font-bold text-slate-200">
                  {product.defaultVacuumBar ? `${product.defaultVacuumBar} bar` : '-0.50 bar'}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Agua Enfriamiento:</span>
                <span className="font-mono font-bold text-slate-200">
                  {product.defaultWaterTempC ? `${product.defaultWaterTempC} °C` : '17.0 °C'}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">
                  {isCorrugated ? 'Paso de Corruga:' : 'Espesor Pared:'}
                </span>
                <span className="font-mono font-bold text-slate-200">
                  {isCorrugated
                    ? `${product.corrugationPitchMm || 3.5} mm`
                    : `${product.targetThicknessMm || 3.0} mm`}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Peso Lineal:</span>
                <span className="font-mono font-bold text-slate-200">
                  {product.nominalWeightGm ? `${product.nominalWeightGm} g/m` : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Thermal Profile Visualizer for this Product */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <ThermalProfileChart zones={activeThermalZones} />
          </div>

          {/* Technical Product Notes */}
          {product.notes && (
            <div className="p-3.5 rounded-2xl bg-slate-850/70 border border-slate-750 text-xs text-slate-300">
              <strong className="block text-cyan-400 font-semibold mb-1">
                Instrucciones Técnicas de Extrusión:
              </strong>
              <p>&quot;{product.notes}&quot;</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HISTORICAL SAVED LOGS FOR THIS MACHINE AND PRODUCT */}
      {activeTab === 'history' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Registros guardados para <strong className="text-white">{product.name}</strong> en{' '}
              <strong className="text-cyan-400">{machine.code}</strong>:
            </span>
            <span className="text-cyan-400 font-mono font-bold">
              {filteredLogs.length} turnos
            </span>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="font-bold text-sm text-slate-200">
                Aún no hay registros guardados para este tubo en {machine.code}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Todos los parámetros de referencia ya están cargados. Pulsa el botón para guardar el primer registro de extrusión del turno.
              </p>
              <button
                onClick={onOpenNewLog}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition"
              >
                + Guardar Primer Registro
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredLogs.map((log) => {
                const dateObj = new Date(log.timestamp);
                const dateStr = dateObj.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                });
                const timeStr = dateObj.toLocaleTimeString([], {
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
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer shadow-md group space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center font-mono shrink-0">
                          <span className="text-[10px] text-cyan-400 font-bold">{dateStr}</span>
                          <span className="text-[9px] text-slate-400">{timeStr}</span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {log.orderNumber || 'Sin OP'} • Lote: {log.batchNumber || '-'}
                          </h4>
                          <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{log.operatorName}</span>
                            <span>• {log.shift.split('(')[0].trim()}</span>
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          log.visualQuality === 'Excelente'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : log.visualQuality === 'Aceptable'
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        }`}
                      >
                        {log.visualQuality}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 pt-1.5 border-t border-slate-800 text-[11px] font-mono text-center">
                      <div className="bg-slate-850/60 py-1 rounded-lg">
                        <span className="text-[9px] text-slate-400 block font-sans">Velocidad</span>
                        <span className="text-cyan-300 font-bold">{log.screwRpm} RPM</span>
                      </div>
                      <div className="bg-slate-850/60 py-1 rounded-lg">
                        <span className="text-[9px] text-slate-400 block font-sans">Presión</span>
                        <span className="text-amber-300 font-bold">{log.meltPressureBar} bar</span>
                      </div>
                      <div className="bg-slate-850/60 py-1 rounded-lg">
                        <span className="text-[9px] text-slate-400 block font-sans">Temp Masa</span>
                        <span className="text-emerald-300 font-bold">{log.meltTempC}°C</span>
                      </div>
                      <div className="bg-slate-850/60 py-1 rounded-lg">
                        <span className="text-[9px] text-slate-400 block font-sans">Producción</span>
                        <span className="text-white font-bold">{log.producedKg} kg</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
