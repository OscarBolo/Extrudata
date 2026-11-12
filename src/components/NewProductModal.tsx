import React, { useState } from 'react';
import { PipeProduct, PolymerType, ThermalZone } from '../types/extrusion';
import { X, Save, Plus, Layers } from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: PipeProduct) => void;
}

const POLYMERS: PolymerType[] = [
  'HDPE (Polietileno Alta Densidad)',
  'PP (Polipropileno)',
  'PVC Rígido',
  'PVC Flexible',
  'LDPE (Polietileno Baja Densidad)',
  'LLDPE (Lineal Baja Densidad)',
  'PA (Poliamida / Nylon)',
  'Otro',
];

export const NewProductModal: React.FC<Props> = ({ isOpen, onClose, onSaveProduct }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<'Tubo Corrugado' | 'Tubo Liso'>('Tubo Corrugado');
  const [diameterMm, setDiameterMm] = useState('25');
  const [innerDiameterMm, setInnerDiameterMm] = useState('');
  const [polymerType, setPolymerType] = useState<PolymerType>('PP (Polipropileno)');
  const [color, setColor] = useState('Gris');
  const [standardNorm, setStandardNorm] = useState('UNE-EN 61386-22');
  const [corrugationPitchMm, setCorrugationPitchMm] = useState('3.5');
  const [targetThicknessMm, setTargetThicknessMm] = useState('');
  const [nominalWeightGm, setNominalWeightGm] = useState('42');
  const [defaultRpm, setDefaultRpm] = useState('55');
  const [defaultPressureBar, setDefaultPressureBar] = useState('160');
  const [defaultMeltTempC, setDefaultMeltTempC] = useState('190');
  const [defaultSpeedMpm, setDefaultSpeedMpm] = useState('22');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const diam = parseFloat(diameterMm) || 25;
    const defaultZones: ThermalZone[] = [
      { name: 'Z1 (Alimentación)', targetTemp: 165, actualTemp: 165 },
      { name: 'Z2 (Plastificación)', targetTemp: 180, actualTemp: 180 },
      { name: 'Z3 (Medición)', targetTemp: 190, actualTemp: 190 },
      { name: 'Cuello Extrusión', targetTemp: 195, actualTemp: 195 },
      { name: 'Cabezal Angular', targetTemp: 195, actualTemp: 195 },
      { name: 'Bloques Formadores', targetTemp: 45, actualTemp: 45 },
    ];

    const newProd: PipeProduct = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      code: code.trim() || `TUB-${diam}`,
      category,
      diameterMm: diam,
      innerDiameterMm: parseFloat(innerDiameterMm) || undefined,
      polymerType,
      color: color.trim() || 'Estándar',
      standardNorm: standardNorm.trim() || undefined,
      corrugationPitchMm: category === 'Tubo Corrugado' ? parseFloat(corrugationPitchMm) || undefined : undefined,
      targetThicknessMm: category === 'Tubo Liso' ? parseFloat(targetThicknessMm) || undefined : undefined,
      nominalWeightGm: parseFloat(nominalWeightGm) || undefined,
      defaultRpm: parseFloat(defaultRpm) || 50,
      defaultPressureBar: parseFloat(defaultPressureBar) || 160,
      defaultMeltTempC: parseFloat(defaultMeltTempC) || 190,
      defaultSpeedMpm: parseFloat(defaultSpeedMpm) || 10,
      recommendedZones: defaultZones,
      notes: notes.trim() || undefined,
    };

    triggerHaptic('success');
    onSaveProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">Nuevo Tubo o Corrugado</h3>
            <p className="text-xs text-slate-400">Crear especificación y parámetros técnicos base</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          {/* Category Switch */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tipo de Fabricación *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('Tubo Corrugado')}
                className={`py-2 rounded-xl border font-bold text-xs transition cursor-pointer ${
                  category === 'Tubo Corrugado'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                🌊 Tubo Corrugado
              </button>
              <button
                type="button"
                onClick={() => setCategory('Tubo Liso')}
                className={`py-2 rounded-xl border font-bold text-xs transition cursor-pointer ${
                  category === 'Tubo Liso'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                ⭕ Tubo Liso
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nombre Completo del Tubo / Corrugado *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Tubo Corrugado Ø32mm con Guía para Electricidad"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Código de Referencia</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej. CORR-32-ELEC"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Diámetro Exterior (Ø mm) *</label>
              <input
                type="number"
                step="0.5"
                value={diameterMm}
                onChange={(e) => setDiameterMm(e.target.value)}
                placeholder="25"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Polímero Base</label>
              <select
                value={polymerType}
                onChange={(e) => setPolymerType(e.target.value as PolymerType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {POLYMERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Color / Acabado</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Ej. Gris RAL 7035 / Negro"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Technical Operating Defaults */}
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
            <span className="text-[11px] font-bold text-cyan-400 block">
              Parámetros de Extrusión Sugeridos para Guardar:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">RPM Husillo</label>
                <input
                  type="number"
                  value={defaultRpm}
                  onChange={(e) => setDefaultRpm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Presión Masa (bar)</label>
                <input
                  type="number"
                  value={defaultPressureBar}
                  onChange={(e) => setDefaultPressureBar(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Velocidad (m/min)</label>
                <input
                  type="number"
                  step="0.5"
                  value={defaultSpeedMpm}
                  onChange={(e) => setDefaultSpeedMpm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Producto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
