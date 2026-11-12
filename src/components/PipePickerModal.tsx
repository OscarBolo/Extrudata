import React, { useState } from 'react';
import { PipeProduct } from '../types/extrusion';
import { X, Search, CheckCircle2, Plus } from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: PipeProduct[];
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
  onOpenNewProduct: () => void;
}

export const PipePickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  products,
  selectedProductId,
  onSelectProduct,
  onOpenNewProduct,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-sm text-white">Elección de Tubo a Fabricar</h3>
            <p className="text-xs text-slate-400">Selecciona el tubo corrugado o liso para cargar sus datos</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Categories */}
        <div className="p-3.5 border-b border-slate-800/80 space-y-2 shrink-0 bg-slate-950/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por diámetro (ej. 25, 110), nombre o material..."
              className="w-full bg-slate-850 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'Tubo Corrugado', label: '🌊 Tubos Corrugados' },
              { id: 'Tubo Liso', label: '⭕ Tubos Lisos' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-850 border-slate-750 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product list */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {filteredProducts.map((p) => {
            const isSelected = selectedProductId === p.id;
            const isCorrugated = p.category === 'Tubo Corrugado';

            return (
              <div
                key={p.id}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectProduct(p.id);
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
                      <span className="text-[10px] text-slate-400 font-mono">{p.code}</span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-white mt-0.5">{p.name}</h4>

                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{p.polymerType.split('(')[0].trim()}</span>
                      <span>• {p.color}</span>
                      {p.standardNorm && <span className="text-cyan-400/90">{p.standardNorm}</span>}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 inline-block" />
                  ) : (
                    <span className="text-xs text-slate-400 hover:text-cyan-400 font-medium">Elegir</span>
                  )}
                  {p.defaultRpm && (
                    <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                      {p.defaultRpm} RPM
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenNewProduct();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Crear Nuevo Tubo / Corrugado</span>
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
