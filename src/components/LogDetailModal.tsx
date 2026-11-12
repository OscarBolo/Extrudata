import React from 'react';
import { ExtrusionLog } from '../types/extrusion';
import { ThermalProfileChart } from './ThermalProfileChart';
import {
  X,
  Printer,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Gauge,
  Thermometer,
  Layers,
  FileText,
  Share2,
} from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  log: ExtrusionLog | null;
  onClose: () => void;
  onEdit: (log: ExtrusionLog) => void;
  onDelete: (id: string) => void;
}

export const LogDetailModal: React.FC<Props> = ({ log, onClose, onEdit, onDelete }) => {
  if (!log) return null;

  const handlePrint = () => {
    triggerHaptic('light');
    window.print();
  };

  const handleDelete = () => {
    if (window.confirm('¿Deseas eliminar este registro de extrusión permanentemente?')) {
      triggerHaptic('warning');
      onDelete(log.id);
      onClose();
    }
  };

  const formattedDate = new Date(log.timestamp).toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const scrapRatio =
    log.producedKg > 0 ? ((log.scrapKg / (log.producedKg + log.scrapKg)) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{log.machineCode}</span>
                <span className="text-xs text-slate-400">• {log.machineName}</span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{formattedDate}</span>
                <span>• {log.shift}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="Imprimir Ficha Técnica"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onEdit(log);
                onClose();
              }}
              title="Editar Registro"
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              title="Eliminar Registro"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 print:p-0">
          {/* Alarm Banner if present */}
          {log.alarmTriggered && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{log.alarmMessage || 'Alerta registrada durante la extrusión'}</span>
            </div>
          )}

          {/* Product & Order Card */}
          <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase block">
                  Producto / Especificación
                </span>
                <h3 className="text-base font-bold text-white">{log.productDescription}</h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  log.machineStatus === 'running'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : log.machineStatus === 'purging'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {log.machineStatus === 'running'
                  ? 'En Marcha'
                  : log.machineStatus === 'purging'
                  ? 'Purgando'
                  : 'Parada'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Orden Prod.</span>
                <span className="font-mono font-medium text-slate-200">{log.orderNumber || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Lote Materia Prima</span>
                <span className="font-mono font-medium text-slate-200">{log.batchNumber || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Polímero Base</span>
                <span className="font-medium text-slate-200">{log.polymerType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Grado / Fabricante</span>
                <span className="font-medium text-slate-200">{log.polymerGrade || '-'}</span>
              </div>
            </div>

            {(log.masterbatchColor || log.regrindPercent !== undefined) && (
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                {log.masterbatchColor && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Color: {log.masterbatchColor} ({log.masterbatchPercent || 0}%)
                  </span>
                )}
                {log.regrindPercent !== undefined && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Material Molido: {log.regrindPercent}%
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Operador: {log.operatorName}
                </span>
              </div>
            )}
          </div>

          {/* Thermal Profile Visualizer */}
          <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
            <ThermalProfileChart zones={log.thermalZones} />
          </div>

          {/* Process Telemetry Gauges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Velocidad Husillo</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold font-mono text-cyan-300">{log.screwRpm}</span>
                <span className="text-xs text-slate-400">RPM</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Presión de Masa</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold font-mono text-amber-300">{log.meltPressureBar}</span>
                <span className="text-xs text-slate-400">bar</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Temp. Fundido</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold font-mono text-emerald-300">{log.meltTempC}</span>
                <span className="text-xs text-slate-400">°C</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Amperaje Motor</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold font-mono text-slate-200">{log.motorAmps}</span>
                <span className="text-xs text-slate-400">A</span>
              </div>
            </div>
          </div>

          {/* Additional parameters row if any */}
          {(log.haulOffSpeedMpm || log.coolingWaterTempC || log.vacuumPressureBar) && (
            <div className="grid grid-cols-3 gap-2 text-xs">
              {log.haulOffSpeedMpm && (
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Velocidad Arrastre</span>
                  <span className="font-semibold text-slate-200">{log.haulOffSpeedMpm} m/min</span>
                </div>
              )}
              {log.coolingWaterTempC && (
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Agua Enfriamiento</span>
                  <span className="font-semibold text-slate-200">{log.coolingWaterTempC} °C</span>
                </div>
              )}
              {log.vacuumPressureBar && (
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Vacío Calibrador</span>
                  <span className="font-semibold text-slate-200">{log.vacuumPressureBar} bar</span>
                </div>
              )}
            </div>
          )}

          {/* Quality & Production Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dimensions */}
            <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Dimensiones y Calidad
              </span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Espesor pared:</span>
                  <span className="font-mono">
                    {log.wallThicknessNominalMm
                      ? `${log.wallThicknessNominalMm} mm (Mín ${log.wallThicknessMinMm || '-'} / Máx ${log.wallThicknessMaxMm || '-'})`
                      : 'No medido'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Diámetro exterior:</span>
                  <span className="font-mono">{log.outerDiameterMm ? `${log.outerDiameterMm} mm` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Peso lineal:</span>
                  <span className="font-mono">{log.weightPerMeterG ? `${log.weightPerMeterG} g/m` : '-'}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Aspecto visual:</span>
                  <span className="font-semibold text-cyan-300">{log.visualQuality}</span>
                </div>
              </div>
            </div>

            {/* Output & Scrap */}
            <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Producción y Rendimiento
              </span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kilos producidos:</span>
                  <span className="font-mono font-bold text-white">{log.producedKg} kg</span>
                </div>
                {log.producedMeters && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Metros fabricados:</span>
                    <span className="font-mono">{log.producedMeters} m</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Merma / Purga:</span>
                  <span className="font-mono text-amber-300">{log.scrapKg} kg</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Tasa de merma:</span>
                  <span className="font-semibold font-mono text-cyan-300">{scrapRatio}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attached Photo */}
          {log.photoUrl && (
            <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Muestra / Fotografía Adjunta</span>
              <img
                src={log.photoUrl}
                alt="Muestra de extrusión"
                className="max-h-60 rounded-xl object-contain bg-black/40 border border-slate-700 mx-auto"
              />
            </div>
          )}

          {/* Notes */}
          {log.notes && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <strong className="block text-slate-400 mb-0.5">Observaciones:</strong>
              <p>{log.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
