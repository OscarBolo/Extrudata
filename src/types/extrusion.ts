export type MachineStatus = 'running' | 'idle' | 'maintenance' | 'purging';

export type ShiftType = 'Mañana (06:00 - 14:00)' | 'Tarde (14:00 - 22:00)' | 'Noche (22:00 - 06:00)';

export type PolymerType = 
  | 'HDPE (Polietileno Alta Densidad)'
  | 'LDPE (Polietileno Baja Densidad)'
  | 'LLDPE (Lineal Baja Densidad)'
  | 'PP (Polipropileno)'
  | 'PVC Rígido'
  | 'PVC Flexible'
  | 'PET'
  | 'ABS'
  | 'PLA / Biodegradable'
  | 'PA (Poliamida / Nylon)'
  | 'Otro';

export interface ThermalZone {
  name: string; // ej. "Z1 (Alimentación)", "Z2 (Compresión)", "Z3 (Dosificación)", "Adaptador", "Cabezal 1"
  targetTemp: number; // °C
  actualTemp: number; // °C
}

export interface ExtrusionMachine {
  id: string;
  code: string; // ej. "EXT-01"
  name: string; // ej. "Extrusora Monohusillo Bandera 75mm"
  type: 'Tubería y Perfiles' | 'Película Soplada (Blown Film)' | 'Monofilamento / 3D' | 'Lámina / Placa' | 'Recubrimiento de Cable' | 'Peletizado / Granceado';
  location: string; // ej. "Nave 2 - Línea 4"
  screwDiameterMm: number; // ej. 75
  ldRatio: string; // ej. "30D"
  zoneCount: number; // ej. 5 a 8 zonas
  defaultZones: string[];
  status: MachineStatus;
  currentProduct?: string;
  notes?: string;
}

export interface ExtrusionLog {
  id: string;
  timestamp: string; // ISO string
  machineId: string;
  machineCode: string;
  machineName: string;
  
  // Turno y Personal
  shift: ShiftType;
  operatorName: string;
  supervisorName?: string;

  // Lote y Producto
  orderNumber: string; // Orden de Producción
  batchNumber: string; // Lote de materia prima
  productDescription: string;
  polymerType: PolymerType;
  polymerGrade: string; // ej. Sabic B5429
  masterbatchColor?: string; // ej. Azul Real
  masterbatchPercent?: number; // ej. 2.0%
  regrindPercent?: number; // ej. 15% material molido
  
  // Perfil Térmico
  thermalZones: ThermalZone[];
  
  // Parámetros Mecánicos y de Proceso
  screwRpm: number; // RPM del husillo
  motorAmps: number; // Amperaje del motor (A)
  motorLoadPercent?: number; // Carga del motor %
  meltPressureBar: number; // Presión de masa (bar)
  meltTempC: number; // Temp de masa (°C)
  haulOffSpeedMpm?: number; // Velocidad arrastre / tirador (m/min)
  coolingWaterTempC?: number; // Temp agua de tina (°C)
  vacuumPressureBar?: number; // Vacío tanque de calibración (-bar o kPa)
  
  // Control de Calidad y Dimensiones
  wallThicknessMinMm?: number; // Espesor mín
  wallThicknessMaxMm?: number; // Espesor máx
  wallThicknessNominalMm?: number; // Espesor objetivo
  outerDiameterMm?: number; // Diámetro exterior
  weightPerMeterG?: number; // Peso metro lineal (g/m)
  visualQuality: 'Excelente' | 'Aceptable' | 'Con Observaciones' | 'Rechazado';
  qualityNotes?: string;

  // Rendimiento y Producción
  producedKg: number;
  producedMeters?: number;
  scrapKg: number; // Merma / purga

  // Estado e incidencias
  machineStatus: MachineStatus;
  alarmTriggered?: boolean;
  alarmMessage?: string;
  notes?: string;
  photoUrl?: string; // Data URL for attached inspection photo
}

export interface PipeProduct {
  id: string;
  name: string; // ej. "Tubo Corrugado Eléctrico Ø25mm"
  code: string; // ej. "CORR-25-ELEC"
  category: 'Tubo Corrugado' | 'Tubo Liso' | 'Perfil Especial';
  diameterMm: number; // Diámetro exterior nominal
  innerDiameterMm?: number; // Diámetro interior
  polymerType: PolymerType;
  color: string;
  standardNorm?: string; // ej. "UNE-EN 61386-22" o "ISO 4427"
  targetThicknessMm?: number; // Para tubo liso
  corrugationPitchMm?: number; // Paso de corruga para corrugado
  nominalWeightGm?: number; // Peso nominal g/m
  defaultRpm?: number;
  defaultPressureBar?: number;
  defaultMeltTempC?: number;
  defaultSpeedMpm?: number;
  defaultVacuumBar?: number;
  defaultWaterTempC?: number;
  recommendedZones?: ThermalZone[];
  notes?: string;
}

export interface MachinePreset {
  id: string;
  name: string; // ej. "Tubo HDPE SDR 11 - 32mm"
  polymerType: PolymerType;
  recommendedZones: ThermalZone[];
  recommendedRpm: number;
  recommendedPressureBar: number;
  notes: string;
}

