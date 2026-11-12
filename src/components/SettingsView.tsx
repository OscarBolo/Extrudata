import React, { useRef, useState } from 'react';
import { StorageService, triggerHaptic } from '../services/storage';
import { PWAInstallButton } from './PWAInstallButton';
import {
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Sparkles,
  Smartphone,
  Shield,
  Layers,
  Database,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  onOpenPresetsModal: () => void;
  onRefreshData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  phoneFrameMode: boolean;
  onTogglePhoneFrame: () => void;
}

export const SettingsView: React.FC<Props> = ({
  onOpenPresetsModal,
  onRefreshData,
  soundEnabled,
  onToggleSound,
  phoneFrameMode,
  onTogglePhoneFrame,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExportCSV = () => {
    triggerHaptic('success');
    StorageService.downloadCSV();
    showToast('Archivo CSV descargado listo para Microsoft Excel.');
  };

  const handleExportJSON = () => {
    triggerHaptic('success');
    StorageService.exportBackupJSON();
    showToast('Copia de seguridad JSON descargada.');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const res = StorageService.importBackupJSON(content);
        if (res.success) {
          triggerHaptic('success');
          showToast(res.message);
          onRefreshData();
        } else {
          triggerHaptic('error');
          alert(res.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Restablecer datos a valores de fábrica iniciales? Se conservarán las máquinas de muestra.')) {
      triggerHaptic('warning');
      StorageService.resetToDefaults();
      onRefreshData();
      showToast('Datos reiniciados a valores por defecto.');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Toast feedback */}
      {toastMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-full shadow-2xl text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          Ajustes, Datos y Exportación
        </h2>
        <p className="text-xs text-slate-400">
          Gestión de recetas, copias de seguridad y opciones de Android
        </p>
      </div>

      {/* PWA Android Install Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Instalar App en Dispositivo Android</h3>
            <p className="text-xs text-slate-300">
              Guarda la app directamente en el móvil para usarla sin conexión a internet en la planta.
            </p>
          </div>
        </div>
        <PWAInstallButton />
      </div>

      {/* Recetas / Fórmulas */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Fórmulas y Recetas de Proceso</h3>
              <p className="text-xs text-slate-400">Parámetros predeterminados para HDPE, LDPE, PVC, etc.</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenPresetsModal();
            }}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition cursor-pointer"
          >
            Gestionar
          </button>
        </div>
      </div>

      {/* Export & Data Management */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-200 block">
          Exportación de Registros y Auditoría
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Export to Excel */}
          <button
            onClick={handleExportCSV}
            className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-between text-left transition cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-xs text-white block">Exportar a Excel (CSV)</span>
                <span className="text-[10px] text-slate-400">Compatible con Microsoft Excel / Sheets</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          {/* Backup to JSON */}
          <button
            onClick={handleExportJSON}
            className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-between text-left transition cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-xs text-white block">Descargar Backup (JSON)</span>
                <span className="text-[10px] text-slate-400">Guarda máquinas, registros y presets</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          {/* Import JSON */}
          <div className="sm:col-span-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-between text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-white block">Restaurar Copia de Seguridad</span>
                  <span className="text-[10px] text-slate-400">Cargar archivo de respaldo JSON</span>
                </div>
              </div>
              <Upload className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Device & Experience Preferences */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-200 block">
          Preferencias de Interfaz Android
        </span>

        <div className="space-y-2">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-850/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <span className="text-xs font-semibold text-white block">Señales Acústicas Industriales</span>
                <span className="text-[10px] text-slate-400">Sonido al guardar y pitido de advertencia en sobrepresión</span>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundEnabled ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Phone Frame Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-850/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Marco de Teléfono Android</span>
                <span className="text-[10px] text-slate-400">Simulador de smartphone con dimensiones móviles 9:19</span>
              </div>
            </div>
            <button
              onClick={onTogglePhoneFrame}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                phoneFrameMode ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  phoneFrameMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-4 rounded-2xl bg-rose-950/15 border border-rose-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <RotateCcw className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <span className="text-xs font-semibold text-rose-300 block">Restablecer Aplicación</span>
            <span className="text-[10px] text-slate-400">Restaurar máquinas y registros de fábrica</span>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition cursor-pointer"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
};
