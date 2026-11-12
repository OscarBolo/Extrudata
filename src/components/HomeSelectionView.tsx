import React from 'react';
import { ExtrusionMachine, PipeProduct } from '../types/extrusion';
import {
  Layers,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Sparkles,
  ClipboardList,
  FolderSync,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  selectedMachine: ExtrusionMachine | undefined;
  selectedProduct: PipeProduct | undefined;
  onOpenMachinePicker: () => void;
  onOpenProductPicker: () => void;
  onConfirmViewData: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const HomeSelectionView: React.FC<Props> = ({
  selectedMachine,
  selectedProduct,
  onOpenMachinePicker,
  onOpenProductPicker,
  onConfirmViewData,
  onOpenHistory,
  onOpenSettings,
}) => {
  const isBothSelected = !!selectedMachine && !!selectedProduct;
  const isCorrugated = selectedProduct?.category === 'Tubo Corrugado';

  return (
    <div className="space-y-4 sm:space-y-6 pb-16 pt-1 max-w-lg mx-auto">
      {/* Intro Header */}
      <div className="text-center space-y-1.5 px-2">
        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded-full inline-block tracking-wider uppercase font-mono">
          SISTEMA DE EXTRUSIÓN INDUSTRIAL
        </span>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Configura tus dos opciones iniciales para consultar parámetros
        </p>
      </div>

      {/* THE TWO MAIN OPTIONS CARDS */}
      <div className="space-y-3.5">
        {/* OPTION 1: ELECCIÓN DE MÁQUINA */}
        <div
          onClick={() => {
            triggerHaptic('light');
            onOpenMachinePicker();
          }}
          className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer relative shadow-lg group active:scale-[0.99] ${
            selectedMachine
              ? 'bg-gradient-to-br from-slate-900 to-slate-850 border-cyan-500/50 ring-1 ring-cyan-500/20'
              : 'bg-slate-900/90 border-slate-750 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  selectedMachine
                    ? 'bg-cyan-500 text-slate-950 shadow-cyan-950'
                    : 'bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                <Layers className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">
                  Seleccionar Máquina
                </h3>
              </div>
            </div>

            <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 mt-1">
              {selectedMachine ? 'Cambiar' : 'Elegir'} <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          {/* Selected Machine State Preview */}
          {selectedMachine ? (
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-cyan-300 font-mono font-bold text-[11px] border border-slate-700">
                  {selectedMachine.code}
                </span>
                <span className="font-bold text-white text-xs truncate max-w-[180px]">
                  {selectedMachine.name}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  selectedMachine.status === 'running'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {selectedMachine.status === 'running' ? 'En Marcha' : 'Parada'}
              </span>
            </div>
          ) : (
            <div className="mt-3 p-2.5 rounded-2xl bg-slate-850/40 border border-dashed border-slate-700 text-center text-xs text-slate-400">
              Seleccionar máquina
            </div>
          )}
        </div>

        {/* OPTION 2: ELECCIÓN DE TUBO A FABRICAR */}
        <div
          onClick={() => {
            triggerHaptic('light');
            onOpenProductPicker();
          }}
          className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer relative shadow-lg group active:scale-[0.99] ${
            selectedProduct
              ? 'bg-gradient-to-br from-slate-900 to-slate-850 border-cyan-500/50 ring-1 ring-cyan-500/20'
              : 'bg-slate-900/90 border-slate-750 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  selectedProduct
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 shadow-amber-950'
                    : 'bg-slate-800 text-amber-400 border border-slate-700'
                }`}
              >
                <span className="text-xl font-bold">Ø</span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">
                  Seleccionar Tubo a Fabricar
                </h3>
              </div>
            </div>

            <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 mt-1">
              {selectedProduct ? 'Cambiar' : 'Elegir'} <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          {/* Selected Product State Preview */}
          {selectedProduct ? (
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isCorrugated
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}
                >
                  {isCorrugated ? 'CORRUGADO' : 'TUBO LISO'} Ø{selectedProduct.diameterMm}mm
                </span>
                <span className="font-bold text-white text-xs truncate max-w-[170px]">
                  {selectedProduct.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 font-bold">
                {selectedProduct.defaultRpm ? `${selectedProduct.defaultRpm} RPM` : ''}
              </span>
            </div>
          ) : (
            <div className="mt-3 p-2.5 rounded-2xl bg-slate-850/40 border border-dashed border-slate-700 text-center text-xs text-slate-400">
              Seleccionar tubo o corrugado
            </div>
          )}
        </div>
      </div>

      {/* PRIMARY CTA BUTTON: VER DATOS GUARDADOS */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (!selectedMachine) {
              triggerHaptic('warning');
              onOpenMachinePicker();
            } else if (!selectedProduct) {
              triggerHaptic('warning');
              onOpenProductPicker();
            } else {
              triggerHaptic('success');
              onConfirmViewData();
            }
          }}
          className={`w-full py-4 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer active:scale-95 ${
            isBothSelected
              ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-cyan-950/70 font-extrabold'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
          }`}
        >
          <span>
            {isBothSelected
              ? 'VER DATOS GUARDADOS DE ESTA MÁQUINA Y TUBO'
              : !selectedMachine
              ? '1. Primero selecciona la máquina'
              : '2. Ahora selecciona el tubo a fabricar'}
          </span>
          <ArrowRight className="w-5 h-5 shrink-0" />
        </button>
      </div>

      {/* Secondary Bottom Links */}
      <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenHistory();
          }}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 text-slate-300 font-semibold cursor-pointer transition"
        >
          <ClipboardList className="w-4 h-4 text-cyan-400" />
          <span>Historial General</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenSettings();
          }}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 text-slate-300 font-semibold cursor-pointer transition"
        >
          <FolderSync className="w-4 h-4 text-cyan-400" />
          <span>Ajustes / Excel</span>
        </button>
      </div>
    </div>
  );
};
