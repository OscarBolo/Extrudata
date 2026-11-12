import React, { useState, useEffect, useRef } from 'react';
import {
  ExtrusionLog,
  ExtrusionMachine,
  MachinePreset,
  PipeProduct,
  PolymerType,
  ShiftType,
  ThermalZone,
  MachineStatus,
} from '../types/extrusion';
import {
  X,
  Save,
  Thermometer,
  Gauge,
  CheckCircle,
  AlertTriangle,
  Camera,
  Trash2,
  Sparkles,
  Zap,
  Layers,
  Clock,
  User,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { triggerHaptic, playIndustrialBeep, StorageService } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: ExtrusionLog) => void;
  machines: ExtrusionMachine[];
  presets: MachinePreset[];
  operators: string[];
  initialMachineId?: string;
  initialProductId?: string;
  products?: PipeProduct[];
  editLog?: ExtrusionLog | null;
  soundEnabled: boolean;
}

const POLYMER_OPTIONS: PolymerType[] = [
  'HDPE (Polietileno Alta Densidad)',
  'LDPE (Polietileno Baja Densidad)',
  'LLDPE (Lineal Baja Densidad)',
  'PP (Polipropileno)',
  'PVC Rígido',
  'PVC Flexible',
  'PET',
  'ABS',
  'PLA / Biodegradable',
  'PA (Poliamida / Nylon)',
  'Otro',
];

const SHIFT_OPTIONS: ShiftType[] = [
  'Mañana (06:00 - 14:00)',
  'Tarde (14:00 - 22:00)',
  'Noche (22:00 - 06:00)',
];

export const LogFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  machines,
  presets,
  operators,
  initialMachineId,
  initialProductId,
  products = [],
  editLog,
  soundEnabled,
}) => {
  const [activeStep, setActiveStep] = useState<'general' | 'thermal' | 'process' | 'quality'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [selectedMachineId, setSelectedMachineId] = useState<string>('');
  const [shift, setShift] = useState<ShiftType>('Mañana (06:00 - 14:00)');
  const [operatorName, setOperatorName] = useState<string>('');
  const [supervisorName, setSupervisorName] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [polymerType, setPolymerType] = useState<PolymerType>('HDPE (Polietileno Alta Densidad)');
  const [polymerGrade, setPolymerGrade] = useState<string>('');
  const [masterbatchColor, setMasterbatchColor] = useState<string>('');
  const [masterbatchPercent, setMasterbatchPercent] = useState<string>('2.0');
  const [regrindPercent, setRegrindPercent] = useState<string>('0');

  // Thermal zones
  const [thermalZones, setThermalZones] = useState<ThermalZone[]>([]);

  // Mechanical & Process
  const [screwRpm, setScrewRpm] = useState<string>('50');
  const [motorAmps, setMotorAmps] = useState<string>('72');
  const [meltPressureBar, setMeltPressureBar] = useState<string>('180');
  const [meltTempC, setMeltTempC] = useState<string>('200');
  const [haulOffSpeedMpm, setHaulOffSpeedMpm] = useState<string>('8.5');
  const [coolingWaterTempC, setCoolingWaterTempC] = useState<string>('18.0');
  const [vacuumPressureBar, setVacuumPressureBar] = useState<string>('-0.65');

  // Quality & Dimensional
  const [wallThicknessMinMm, setWallThicknessMinMm] = useState<string>('');
  const [wallThicknessMaxMm, setWallThicknessMaxMm] = useState<string>('');
  const [wallThicknessNominalMm, setWallThicknessNominalMm] = useState<string>('');
  const [outerDiameterMm, setOuterDiameterMm] = useState<string>('');
  const [weightPerMeterG, setWeightPerMeterG] = useState<string>('');
  const [visualQuality, setVisualQuality] = useState<'Excelente' | 'Aceptable' | 'Con Observaciones' | 'Rechazado'>('Excelente');
  const [qualityNotes, setQualityNotes] = useState<string>('');

  // Production
  const [producedKg, setProducedKg] = useState<string>('250');
  const [producedMeters, setProducedMeters] = useState<string>('');
  const [scrapKg, setScrapKg] = useState<string>('5');
  const [machineStatus, setMachineStatus] = useState<MachineStatus>('running');
  const [notes, setNotes] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');

  // Initial populate or reset
  useEffect(() => {
    if (!isOpen) return;

    if (editLog) {
      setSelectedMachineId(editLog.machineId);
      setShift(editLog.shift);
      setOperatorName(editLog.operatorName);
      setSupervisorName(editLog.supervisorName || '');
      setOrderNumber(editLog.orderNumber || '');
      setBatchNumber(editLog.batchNumber || '');
      setProductDescription(editLog.productDescription || '');
      setPolymerType(editLog.polymerType);
      setPolymerGrade(editLog.polymerGrade || '');
      setMasterbatchColor(editLog.masterbatchColor || '');
      setMasterbatchPercent(editLog.masterbatchPercent?.toString() || '');
      setRegrindPercent(editLog.regrindPercent?.toString() || '0');
      setThermalZones(editLog.thermalZones || []);
      setScrewRpm(editLog.screwRpm?.toString() || '');
      setMotorAmps(editLog.motorAmps?.toString() || '');
      setMeltPressureBar(editLog.meltPressureBar?.toString() || '');
      setMeltTempC(editLog.meltTempC?.toString() || '');
      setHaulOffSpeedMpm(editLog.haulOffSpeedMpm?.toString() || '');
      setCoolingWaterTempC(editLog.coolingWaterTempC?.toString() || '');
      setVacuumPressureBar(editLog.vacuumPressureBar?.toString() || '');
      setWallThicknessMinMm(editLog.wallThicknessMinMm?.toString() || '');
      setWallThicknessMaxMm(editLog.wallThicknessMaxMm?.toString() || '');
      setWallThicknessNominalMm(editLog.wallThicknessNominalMm?.toString() || '');
      setOuterDiameterMm(editLog.outerDiameterMm?.toString() || '');
      setWeightPerMeterG(editLog.weightPerMeterG?.toString() || '');
      setVisualQuality(editLog.visualQuality || 'Excelente');
      setQualityNotes(editLog.qualityNotes || '');
      setProducedKg(editLog.producedKg?.toString() || '0');
      setProducedMeters(editLog.producedMeters?.toString() || '');
      setScrapKg(editLog.scrapKg?.toString() || '0');
      setMachineStatus(editLog.machineStatus || 'running');
      setNotes(editLog.notes || '');
      setPhotoUrl(editLog.photoUrl || '');
    } else {
      // Pick machine
      const targetMachineId = initialMachineId || (machines.length > 0 ? machines[0].id : '');
      setSelectedMachineId(targetMachineId);
      const targetMach = machines.find((m) => m.id === targetMachineId);

      // Auto detect shift based on current time
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 14) {
        setShift('Mañana (06:00 - 14:00)');
      } else if (hour >= 14 && hour < 22) {
        setShift('Tarde (14:00 - 22:00)');
      } else {
        setShift('Noche (22:00 - 06:00)');
      }

      // Default operator from storage or list
      if (operators.length > 0 && !operatorName) {
        setOperatorName(operators[0]);
      }

      if (targetMach) {
        setProductDescription(targetMach.currentProduct || '');
        const defaultZones = targetMach.defaultZones.map((name, i) => ({
          name,
          targetTemp: 180 + i * 5,
          actualTemp: 180 + i * 5,
        }));
        setThermalZones(defaultZones);
      }

      // Check if target pipe product is selected
      const targetProd = products.find((p) => p.id === initialProductId);
      if (targetProd) {
        setProductDescription(targetProd.name);
        setPolymerType(targetProd.polymerType);
        if (targetProd.color) setMasterbatchColor(targetProd.color);
        if (targetProd.defaultRpm) setScrewRpm(targetProd.defaultRpm.toString());
        if (targetProd.defaultPressureBar) setMeltPressureBar(targetProd.defaultPressureBar.toString());
        if (targetProd.defaultMeltTempC) setMeltTempC(targetProd.defaultMeltTempC.toString());
        if (targetProd.defaultSpeedMpm) setHaulOffSpeedMpm(targetProd.defaultSpeedMpm.toString());
        if (targetProd.defaultWaterTempC) setCoolingWaterTempC(targetProd.defaultWaterTempC.toString());
        if (targetProd.defaultVacuumBar) setVacuumPressureBar(targetProd.defaultVacuumBar.toString());
        if (targetProd.diameterMm) setOuterDiameterMm(targetProd.diameterMm.toString());
        if (targetProd.targetThicknessMm) setWallThicknessNominalMm(targetProd.targetThicknessMm.toString());
        if (targetProd.nominalWeightGm) setWeightPerMeterG(targetProd.nominalWeightGm.toString());
        if (targetProd.recommendedZones && targetProd.recommendedZones.length > 0) {
          setThermalZones(targetProd.recommendedZones.map((z) => ({ ...z })));
        }
      }
    }
  }, [isOpen, editLog, initialMachineId, initialProductId, machines, products]);

  // When machine changes in creation mode
  const handleMachineChange = (machId: string) => {
    setSelectedMachineId(machId);
    if (!editLog) {
      const mach = machines.find((m) => m.id === machId);
      if (mach) {
        setProductDescription(mach.currentProduct || '');
        setThermalZones(
          mach.defaultZones.map((name, i) => ({
            name,
            targetTemp: 180 + i * 5,
            actualTemp: 180 + i * 5,
          }))
        );
      }
    }
  };

  // Preset quick load
  const handleApplyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    triggerHaptic('medium');
    setPolymerType(preset.polymerType);
    setScrewRpm(preset.recommendedRpm.toString());
    setMeltPressureBar(preset.recommendedPressureBar.toString());
    setThermalZones(preset.recommendedZones.map((z) => ({ ...z })));
    if (!productDescription) {
      setProductDescription(preset.name);
    }
    if (soundEnabled) playIndustrialBeep('click');
  };

  // Thermal zone temp modification
  const handleUpdateZone = (index: number, field: 'targetTemp' | 'actualTemp', val: number) => {
    setThermalZones((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  // Photo handling
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        triggerHaptic('light');
      };
      reader.readAsDataURL(file);
    }
  };

  // Pressure alert check
  const currentPressure = parseFloat(meltPressureBar) || 0;
  const isHighPressure = currentPressure > 230;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mach = machines.find((m) => m.id === selectedMachineId);
    if (!mach) return;

    // Check critical alarms
    const hasAlarm = isHighPressure || machineStatus === 'maintenance';
    const alarmMsg = isHighPressure
      ? `ALERTA DE ALTA PRESIÓN: ${currentPressure} bar excede el límite recomendado (230 bar)`
      : undefined;

    const log: ExtrusionLog = {
      id: editLog ? editLog.id : `log-${Date.now()}`,
      timestamp: editLog ? editLog.timestamp : new Date().toISOString(),
      machineId: mach.id,
      machineCode: mach.code,
      machineName: mach.name,
      shift,
      operatorName: operatorName.trim() || 'Operador',
      supervisorName: supervisorName.trim() || undefined,
      orderNumber: orderNumber.trim() || `OP-${new Date().getFullYear()}-001`,
      batchNumber: batchNumber.trim() || `LOT-${new Date().getMonth() + 1}`,
      productDescription: productDescription.trim() || mach.name,
      polymerType,
      polymerGrade: polymerGrade.trim(),
      masterbatchColor: masterbatchColor.trim(),
      masterbatchPercent: parseFloat(masterbatchPercent) || undefined,
      regrindPercent: parseFloat(regrindPercent) || 0,
      thermalZones,
      screwRpm: parseFloat(screwRpm) || 0,
      motorAmps: parseFloat(motorAmps) || 0,
      meltPressureBar: currentPressure,
      meltTempC: parseFloat(meltTempC) || 0,
      haulOffSpeedMpm: parseFloat(haulOffSpeedMpm) || undefined,
      coolingWaterTempC: parseFloat(coolingWaterTempC) || undefined,
      vacuumPressureBar: parseFloat(vacuumPressureBar) || undefined,
      wallThicknessMinMm: parseFloat(wallThicknessMinMm) || undefined,
      wallThicknessMaxMm: parseFloat(wallThicknessMaxMm) || undefined,
      wallThicknessNominalMm: parseFloat(wallThicknessNominalMm) || undefined,
      outerDiameterMm: parseFloat(outerDiameterMm) || undefined,
      weightPerMeterG: parseFloat(weightPerMeterG) || undefined,
      visualQuality,
      qualityNotes: qualityNotes.trim() || undefined,
      producedKg: parseFloat(producedKg) || 0,
      producedMeters: parseFloat(producedMeters) || undefined,
      scrapKg: parseFloat(scrapKg) || 0,
      machineStatus,
      alarmTriggered: hasAlarm,
      alarmMessage: alarmMsg,
      notes: notes.trim(),
      photoUrl: photoUrl || undefined,
    };

    // Save operator to quick memory
    if (operatorName.trim()) {
      StorageService.addOperator(operatorName.trim());
    }

    triggerHaptic(hasAlarm ? 'warning' : 'success');
    if (soundEnabled) {
      playIndustrialBeep(hasAlarm ? 'alert' : 'save');
    }

    onSave(log);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 text-white shadow-md shadow-cyan-950">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {editLog ? 'Editar Registro de Extrusión' : 'Nuevo Registro de Máquina'}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  EXTRUDATA
                </span>
              </h2>
              <p className="text-xs text-slate-400">Captura de parámetros térmicos, mecánicos y calidad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector for Quick Mobile Ergonomics */}
        <div className="grid grid-cols-4 bg-slate-950/80 border-b border-slate-800 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveStep('general')}
            className={`py-2.5 px-1 text-center font-medium transition border-b-2 ${
              activeStep === 'general'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. General
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('thermal')}
            className={`py-2.5 px-1 text-center font-medium transition border-b-2 ${
              activeStep === 'thermal'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Térmico
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('process')}
            className={`py-2.5 px-1 text-center font-medium transition border-b-2 flex items-center justify-center gap-1 ${
              activeStep === 'process'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Proceso
            {isHighPressure && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('quality')}
            className={`py-2.5 px-1 text-center font-medium transition border-b-2 ${
              activeStep === 'quality'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Calidad
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* STEP 1: GENERAL & MATERIAL */}
          {activeStep === 'general' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Presets quick load banner */}
              {presets.length > 0 && !editLog && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-850 border border-slate-700/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Cargar Receta / Preset Rápido:
                    </span>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {presets.map((pr) => (
                      <button
                        key={pr.id}
                        type="button"
                        onClick={() => handleApplyPreset(pr.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/40 border border-slate-700 hover:border-cyan-500/50 text-[11px] font-medium text-slate-200 hover:text-cyan-300 shrink-0 transition"
                      >
                        {pr.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Machine selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Máquina / Línea de Extrusión *
                </label>
                <select
                  value={selectedMachineId}
                  onChange={(e) => handleMachineChange(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                >
                  {machines.map((mach) => (
                    <option key={mach.id} value={mach.id}>
                      {mach.code} - {mach.name} ({mach.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift and Operator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Turno *
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as ShiftType)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {SHIFT_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Operador Responsable *
                  </label>
                  <input
                    type="text"
                    list="operators-list"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                  <datalist id="operators-list">
                    {operators.map((op, i) => (
                      <option key={i} value={op} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Order & Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Orden de Producción (OP)
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Ej. OP-2026-1048"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Lote de Materia Prima
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="Ej. LOTE-HDPE-9442"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descripción del Producto Fabricado
                </label>
                <input
                  type="text"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Ej. Tubería HDPE Ø32mm SDR 11 PN16"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Polymer and Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tipo de Polímero Base *
                  </label>
                  <select
                    value={polymerType}
                    onChange={(e) => setPolymerType(e.target.value as PolymerType)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {POLYMER_OPTIONS.map((poly) => (
                      <option key={poly} value={poly}>
                        {poly}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Grado / Fabricante
                  </label>
                  <input
                    type="text"
                    value={polymerGrade}
                    onChange={(e) => setPolymerGrade(e.target.value)}
                    placeholder="Ej. TotalEnergies XS 10 / Sabic"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Additives & Regrind */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1 truncate">
                    Color / Masterbatch
                  </label>
                  <input
                    type="text"
                    value={masterbatchColor}
                    onChange={(e) => setMasterbatchColor(e.target.value)}
                    placeholder="Ej. Negro / Azul"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    % Masterbatch
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={masterbatchPercent}
                    onChange={(e) => setMasterbatchPercent(e.target.value)}
                    placeholder="2.0"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1 truncate">
                    % Molido / Reciclado
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={regrindPercent}
                    onChange={(e) => setRegrindPercent(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveStep('thermal');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-950 cursor-pointer"
                >
                  Siguiente: Perfil Térmico →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: THERMAL ZONES */}
          {activeStep === 'thermal' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Ajuste de Setpoint vs Temperatura Real por Zona (°C). El sistema calcula la desviación.
                  </span>
                </div>
              </div>

              {/* Zones table */}
              <div className="space-y-2">
                {thermalZones.map((zone, idx) => {
                  const delta = zone.actualTemp - zone.targetTemp;
                  const absDelta = Math.abs(delta);
                  const isHighDev = absDelta > 5;
                  const isMedDev = absDelta > 2 && absDelta <= 5;

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition ${
                        isHighDev
                          ? 'bg-rose-950/20 border-rose-500/50'
                          : isMedDev
                          ? 'bg-amber-950/20 border-amber-500/50'
                          : 'bg-slate-850/70 border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-[160px]">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-semibold text-slate-200 block truncate">
                            {zone.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {idx === 0 ? 'Entrada / Tolva' : idx === thermalZones.length - 1 ? 'Hilera / Boquilla' : 'Cilindro'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Target Temp */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400">Setpoint:</span>
                          <input
                            type="number"
                            value={zone.targetTemp}
                            onChange={(e) =>
                              handleUpdateZone(idx, 'targetTemp', parseFloat(e.target.value) || 0)
                            }
                            className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-center font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                          <span className="text-xs text-slate-400">°C</span>
                        </div>

                        {/* Actual Temp */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400 font-medium">Real:</span>
                          <input
                            type="number"
                            value={zone.actualTemp}
                            onChange={(e) =>
                              handleUpdateZone(idx, 'actualTemp', parseFloat(e.target.value) || 0)
                            }
                            className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-center font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                          />
                          <span className="text-xs text-slate-400">°C</span>
                        </div>

                        {/* Delta indicator */}
                        <div className="w-14 text-right font-mono text-xs font-semibold">
                          {delta === 0 ? (
                            <span className="text-emerald-400">±0°</span>
                          ) : delta > 0 ? (
                            <span className={isHighDev ? 'text-rose-400' : 'text-amber-400'}>
                              +{delta}°
                            </span>
                          ) : (
                            <span className={isHighDev ? 'text-rose-400' : 'text-cyan-400'}>
                              {delta}°
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep('general')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveStep('process');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-950 cursor-pointer"
                >
                  Siguiente: Parámetros de Proceso →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MECHANICAL & PROCESS PARAMETERS */}
          {activeStep === 'process' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {isHighPressure && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs flex items-center gap-2.5 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <strong className="block font-bold">ALERTA DE PRESIÓN ELEVADA ({currentPressure} bar)</strong>
                    <span>
                      Presión superior al límite de seguridad (230 bar). Riesgo de sobrecarga de motor o malla saturada.
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Screw RPM */}
                <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/60">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Velocidad Husillo (RPM) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={screwRpm}
                      onChange={(e) => setScrewRpm(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-300 font-bold font-mono focus:outline-none focus:border-cyan-500"
                      required
                    />
                    <span className="text-xs text-slate-400 font-medium">RPM</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Rango típico: 15 - 90 RPM</span>
                </div>

                {/* Motor Amperage */}
                <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/60">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Amperaje Motor Principal (A)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={motorAmps}
                      onChange={(e) => setMotorAmps(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-xs text-slate-400 font-medium">Amps</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Carga de par motor</span>
                </div>

                {/* Melt Pressure */}
                <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/60">
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Presión de Masa (bar) *</span>
                    {isHighPressure && <span className="text-[10px] text-rose-400 font-bold">ALTA</span>}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={meltPressureBar}
                      onChange={(e) => setMeltPressureBar(e.target.value)}
                      className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-sm font-bold font-mono focus:outline-none ${
                        isHighPressure
                          ? 'border-rose-500 text-rose-400 bg-rose-950/20'
                          : 'border-slate-700 text-amber-300 focus:border-cyan-500'
                      }`}
                      required
                    />
                    <span className="text-xs text-slate-400 font-medium">bar</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Sensor frente a rompedor de flujo</span>
                </div>

                {/* Melt Temperature */}
                <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/60">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Temperatura de Masa Fundida (°C)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      value={meltTempC}
                      onChange={(e) => setMeltTempC(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-300 font-bold font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-xs text-slate-400 font-medium">°C</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Termopar de inmersión en fundido</span>
                </div>

                {/* Haul-off speed */}
                <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/60">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Velocidad Arrastre / Tirador (m/min)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={haulOffSpeedMpm}
                      onChange={(e) => setHaulOffSpeedMpm(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-xs text-slate-400 font-medium">m/min</span>
                  </div>
                </div>

                {/* Cooling Water Temp */}
                <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/60">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Temp. Agua Enfriamiento Tina (°C)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      value={coolingWaterTempC}
                      onChange={(e) => setCoolingWaterTempC(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-xs text-slate-400 font-medium">°C</span>
                  </div>
                </div>

                {/* Vacuum pressure */}
                <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/60 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vacío en Tanque de Calibración (bar / kPa)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.05"
                      value={vacuumPressureBar}
                      onChange={(e) => setVacuumPressureBar(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-xs text-slate-400 font-medium">bar</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep('thermal')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveStep('quality');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-950 cursor-pointer"
                >
                  Siguiente: Calidad y Producción →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: QUALITY, SCRAP & OBSERVATIONS */}
          {activeStep === 'quality' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Dimensional measurements */}
              <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/60 space-y-3">
                <span className="text-xs font-semibold text-slate-200 block">
                  Control Dimensional (Espesores y Diámetro)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Espesor Mín (mm)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={wallThicknessMinMm}
                      onChange={(e) => setWallThicknessMinMm(e.target.value)}
                      placeholder="2.90"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Espesor Nominal</label>
                    <input
                      type="number"
                      step="0.01"
                      value={wallThicknessNominalMm}
                      onChange={(e) => setWallThicknessNominalMm(e.target.value)}
                      placeholder="3.00"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Espesor Máx (mm)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={wallThicknessMaxMm}
                      onChange={(e) => setWallThicknessMaxMm(e.target.value)}
                      placeholder="3.10"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Diámetro Exterior (mm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={outerDiameterMm}
                      onChange={(e) => setOuterDiameterMm(e.target.value)}
                      placeholder="32.0"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Peso / Metro Lineal (g/m)</label>
                    <input
                      type="number"
                      step="1"
                      value={weightPerMeterG}
                      onChange={(e) => setWeightPerMeterG(e.target.value)}
                      placeholder="285"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Quality Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Inspección y Aspecto Visual
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Excelente', 'Aceptable', 'Con Observaciones', 'Rechazado'] as const).map((q) => {
                    const isSelected = visualQuality === q;
                    const color =
                      q === 'Excelente'
                        ? 'border-emerald-500 text-emerald-300 bg-emerald-950/30'
                        : q === 'Aceptable'
                        ? 'border-cyan-500 text-cyan-300 bg-cyan-950/30'
                        : q === 'Con Observaciones'
                        ? 'border-amber-500 text-amber-300 bg-amber-950/30'
                        : 'border-rose-500 text-rose-300 bg-rose-950/30';

                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setVisualQuality(q);
                        }}
                        className={`p-2 rounded-xl border text-xs font-medium text-center transition cursor-pointer ${
                          isSelected ? `${color} ring-1 ring-white/20 font-bold` : 'bg-slate-800/60 border-slate-700 text-slate-400'
                        }`}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Machine Status */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Estado Operativo de la Línea
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {(
                    [
                      { id: 'running', label: 'En Marcha', color: 'border-emerald-500 text-emerald-300' },
                      { id: 'purging', label: 'Purgando', color: 'border-amber-500 text-amber-300' },
                      { id: 'idle', label: 'En Espera', color: 'border-slate-500 text-slate-300' },
                      { id: 'maintenance', label: 'Mantenimiento', color: 'border-rose-500 text-rose-300' },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setMachineStatus(st.id);
                      }}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer font-medium ${
                        machineStatus === st.id
                          ? `${st.color} bg-slate-800 shadow-sm`
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output & Scrap */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Kg Producidos
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={producedKg}
                    onChange={(e) => setProducedKg(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Metros Fabricados
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={producedMeters}
                    onChange={(e) => setProducedMeters(e.target.value)}
                    placeholder="1200"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Merma / Purga (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={scrapKg}
                    onChange={(e) => setScrapKg(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Photo attachment (Defect / Product) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Fotografía de Muestra / Defecto (Opcional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-2 cursor-pointer transition"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>{photoUrl ? 'Cambiar Foto' : 'Tomar / Adjuntar Foto'}</span>
                  </button>

                  {photoUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={photoUrl}
                        alt="Foto muestra"
                        className="w-10 h-10 object-cover rounded-lg border border-cyan-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Observaciones / Incidencias del Turno
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Cambio de bobina realizado a las 11:30. Presión de cabezal estable sin variaciones."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep('process')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  ← Anterior
                </button>
              </div>
            </div>
          )}

          {/* Footer Save Button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editLog ? 'Actualizar Registro' : 'Guardar Datos de Extrusión'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
