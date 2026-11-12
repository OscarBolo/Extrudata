import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X, CheckCircle, Info } from 'lucide-react';
import { triggerHaptic } from '../services/storage';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>App Instalada</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    triggerHaptic('medium');
    if (isInstallable) {
      await install();
    } else {
      setShowAndroidGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar App en Android o escritorio"
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white shadow-lg shadow-emerald-950/40 font-medium transition cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm'
        }`}
      >
        <Smartphone className="w-4 h-4 shrink-0 text-emerald-200" />
        <span className="font-semibold">Instalar en Android</span>
        <Download className="w-3.5 h-3.5 shrink-0 opacity-80" />
      </button>

      {/* Modal with direct Android install instructions */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Instalar ExtruData en Android</h3>
                  <p className="text-xs text-slate-400">Acceso directo como app nativa</p>
                </div>
              </div>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex gap-2.5 items-start p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0">1</span>
                <p>En el navegador de tu móvil (Chrome en Android), pulsa el menú de <strong>tres puntos (⋮)</strong> arriba a la derecha.</p>
              </div>

              <div className="flex gap-2.5 items-start p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0">2</span>
                <p>Selecciona la opción <strong>&quot;Instalar aplicación&quot;</strong> o <strong>&quot;Agregar a la pantalla principal&quot;</strong>.</p>
              </div>

              <div className="flex gap-2.5 items-start p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0">3</span>
                <p>Se creará el icono de <strong>ExtruData</strong> en tu pantalla de inicio con funcionamiento offline y pantalla completa.</p>
              </div>

              {isIOS && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>En iPhone/iPad: pulsa el botón <strong>Compartir</strong> y luego <strong>&quot;Añadir a pantalla de inicio&quot;</strong>.</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAndroidGuide(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
