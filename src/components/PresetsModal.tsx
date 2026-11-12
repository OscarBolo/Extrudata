import React, { useState } from 'react';
import { MachinePreset, PolymerType, ThermalZone } from '../types/extrusion';
import { X, Sparkles, Plus, Trash2, Check, Thermometer } from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  presets: MachinePreset[];
  onSavePresets: (presets: MachinePreset[]) => void;
}

export const PresetsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  presets,
  onSavePresets,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    presets.length > 0 ? presets[0].id : ''
  );
  const [isCreating, setIsCreating] = useState(false);

  // New preset form states
  const [newName, setNewName] = useState('');
  const [newPolymer, setNewPolymer] = useState<PolymerType>('HDPE (Polietileno Alta Densidad)');
  const [newRpm, setNewRpm] = useState('50');
  const [newPressure, setNewPressure] = useState('180');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const currentPreset = presets.find((p) => p.id === selectedPresetId);

  const handleCreatePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const defaultZones: ThermalZone[] = [
      { name: 'Z1 (Alimentación)', targetTemp: 170, actualTemp: 170 },
      { name: 'Z2 (Compresión)', targetTemp: 185, actualTemp: 185 },
      { name: 'Z3 (Dosificación)', targetTemp: 195, actualTemp: 195 },
      { name: 'Adaptador', targetTemp: 200, actualTemp: 200 },
      { name: 'Cabezal / Hilera', targetTemp: 205, actualTemp: 205 },
    ];

    const newPreset: MachinePreset = {
      id: `preset-${Date.now()}`,
      name: newName.trim(),
      polymerType: newPolymer,
      recommendedZones: defaultZones,
      recommendedRpm: parseFloat(newRpm) || 50,
      recommendedPressureBar: parseFloat(newPressure) || 180,
      notes: newNotes.trim() || 'Receta personalizada de planta.',
    };

    triggerHaptic('success');
    const updated = [newPreset, ...presets];
    onSavePresets(updated);
    setSelectedPresetId(newPreset.id);
    setIsCreating(false);
    setNewName('');
    setNewNotes('');
  };

  const handleDeletePreset = (id: string) => {
    if (presets.length <= 1) {
      alert('Debe quedar al menos una receta en el sistema.');
      return;
    }
    if (window.confirm('¿Deseas eliminar esta receta?')) {
      const updated = presets.filter((p) => p.id !== id);
      onSavePresets(updated);
      setSelectedPresetId(updated[0].id);
      triggerHaptic('medium');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Recetas y Fórmulas de Extrusión</h3>
              <p className="text-xs text-slate-400">Parámetros térmicos estándar por polímero</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Recetas guardadas ({presets.length}):</span>
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Nueva Receta
              </button>
            )}
          </div>

          {/* New preset form */}
          {isCreating ? (
            <form onSubmit={handleCreatePreset} className="p-3.5 rounded-xl bg-slate-850 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">Nueva Receta de Extrusión</span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Nombre de la Receta / Producto</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Tubo PP-R Termofusión 25mm"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Polímero Base</label>
                  <select
                    value={newPolymer}
                    onChange={(e) => setNewPolymer(e.target.value as PolymerType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="HDPE (Polietileno Alta Densidad)">HDPE</option>
                    <option value="LDPE (Polietileno Baja Densidad)">LDPE</option>
                    <option value="PP (Polipropileno)">PP</option>
                    <option value="PVC Rígido">PVC Rígido</option>
                    <option value="PLA / Biodegradable">PLA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">RPM Husillo Sugerido</label>
                  <input
                    type="number"
                    value={newRpm}
                    onChange={(e) => setNewRpm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Notas técnicas</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Recomendaciones de refrigeración o tamiz de filtro..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
              >
                Guardar Receta
              </button>
            </form>
          ) : (
            /* Presets list pills */
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPresetId(p.id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium text-left shrink-0 transition cursor-pointer ${
                    selectedPresetId === p.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block">{p.name}</span>
                  <span className="text-[10px] text-slate-400">{p.polymerType.split('(')[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active Preset Inspection */}
          {currentPreset && !isCreating && (
            <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{currentPreset.name}</h4>
                  <span className="text-xs text-cyan-400">{currentPreset.polymerType}</span>
                </div>
                <button
                  onClick={() => handleDeletePreset(currentPreset.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  title="Eliminar receta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Velocidad Tornillo</span>
                  <span className="font-bold font-mono text-cyan-300">{currentPreset.recommendedRpm} RPM</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Presión Máx en Masa</span>
                  <span className="font-bold font-mono text-amber-300">{currentPreset.recommendedPressureBar} bar</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  Temperaturas Recomendadas por Zona:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {currentPreset.recommendedZones.map((z, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-800 text-center border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block truncate">{z.name}</span>
                      <span className="text-xs font-bold text-white font-mono">{z.targetTemp}°C</span>
                    </div>
                  ))}
                </div>
              </div>

              {currentPreset.notes && (
                <div className="p-2.5 rounded-lg bg-slate-800/40 text-[11px] text-slate-300 italic border border-slate-700/40">
                  &quot;{currentPreset.notes}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
