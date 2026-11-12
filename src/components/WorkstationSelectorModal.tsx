import React, { useState } from 'react';
import { ExtrusionMachine, PipeProduct } from '../types/extrusion';
import {
  Layers,
  CheckCircle2,
  Cpu,
  Plus,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  X,
  Gauge,
  Thermometer,
} from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  machines: ExtrusionMachine[];
  products: PipeProduct[];
  selectedMachineId: string;
  selectedProductId: string;
  onConfirmSelection: (machineId: string, productId: string) => void;
  onOpenNewProductModal: () => void;
}

export const WorkstationSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  machines,
  products,
  selectedMachineId,
  selectedProductId,
  onConfirmSelection,
  onOpenNewProductModal,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [tempMachineId, setTempMachineId] = useState<string>(
    selectedMachineId || (machines[0]?.id ?? '')
  );
  const [tempProductId, setTempProductId] = useState<string>(
    selectedProductId || (products[0]?.id ?? '')
  );
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleSelectMachine = (machId: string) => {
    triggerHaptic('light');
    setTempMachineId(machId);
  };

  const handleSelectProduct = (prodId: string) => {
    triggerHaptic('light');
    setTempProductId(prodId);
  };

  const handleNextToProducts = () => {
    triggerHaptic('medium');
    setCurrentStep(2);
  };

  const handleFinalConfirm = () => {
    if (!tempMachineId || !tempProductId) return;
    triggerHaptic('success');
    onConfirmSelection(tempMachineId, tempProductId);
    if (onClose) onClose();
  };

  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.polymerType.toLowerCase().includes(term) ||
        p.diameterMm.toString().includes(term)
      );
    }
    return true;
  });

  const selectedMachineObj = machines.find((m) => m.id === tempMachineId);
  const selectedProductObj = products.find((p) => p.id === tempProductId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Puesto de Fabricación
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  PASO {currentStep} DE 2
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {currentStep === 1
                  ? 'Selecciona la máquina extrusora donde vas a trabajar'
                  : 'Selecciona el tubo o corrugado a fabricar para cargar sus datos'}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Wizard Step Tabs */}
        <div className="grid grid-cols-2 bg-slate-950/70 border-b border-slate-800/80 text-xs shrink-0">
          <button
            onClick={() => {
              triggerHaptic('light');
              setCurrentStep(1);
            }}
            className={`py-3 px-3 text-center font-bold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
              currentStep === 1
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 1 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              1
            </span>
            <span>1. Seleccionar Máquina</span>
            {tempMachineId && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          </button>

          <button
            onClick={() => {
              if (tempMachineId) {
                triggerHaptic('light');
                setCurrentStep(2);
              }
            }}
            disabled={!tempMachineId}
            className={`py-3 px-3 text-center font-bold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
              currentStep === 2
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : !tempMachineId
                ? 'border-transparent text-slate-600 cursor-not-allowed'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 2 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              2
            </span>
            <span>2. Tubo o Corrugado</span>
            {tempProductId && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* STEP 1: SELECT MACHINE */}
          {currentStep === 1 && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Líneas de Extrusión Disponibles en Planta:
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {machines.length} máquinas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {machines.map((mach) => {
                  const isSelected = tempMachineId === mach.id;
                  const isRunning = mach.status === 'running';

                  return (
                    <div
                      key={mach.id}
                      onClick={() => handleSelectMachine(mach.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative shadow-sm ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/30 shadow-cyan-950/50'
                          : 'bg-slate-850/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-cyan-400">
                          <CheckCircle2 className="w-5 h-5 fill-cyan-400 text-slate-950" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-mono font-bold text-xs">
                            {mach.code}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isRunning
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                          >
                            {isRunning ? 'En Marcha' : 'Parada'}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-white">{mach.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{mach.location}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                        <span>Husillo: Ø{mach.screwDiameterMm}mm ({mach.ldRatio})</span>
                        <span className="text-cyan-400 font-sans">{mach.zoneCount} Zonas</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom machine selection bar */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between mt-4">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px]">Máquina Seleccionada:</span>
                  <span className="font-bold text-white">
                    {selectedMachineObj ? `${selectedMachineObj.code} - ${selectedMachineObj.name}` : 'Ninguna'}
                  </span>
                </div>

                <button
                  onClick={handleNextToProducts}
                  disabled={!tempMachineId}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer active:scale-95 transition disabled:opacity-50"
                >
                  <span>Continuar a Tubo / Corrugado</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT PIPE OR CORRUGATED */}
          {currentStep === 2 && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Active Machine Pill */}
              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Máquina:</span>
                  <strong className="text-cyan-300 font-mono">
                    {selectedMachineObj?.code}
                  </strong>
                  <span className="text-slate-200 truncate max-w-[200px]">
                    {selectedMachineObj?.name}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-cyan-400 hover:underline text-[11px] font-semibold"
                >
                  Cambiar
                </button>
              </div>

              {/* Filters and search for products */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por diámetro (ej. 25, 110), nombre o material..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      onOpenNewProductModal();
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Añadir Producto</span>
                  </button>
                </div>

                {/* Category Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {[
                    { id: 'all', label: 'Todos los Productos' },
                    { id: 'Tubo Corrugado', label: '🌊 Tubos Corrugados' },
                    { id: 'Tubo Liso', label: '⭕ Tubos Lisos' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setProductCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 transition cursor-pointer ${
                        productCategoryFilter === cat.id
                          ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-850 border-slate-750 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Cards List */}
              <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
                {filteredProducts.map((p) => {
                  const isSelected = tempProductId === p.id;
                  const isCorrugated = p.category === 'Tubo Corrugado';

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/30'
                          : 'bg-slate-850/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-mono shrink-0 border ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-slate-900 border-slate-700 text-slate-200'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400">DIÁM</span>
                          <span className="text-sm font-extrabold">Ø{p.diameterMm}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                isCorrugated
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              }`}
                            >
                              {isCorrugated ? 'CORRUGADO' : 'TUBO LISO'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {p.code}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs text-white mt-0.5">
                            {p.name}
                          </h4>

                          <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{p.polymerType.split('(')[0].trim()}</span>
                            <span>• {p.color}</span>
                            {p.standardNorm && (
                              <span className="text-cyan-400/90">{p.standardNorm}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Technical defaults preview badge */}
                      <div className="text-right font-mono text-[11px] shrink-0">
                        {p.defaultRpm && (
                          <span className="text-slate-300 block font-semibold">
                            {p.defaultRpm} RPM
                          </span>
                        )}
                        {p.defaultPressureBar && (
                          <span className="text-amber-400 text-[10px] block">
                            {p.defaultPressureBar} bar
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Confirm Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3 mt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  ← Cambiar Máquina
                </button>

                <button
                  onClick={handleFinalConfirm}
                  disabled={!tempMachineId || !tempProductId}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-950/60 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ver Datos Guardados y Operar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
