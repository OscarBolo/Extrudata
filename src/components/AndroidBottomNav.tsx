import React from 'react';
import {
  Home,
  Sliders,
  PlusCircle,
  ClipboardList,
  Layers,
  FolderSync,
} from 'lucide-react';
import { triggerHaptic } from '../services/storage';

export type TabId = 'home' | 'saved_data' | 'history' | 'machines' | 'settings';

interface Props {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  onOpenNewLogModal: () => void;
  unreadCount?: number;
}

export const AndroidBottomNav: React.FC<Props> = ({
  activeTab,
  onChangeTab,
  onOpenNewLogModal,
  unreadCount = 0,
}) => {
  const handleTabClick = (tab: TabId) => {
    triggerHaptic('light');
    onChangeTab(tab);
  };

  const handleFabClick = () => {
    triggerHaptic('medium');
    onOpenNewLogModal();
  };

  const items: { id: TabId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'saved_data', label: 'Datos Guardados', icon: Sliders },
    { id: 'history', label: 'Historial', icon: ClipboardList },
    { id: 'machines', label: 'Máquinas', icon: Layers },
    { id: 'settings', label: 'Ajustes', icon: FolderSync },
  ];

  return (
    <div className="relative w-full bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-md pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2 relative">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <React.Fragment key={item.id}>
              {/* Central Floating "+ Registrar" Button */}
              {index === 2 && (
                <div className="flex flex-col items-center -mt-6">
                  <button
                    onClick={handleFabClick}
                    className="w-13 h-13 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-0.5 shadow-xl shadow-cyan-950/80 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer border-2 border-slate-900 group"
                    title="Nuevo Registro de Parámetros"
                  >
                    <PlusCircle className="w-8 h-8 group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                  <span className="text-[10px] font-bold text-cyan-400 mt-0.5 tracking-tight">
                    + Registrar
                  </span>
                </div>
              )}

              <button
                onClick={() => handleTabClick(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors cursor-pointer ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {isActive && (
                  <span className="absolute top-1 w-8 h-1 bg-cyan-400 rounded-full"></span>
                )}
                <div className="relative mt-1">
                  <Icon className="w-5 h-5" />
                  {item.id === 'history' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-cyan-500 text-slate-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium mt-1 truncate max-w-[64px] ${isActive ? 'font-bold text-slate-100' : ''}`}>
                  {item.label}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
