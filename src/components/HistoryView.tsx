import React, { useState } from 'react';
import { ExtrusionLog, ExtrusionMachine } from '../types/extrusion';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  Clock,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { StorageService, triggerHaptic } from '../services/storage';

interface Props {
  logs: ExtrusionLog[];
  machines: ExtrusionMachine[];
  onSelectLog: (log: ExtrusionLog) => void;
  onOpenNewLog: () => void;
}

export const HistoryView: React.FC<Props> = ({
  logs,
  machines,
  onSelectLog,
  onOpenNewLog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMachineFilter, setSelectedMachineFilter] = useState('all');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('all');

  const filteredLogs = logs.filter((log) => {
    // Machine filter
    if (selectedMachineFilter !== 'all' && log.machineId !== selectedMachineFilter) {
      return false;
    }
    // Shift filter
    if (selectedShiftFilter !== 'all' && !log.shift.toLowerCase().includes(selectedShiftFilter.toLowerCase())) {
      return false;
    }
    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchBatch = log.batchNumber?.toLowerCase().includes(term);
      const matchOrder = log.orderNumber?.toLowerCase().includes(term);
      const matchProduct = log.productDescription?.toLowerCase().includes(term);
      const matchOperator = log.operatorName?.toLowerCase().includes(term);
      const matchPolymer = log.polymerType?.toLowerCase().includes(term);
      const matchCode = log.machineCode?.toLowerCase().includes(term);
      return matchBatch || matchOrder || matchProduct || matchOperator || matchPolymer || matchCode;
    }
    return true;
  });

  const handleDownloadCSV = () => {
    triggerHaptic('success');
    StorageService.downloadCSV();
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-400" />
            Historial de Registros de Extrusión
          </h2>
          <p className="text-xs text-slate-400">
            {filteredLogs.length} registros encontrados de parámetros y calidad
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          title="Descargar tabla en formato Excel (CSV)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Lote, Orden OP, Operador, Polímero o Máquina..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {/* Machine filter */}
          <select
            value={selectedMachineFilter}
            onChange={(e) => setSelectedMachineFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Todas las Máquinas</option>
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.code} - {m.name}
              </option>
            ))}
          </select>

          {/* Shift filter */}
          <select
            value={selectedShiftFilter}
            onChange={(e) => setSelectedShiftFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Todos los Turnos</option>
            <option value="mañana">Turno Mañana</option>
            <option value="tarde">Turno Tarde</option>
            <option value="noche">Turno Noche</option>
          </select>
        </div>
      </div>

      {/* Logs timeline list */}
      {filteredLogs.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-sm text-slate-300">No se encontraron registros</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Prueba a cambiar el filtro de búsqueda o crea un nuevo registro con el botón inferior.
          </p>
          <button
            onClick={onOpenNewLog}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition"
          >
            + Crear Primer Registro
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
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer shadow-md group space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-850 border border-slate-700 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="text-[11px] font-bold text-cyan-400">{log.machineCode}</span>
                      <span className="text-[9px] text-slate-400">{dateStr}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {log.productDescription}
                        </span>
                        {log.alarmTriggered && (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-mono text-slate-300">{log.orderNumber || 'Sin OP'}</span>
                        <span>• Lote: {log.batchNumber || '-'}</span>
                        <span>• {log.shift.split('(')[0].trim()}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      log.visualQuality === 'Excelente'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : log.visualQuality === 'Aceptable'
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                        : log.visualQuality === 'Con Observaciones'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {log.visualQuality}
                  </span>
                </div>

                {/* Key Process Metrics Strip */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="text-center bg-slate-850/60 py-1 rounded-lg">
                    <span className="text-[9px] text-slate-400 block font-sans">Velocidad</span>
                    <span className="text-cyan-300 font-bold">{log.screwRpm} RPM</span>
                  </div>
                  <div className="text-center bg-slate-850/60 py-1 rounded-lg">
                    <span className="text-[9px] text-slate-400 block font-sans">Presión</span>
                    <span className="text-amber-300 font-bold">{log.meltPressureBar} bar</span>
                  </div>
                  <div className="text-center bg-slate-850/60 py-1 rounded-lg">
                    <span className="text-[9px] text-slate-400 block font-sans">Temp Masa</span>
                    <span className="text-slate-200 font-bold">{log.meltTempC}°C</span>
                  </div>
                  <div className="text-center bg-slate-850/60 py-1 rounded-lg">
                    <span className="text-[9px] text-slate-400 block font-sans">Producido</span>
                    <span className="text-emerald-400 font-bold">{log.producedKg} kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>Operador: {log.operatorName}</span>
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                    Ver ficha técnica →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
