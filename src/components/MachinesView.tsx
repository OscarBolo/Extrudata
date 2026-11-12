import React, { useState } from 'react';
import { ExtrusionMachine, MachineStatus, ExtrusionLog } from '../types/extrusion';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  RotateCw,
  PlusCircle,
  Thermometer,
  Cpu,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  machines: ExtrusionMachine[];
  logs: ExtrusionLog[];
  onOpenNewMachineModal: () => void;
  onEditMachine: (machine: ExtrusionMachine) => void;
  onDeleteMachine: (id: string) => void;
  onUpdateStatus: (machine: ExtrusionMachine, newStatus: MachineStatus) => void;
  onOpenNewLog: (machineId: string) => void;
  onSelectLog: (log: ExtrusionLog) => void;
}

export const MachinesView: React.FC<Props> = ({
  machines,
  logs,
  onOpenNewMachineModal,
  onEditMachine,
  onDeleteMachine,
  onUpdateStatus,
  onOpenNewLog,
  onSelectLog,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

  const filteredMachines = machines.filter((m) => {
    if (filterType === 'all') return true;
    return m.type.toLowerCase().includes(filterType.toLowerCase());
  });

  const selectedMachine = machines.find((m) => m.id === selectedMachineId);
  const machineLogs = logs.filter((l) => l.machineId === selectedMachineId);

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Líneas y Máquinas de Extrusión
          </h2>
          <p className="text-xs text-slate-400">
            {machines.length} extrusoras configuradas con perfiles térmicos
          </p>
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenNewMachineModal();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Máquina</span>
        </button>
      </div>

      {/* Filter categories */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: 'Todas las Líneas' },
          { id: 'tubería', label: 'Tuberías y Perfiles' },
          { id: 'film', label: 'Film Soplado' },
          { id: 'monofilamento', label: 'Filamento / 3D' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 transition cursor-pointer ${
              filterType === f.id
                ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Machine Details Modal if clicked on details */}
      {selectedMachine && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-xl space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-cyan-400">{selectedMachine.code}</span>
                <h3 className="text-sm font-bold text-white">{selectedMachine.name}</h3>
              </div>
              <span className="text-xs text-slate-400">{selectedMachine.type} • {selectedMachine.location}</span>
            </div>
            <button
              onClick={() => setSelectedMachineId(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Diámetro Husillo</span>
              <span className="font-bold text-slate-200">Ø{selectedMachine.screwDiameterMm} mm</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Relación L/D</span>
              <span className="font-bold text-slate-200">{selectedMachine.ldRatio}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Zonas Térmicas</span>
              <span className="font-bold text-cyan-300">{selectedMachine.zoneCount} Zonas</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Registros Históricos</span>
              <span className="font-bold text-white">{machineLogs.length}</span>
            </div>
          </div>

          {/* Zones layout list */}
          <div className="p-2.5 rounded-xl bg-slate-850 text-xs space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-300 block">
              Zonas de Calefacción del Cilindro y Cabezal:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedMachine.defaultZones.map((z, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  <strong className="text-cyan-400 mr-1">Z{idx + 1}:</strong>
                  {z}
                </span>
              ))}
            </div>
          </div>

          {selectedMachine.notes && (
            <p className="text-xs text-slate-300 italic bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
              &quot;{selectedMachine.notes}&quot;
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => onOpenNewLog(selectedMachine.id)}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Registrar Parámetros
            </button>
          </div>
        </div>
      )}

      {/* Machine cards list */}
      <div className="space-y-3">
        {filteredMachines.map((mach) => {
          const isRunning = mach.status === 'running';
          const isPurging = mach.status === 'purging';
          const isMaintenance = mach.status === 'maintenance';

          return (
            <div
              key={mach.id}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 shadow-md space-y-3 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
                      {mach.code}
                    </span>
                    <h3 className="font-bold text-sm text-white">{mach.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {mach.type} • {mach.location}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onEditMachine(mach);
                    }}
                    title="Editar Configuración"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar la máquina ${mach.code}?`)) {
                        triggerHaptic('warning');
                        onDeleteMachine(mach.id);
                      }
                    }}
                    title="Eliminar Máquina"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and specs row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
                {/* Status Toggle buttons */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 mr-1">Estado:</span>
                  <button
                    onClick={() => onUpdateStatus(mach, 'running')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition ${
                      isRunning
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    En Marcha
                  </button>
                  <button
                    onClick={() => onUpdateStatus(mach, 'purging')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition ${
                      isPurging
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Purgando
                  </button>
                  <button
                    onClick={() => onUpdateStatus(mach, 'idle')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition ${
                      mach.status === 'idle'
                        ? 'bg-slate-700 border-slate-500 text-slate-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Parada
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedMachineId(mach.id);
                    }}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Ver Zonas ({mach.zoneCount})
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      onOpenNewLog(mach.id);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Registrar Parámetros
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
