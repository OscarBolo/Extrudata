import React from 'react';
import { ExtrusionMachine } from '../types/extrusion';
import { X, Layers, CheckCircle2, Plus, Cpu } from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  machines: ExtrusionMachine[];
  selectedMachineId: string;
  onSelectMachine: (machineId: string) => void;
  onOpenNewMachine: () => void;
}

export const MachinePickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  machines,
  selectedMachineId,
  onSelectMachine,
  onOpenNewMachine,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Elección de Máquina Extrusora</h3>
              <p className="text-xs text-slate-400">Selecciona la línea de producción donde vas a trabajar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Machine list */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {machines.map((mach) => {
            const isSelected = selectedMachineId === mach.id;
            const isRunning = mach.status === 'running';

            return (
              <div
                key={mach.id}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectMachine(mach.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/30'
                    : 'bg-slate-850/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>{mach.code}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-white">{mach.name}</h4>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold border ${
                          isRunning
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {isRunning ? 'En Marcha' : 'Parada'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {mach.location} • Ø{mach.screwDiameterMm}mm ({mach.ldRatio}) • {mach.zoneCount} Zonas
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                ) : (
                  <span className="text-xs text-slate-400 hover:text-cyan-400 font-medium">Elegir</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer with add machine option */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenNewMachine();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Configurar Nueva Máquina</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
