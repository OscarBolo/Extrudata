import React, { useState, useEffect } from 'react';
import { ExtrusionMachine, MachineStatus } from '../types/extrusion';
import { X, Layers, Plus, Trash2, Save, Cpu } from 'lucide-react';
import { triggerHaptic } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (machine: ExtrusionMachine) => void;
  editMachine?: ExtrusionMachine | null;
}

export const MachineManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editMachine,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<ExtrusionMachine['type']>('Tubería y Perfiles');
  const [location, setLocation] = useState('');
  const [screwDiameterMm, setScrewDiameterMm] = useState('65');
  const [ldRatio, setLdRatio] = useState('28D');
  const [status, setStatus] = useState<MachineStatus>('running');
  const [currentProduct, setCurrentProduct] = useState('');
  const [zones, setZones] = useState<string[]>([]);
  const [newZoneName, setNewZoneName] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (editMachine) {
      setCode(editMachine.code);
      setName(editMachine.name);
      setType(editMachine.type);
      setLocation(editMachine.location);
      setScrewDiameterMm(editMachine.screwDiameterMm.toString());
      setLdRatio(editMachine.ldRatio);
      setStatus(editMachine.status);
      setCurrentProduct(editMachine.currentProduct || '');
      setZones([...editMachine.defaultZones]);
    } else {
      setCode(`EXT-0${Math.floor(Math.random() * 80 + 10)}`);
      setName('Línea de Extrusión ');
      setType('Tubería y Perfiles');
      setLocation('Nave Principal');
      setScrewDiameterMm('65');
      setLdRatio('30D');
      setStatus('running');
      setCurrentProduct('');
      setZones([
        'Z1 (Alimentación)',
        'Z2 (Compresión)',
        'Z3 (Dosificación)',
        'Adaptador',
        'Cabezal',
      ]);
    }
  }, [isOpen, editMachine]);

  const handleAddZone = () => {
    if (!newZoneName.trim()) return;
    setZones((prev) => [...prev, newZoneName.trim()]);
    setNewZoneName('');
  };

  const handleRemoveZone = (index: number) => {
    setZones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const mach: ExtrusionMachine = {
      id: editMachine ? editMachine.id : `mach-${Date.now()}`,
      code: code.trim() || 'EXT-X',
      name: name.trim(),
      type,
      location: location.trim() || 'Planta',
      screwDiameterMm: parseFloat(screwDiameterMm) || 60,
      ldRatio: ldRatio.trim() || '25D',
      zoneCount: zones.length,
      defaultZones: zones.length > 0 ? zones : ['Z1 (Cilindro)', 'Z2 (Cabezal)'],
      status,
      currentProduct: currentProduct.trim() || undefined,
    };

    triggerHaptic('success');
    onSave(mach);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {editMachine ? 'Editar Máquina de Extrusión' : 'Nueva Máquina / Línea'}
              </h3>
              <p className="text-xs text-slate-400">Configuración técnica de husillo y zonas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Código</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="EXT-05"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-bold font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Nombre Descriptivo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Extrusora 75mm Línea 1"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Tipo de Proceso</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ExtrusionMachine['type'])}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Tubería y Perfiles">Tubería y Perfiles</option>
                <option value="Película Soplada (Blown Film)">Película Soplada (Blown Film)</option>
                <option value="Monofilamento / 3D">Monofilamento / 3D</option>
                <option value="Lámina / Placa">Lámina / Placa</option>
                <option value="Recubrimiento de Cable">Recubrimiento de Cable</option>
                <option value="Peletizado / Granceado">Peletizado / Granceado</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Ubicación / Puesto</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Nave 2 - Puesto 3"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Diámetro Husillo (mm)</label>
              <input
                type="number"
                value={screwDiameterMm}
                onChange={(e) => setScrewDiameterMm(e.target.value)}
                placeholder="65"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Relación L/D</label>
              <input
                type="text"
                value={ldRatio}
                onChange={(e) => setLdRatio(e.target.value)}
                placeholder="30D"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Producto en Producción</label>
            <input
              type="text"
              value={currentProduct}
              onChange={(e) => setCurrentProduct(e.target.value)}
              placeholder="Ej. Tubo Corrugado Ø25mm"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Zones editor */}
          <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">
              Zonas Térmicas por Defecto ({zones.length} zonas)
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {zones.map((z, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800 text-xs"
                >
                  <span className="text-slate-300">
                    <strong className="text-cyan-400 font-mono mr-1.5">Z{idx + 1}:</strong>
                    {z}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveZone(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Nombre nueva zona (ej. Cabezal 2)"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddZone}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950"
            >
              <Save className="w-4 h-4" /> Guardar Máquina
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
