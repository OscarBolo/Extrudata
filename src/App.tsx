/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ExtrusionMachine,
  ExtrusionLog,
  MachinePreset,
  PipeProduct,
  MachineStatus,
} from './types/extrusion';
import { StorageService, triggerHaptic, playIndustrialBeep } from './services/storage';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidBottomNav, TabId } from './components/AndroidBottomNav';
import { HomeSelectionView } from './components/HomeSelectionView';
import { SavedDataView } from './components/SavedDataView';
import { MachinePickerModal } from './components/MachinePickerModal';
import { PipePickerModal } from './components/PipePickerModal';
import { NewProductModal } from './components/NewProductModal';
import { MachinesView } from './components/MachinesView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { LogFormModal } from './components/LogFormModal';
import { LogDetailModal } from './components/LogDetailModal';
import { MachineManagerModal } from './components/MachineManagerModal';
import { PresetsModal } from './components/PresetsModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { Cpu, WifiOff, RefreshCw } from 'lucide-react';

export default function App() {
  // App opens directly on 'home' showing the two options: Machine & Pipe!
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [machines, setMachines] = useState<ExtrusionMachine[]>([]);
  const [products, setProducts] = useState<PipeProduct[]>([]);
  const [logs, setLogs] = useState<ExtrusionLog[]>([]);
  const [presets, setPresets] = useState<MachinePreset[]>([]);
  const [operators, setOperators] = useState<string[]>([]);

  // Selection states
  const [selectedMachineId, setSelectedMachineId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Modals for picking machine and pipe
  const [isMachinePickerOpen, setIsMachinePickerOpen] = useState(false);
  const [isPipePickerOpen, setIsPipePickerOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Preferences
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [phoneFrameMode, setPhoneFrameMode] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Log Form Modal
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);
  const [editLog, setEditLog] = useState<ExtrusionLog | null>(null);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<ExtrusionLog | null>(null);

  // Machine Management Modal
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
  const [editMachine, setEditMachine] = useState<ExtrusionMachine | null>(null);

  // Presets Modal
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);

  // Load data on mount
  const refreshData = () => {
    const loadedMachines = StorageService.getMachines();
    const loadedProducts = StorageService.getProducts();
    const loadedLogs = StorageService.getLogs();
    const loadedPresets = StorageService.getPresets();
    const loadedOperators = StorageService.getOperators();

    setMachines(loadedMachines);
    setProducts(loadedProducts);
    setLogs(loadedLogs);
    setPresets(loadedPresets);
    setOperators(loadedOperators);

    // Active selection from storage if user already picked one
    const activeSel = StorageService.getActiveSelection();
    if (activeSel && loadedMachines.some((m) => m.id === activeSel.machineId) && loadedProducts.some((p) => p.id === activeSel.productId)) {
      setSelectedMachineId(activeSel.machineId);
      setSelectedProductId(activeSel.productId);
    } else {
      setSelectedMachineId('');
      setSelectedProductId('');
    }
  };

  useEffect(() => {
    refreshData();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (window.innerWidth < 640) {
      setPhoneFrameMode(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSelectMachine = (machId: string) => {
    setSelectedMachineId(machId);
    StorageService.setActiveSelection({
      machineId: machId,
      productId: selectedProductId || (products[0]?.id ?? ''),
    });
  };

  const handleSelectProduct = (prodId: string) => {
    setSelectedProductId(prodId);
    StorageService.setActiveSelection({
      machineId: selectedMachineId || (machines[0]?.id ?? ''),
      productId: prodId,
    });
  };

  // Handlers for Logs
  const handleSaveLog = (savedLog: ExtrusionLog) => {
    if (editLog) {
      StorageService.updateLog(savedLog);
    } else {
      StorageService.addLog(savedLog);
    }
    refreshData();
    setEditLog(null);
  };

  const handleDeleteLog = (id: string) => {
    StorageService.deleteLog(id);
    refreshData();
    if (selectedLogForDetail?.id === id) {
      setSelectedLogForDetail(null);
    }
  };

  // Handlers for Machines
  const handleSaveMachine = (savedMachine: ExtrusionMachine) => {
    if (editMachine) {
      StorageService.updateMachine(savedMachine);
    } else {
      StorageService.addMachine(savedMachine);
    }
    refreshData();
    setEditMachine(null);
  };

  const handleDeleteMachine = (id: string) => {
    StorageService.deleteMachine(id);
    refreshData();
  };

  const handleUpdateMachineStatus = (machine: ExtrusionMachine, newStatus: MachineStatus) => {
    triggerHaptic('light');
    const updated = { ...machine, status: newStatus };
    StorageService.updateMachine(updated);
    refreshData();
  };

  // Handlers for Products
  const handleSaveProduct = (product: PipeProduct) => {
    StorageService.addProduct(product);
    refreshData();
    setSelectedProductId(product.id);
    StorageService.setActiveSelection({
      machineId: selectedMachineId || (machines[0]?.id ?? ''),
      productId: product.id,
    });
  };

  const activeAlarmsCount = logs.filter((l) => l.alarmTriggered).length;

  const currentMachine = machines.find((m) => m.id === selectedMachineId);
  const currentProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Offline Banner if disconnected */}
      {!isOnline && (
        <div className="w-full bg-amber-600 text-slate-950 px-3 py-1 text-center text-xs font-bold flex items-center justify-center gap-2 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Modo Sin Conexión — Los datos se guardan en el almacenamiento local de Android</span>
        </div>
      )}

      {/* Main Container / Phone Mockup Wrapper */}
      <div
        className={`w-full flex flex-col transition-all duration-300 min-h-screen ${
          phoneFrameMode
            ? 'max-w-[430px] my-0 sm:my-4 rounded-none sm:rounded-[40px] border-0 sm:border-[8px] sm:border-slate-800 shadow-2xl overflow-hidden bg-slate-950 ring-1 ring-slate-700/50'
            : 'max-w-4xl'
        }`}
      >
        {/* Android Device Status Bar */}
        <AndroidStatusBar
          activeAlarmsCount={activeAlarmsCount}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            triggerHaptic('light');
            setSoundEnabled((prev) => !prev);
          }}
          phoneFrameMode={phoneFrameMode}
          onTogglePhoneFrame={() => {
            triggerHaptic('medium');
            setPhoneFrameMode((prev) => !prev);
          }}
        />

        {/* Top App Bar Header */}
        <header className="px-4 py-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-0.5 shadow-md shadow-cyan-950 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold tracking-tight text-white">ExtruData</h1>
                <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AND-PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[170px] sm:max-w-xs">
                {currentMachine && currentProduct
                  ? `${currentMachine.code} • Ø${currentProduct.diameterMm}mm`
                  : 'Elección de Máquina y Tubo'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('home');
              }}
              title="Volver a elección inicial"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Elegir Puesto</span>
            </button>
            <PWAInstallButton compact />
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-3 sm:p-5 overflow-y-auto">
          {/* 1. ENTRANCE SCREEN: 2 OPTIONS (ELEGIR MÁQUINA Y ELEGIR TUBO) */}
          {activeTab === 'home' && (
            <HomeSelectionView
              selectedMachine={currentMachine}
              selectedProduct={currentProduct}
              onOpenMachinePicker={() => setIsMachinePickerOpen(true)}
              onOpenProductPicker={() => setIsPipePickerOpen(true)}
              onConfirmViewData={() => setActiveTab('saved_data')}
              onOpenHistory={() => setActiveTab('history')}
              onOpenSettings={() => setActiveTab('settings')}
            />
          )}

          {/* 2. SAVED DATA VIEW (FICHA TÉCNICA Y REGISTROS GUARDADOS DE ESA MÁQUINA Y TUBO) */}
          {activeTab === 'saved_data' && currentMachine && currentProduct && (
            <SavedDataView
              machine={currentMachine}
              product={currentProduct}
              logs={logs}
              onBackToHome={() => setActiveTab('home')}
              onOpenNewLog={() => {
                setEditLog(null);
                setIsLogFormOpen(true);
              }}
              onSelectLog={(log) => setSelectedLogForDetail(log)}
            />
          )}

          {/* 3. MACHINES VIEW */}
          {activeTab === 'machines' && (
            <MachinesView
              machines={machines}
              logs={logs}
              onOpenNewMachineModal={() => {
                setEditMachine(null);
                setIsMachineModalOpen(true);
              }}
              onEditMachine={(m) => {
                setEditMachine(m);
                setIsMachineModalOpen(true);
              }}
              onDeleteMachine={handleDeleteMachine}
              onUpdateStatus={handleUpdateMachineStatus}
              onOpenNewLog={(machId) => {
                setSelectedMachineId(machId);
                setEditLog(null);
                setIsLogFormOpen(true);
              }}
              onSelectLog={(log) => setSelectedLogForDetail(log)}
            />
          )}

          {/* 4. HISTORY VIEW */}
          {activeTab === 'history' && (
            <HistoryView
              logs={logs}
              machines={machines}
              onSelectLog={(log) => setSelectedLogForDetail(log)}
              onOpenNewLog={() => {
                setEditLog(null);
                setIsLogFormOpen(true);
              }}
            />
          )}

          {/* 5. SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <SettingsView
              onOpenPresetsModal={() => setIsPresetsModalOpen(true)}
              onRefreshData={refreshData}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled((prev) => !prev)}
              phoneFrameMode={phoneFrameMode}
              onTogglePhoneFrame={() => setPhoneFrameMode((prev) => !prev)}
            />
          )}
        </main>

        {/* Fixed Android Bottom Navigation Bar */}
        <div className="sticky bottom-0 z-30">
          <AndroidBottomNav
            activeTab={activeTab}
            onChangeTab={(t) => setActiveTab(t)}
            onOpenNewLogModal={() => {
              setEditLog(null);
              setIsLogFormOpen(true);
            }}
            unreadCount={activeAlarmsCount}
          />
        </div>
      </div>

      {/* Modal 1: Machine Picker */}
      <MachinePickerModal
        isOpen={isMachinePickerOpen}
        onClose={() => setIsMachinePickerOpen(false)}
        machines={machines}
        selectedMachineId={selectedMachineId}
        onSelectMachine={handleSelectMachine}
        onOpenNewMachine={() => {
          setEditMachine(null);
          setIsMachineModalOpen(true);
        }}
      />

      {/* Modal 2: Pipe / Corrugated Picker */}
      <PipePickerModal
        isOpen={isPipePickerOpen}
        onClose={() => setIsPipePickerOpen(false)}
        products={products}
        selectedProductId={selectedProductId}
        onSelectProduct={handleSelectProduct}
        onOpenNewProduct={() => setIsNewProductModalOpen(true)}
      />

      {/* Modal 3: Create Custom New Pipe / Corrugated */}
      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onSaveProduct={handleSaveProduct}
      />

      {/* Log Form Modal for recording shift data */}
      <LogFormModal
        isOpen={isLogFormOpen}
        onClose={() => {
          setIsLogFormOpen(false);
          setEditLog(null);
        }}
        onSave={handleSaveLog}
        machines={machines}
        presets={presets}
        operators={operators}
        initialMachineId={selectedMachineId}
        initialProductId={selectedProductId}
        products={products}
        editLog={editLog}
        soundEnabled={soundEnabled}
      />

      {/* Log Detail Modal */}
      <LogDetailModal
        log={selectedLogForDetail}
        onClose={() => setSelectedLogForDetail(null)}
        onEdit={(log) => {
          setEditLog(log);
          setIsLogFormOpen(true);
        }}
        onDelete={handleDeleteLog}
      />

      {/* Machine Manager Modal */}
      <MachineManagerModal
        isOpen={isMachineModalOpen}
        onClose={() => {
          setIsMachineModalOpen(false);
          setEditMachine(null);
        }}
        onSave={handleSaveMachine}
        editMachine={editMachine}
      />

      {/* Presets Modal */}
      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        presets={presets}
        onSavePresets={(updated) => {
          StorageService.savePresets(updated);
          refreshData();
        }}
      />
    </div>
  );
}
