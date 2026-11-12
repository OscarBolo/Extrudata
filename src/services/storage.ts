import {
  ExtrusionMachine,
  ExtrusionLog,
  MachinePreset,
  PipeProduct,
} from '../types/extrusion';

const STORAGE_KEY_MACHINES = 'extrudata_machines_v2';
const STORAGE_KEY_LOGS = 'extrudata_logs_v2';
const STORAGE_KEY_PRESETS = 'extrudata_presets_v2';
const STORAGE_KEY_OPERATORS = 'extrudata_operators_v2';
const STORAGE_KEY_PRODUCTS = 'extrudata_products_v2';
const STORAGE_KEY_SELECTION = 'extrudata_selection_v2';

export const DEFAULT_MACHINES: ExtrusionMachine[] = [
  {
    id: 'mach-1',
    code: 'EXT-01',
    name: 'Línea Tubería HDPE 75mm',
    type: 'Tubería y Perfiles',
    location: 'Nave Central - Puesto 1',
    screwDiameterMm: 75,
    ldRatio: '30D',
    zoneCount: 7,
    defaultZones: [
      'Z1 (Alimentación)',
      'Z2 (Compresión)',
      'Z3 (Dosificación)',
      'Z4 (Homogeneización)',
      'Adaptador / Filtro',
      'Cabezal Zona 1',
      'Hilera / Dado',
    ],
    status: 'running',
    currentProduct: 'Tubo HDPE Ø32mm SDR 11 PN16',
    notes: 'Husillo barrera con mezclador Maddock. Calibrador por vacío en tina.',
  },
  {
    id: 'mach-2',
    code: 'EXT-02',
    name: 'Corrugadora Rápida Eléctrica 50mm',
    type: 'Tubería y Perfiles',
    location: 'Nave Corrugado - Puesto 2',
    screwDiameterMm: 50,
    ldRatio: '28D',
    zoneCount: 6,
    defaultZones: [
      'Z1 (Alimentación)',
      'Z2 (Plastificación)',
      'Z3 (Medición)',
      'Cuello Extrusión',
      'Cabezal Angular',
      'Bloques Formadores Corruga',
    ],
    status: 'running',
    currentProduct: 'Tubo Corrugado Eléctrico Ø25mm con Guía',
    notes: 'Bloques de corrugado refrigerados por agua y vacío interno continuo.',
  },
  {
    id: 'mach-3',
    code: 'EXT-03',
    name: 'Corrugadora Doble Pared 90mm',
    type: 'Tubería y Perfiles',
    location: 'Nave Saneamiento - Puesto 3',
    screwDiameterMm: 90,
    ldRatio: '32D',
    zoneCount: 7,
    defaultZones: [
      'Z1 (Tolva Ext. Interior)',
      'Z2 (Tolva Ext. Exterior)',
      'Z3 (Compresión Capa Doble)',
      'Cámara de Mezcla',
      'Cabezal Coextrusión',
      'Formador Ondas SN4',
      'Manga de Enfriamiento',
    ],
    status: 'running',
    currentProduct: 'Corrugado Sanitario Doble Pared Ø110mm SN4',
    notes: 'Coextrusión de pared interior lisa y exterior corrugada.',
  },
  {
    id: 'mach-4',
    code: 'EXT-04',
    name: 'Doble Husillo Cónico PVC 65mm',
    type: 'Tubería y Perfiles',
    location: 'Nave PVC - Puesto 4',
    screwDiameterMm: 65,
    ldRatio: '22D',
    zoneCount: 6,
    defaultZones: [
      'Z1 (Tolva Entrada)',
      'Z2 (Desgasificado Vacío)',
      'Z3 (Zona Alta Presión)',
      'Adaptador',
      'Cuerpo Cabezal',
      'Mandril / Labios Calibrados',
    ],
    status: 'idle',
    currentProduct: 'Tubo PVC Presión Ø50mm Encolar',
    notes: 'Doble tornillo contrarrotante. Control estricto de temperatura máxima 190°C.',
  },
];

export const DEFAULT_PRODUCTS: PipeProduct[] = [
  {
    id: 'prod-corr-25',
    name: 'Tubo Corrugado Eléctrico Ø25mm con Guía',
    code: 'CORR-ELEC-25',
    category: 'Tubo Corrugado',
    diameterMm: 25,
    innerDiameterMm: 19.5,
    polymerType: 'PP (Polipropileno)',
    color: 'Gris RAL 7035',
    standardNorm: 'UNE-EN 61386-22 (Curvable Ligero)',
    corrugationPitchMm: 3.5,
    nominalWeightGm: 42,
    defaultRpm: 58,
    defaultPressureBar: 155,
    defaultMeltTempC: 195,
    defaultSpeedMpm: 24.0,
    defaultVacuumBar: -0.45,
    defaultWaterTempC: 16.0,
    recommendedZones: [
      { name: 'Z1 (Alimentación)', targetTemp: 165, actualTemp: 165 },
      { name: 'Z2 (Plastificación)', targetTemp: 180, actualTemp: 180 },
      { name: 'Z3 (Medición)', targetTemp: 190, actualTemp: 190 },
      { name: 'Cuello Extrusión', targetTemp: 195, actualTemp: 195 },
      { name: 'Cabezal Angular', targetTemp: 195, actualTemp: 195 },
      { name: 'Bloques Formadores Corruga', targetTemp: 45, actualTemp: 45 },
    ],
    notes: 'Verificar tensión del hilo guía de acero e inserción continua en cabezal.',
  },
  {
    id: 'prod-corr-20',
    name: 'Tubo Corrugado Eléctrico Ø20mm',
    code: 'CORR-ELEC-20',
    category: 'Tubo Corrugado',
    diameterMm: 20,
    innerDiameterMm: 15.2,
    polymerType: 'PVC Flexible',
    color: 'Negro con Franja Blanca',
    standardNorm: 'UNE-EN 61386-22',
    corrugationPitchMm: 3.0,
    nominalWeightGm: 34,
    defaultRpm: 62,
    defaultPressureBar: 160,
    defaultMeltTempC: 175,
    defaultSpeedMpm: 28.0,
    defaultVacuumBar: -0.40,
    defaultWaterTempC: 16.5,
    recommendedZones: [
      { name: 'Z1 (Alimentación)', targetTemp: 155, actualTemp: 155 },
      { name: 'Z2 (Plastificación)', targetTemp: 165, actualTemp: 165 },
      { name: 'Z3 (Medición)', targetTemp: 172, actualTemp: 172 },
      { name: 'Cuello Extrusión', targetTemp: 175, actualTemp: 175 },
      { name: 'Cabezal Angular', targetTemp: 175, actualTemp: 175 },
      { name: 'Bloques Formadores Corruga', targetTemp: 40, actualTemp: 40 },
    ],
    notes: 'Alta flexibilidad para canalización bajo tubo y falso techo.',
  },
  {
    id: 'prod-corr-110-dp',
    name: 'Corrugado Sanitario Doble Pared Ø110mm SN4',
    code: 'CORR-DP-110',
    category: 'Tubo Corrugado',
    diameterMm: 110,
    innerDiameterMm: 95.0,
    polymerType: 'HDPE (Polietileno Alta Densidad)',
    color: 'Exterior Teja / Interior Blanco',
    standardNorm: 'UNE-EN 13476-3',
    corrugationPitchMm: 14.5,
    nominalWeightGm: 450,
    defaultRpm: 46,
    defaultPressureBar: 195,
    defaultMeltTempC: 208,
    defaultSpeedMpm: 4.8,
    defaultVacuumBar: -0.65,
    defaultWaterTempC: 15.0,
    recommendedZones: [
      { name: 'Z1 (Tolva Ext. Interior)', targetTemp: 175, actualTemp: 175 },
      { name: 'Z2 (Tolva Ext. Exterior)', targetTemp: 185, actualTemp: 185 },
      { name: 'Z3 (Compresión Capa Doble)', targetTemp: 195, actualTemp: 195 },
      { name: 'Cámara de Mezcla', targetTemp: 200, actualTemp: 200 },
      { name: 'Cabezal Coextrusión', targetTemp: 205, actualTemp: 205 },
      { name: 'Formador Ondas SN4', targetTemp: 208, actualTemp: 208 },
      { name: 'Manga de Enfriamiento', targetTemp: 22, actualTemp: 22 },
    ],
    notes: 'Revisar rigidez anular SN4 y soldadura homogénea entre pared lisa y corruga.',
  },
  {
    id: 'prod-corr-160-dren',
    name: 'Corrugado Drenaje Ranurado Ø160mm',
    code: 'CORR-DREN-160',
    category: 'Tubo Corrugado',
    diameterMm: 160,
    innerDiameterMm: 140.0,
    polymerType: 'HDPE (Polietileno Alta Densidad)',
    color: 'Negro con Ranuras Filtrantes',
    standardNorm: 'DIN 1187 Drenaje',
    corrugationPitchMm: 18.0,
    nominalWeightGm: 620,
    defaultRpm: 42,
    defaultPressureBar: 205,
    defaultMeltTempC: 210,
    defaultSpeedMpm: 3.6,
    defaultVacuumBar: -0.70,
    defaultWaterTempC: 15.5,
    recommendedZones: [
      { name: 'Z1 (Tolva Ext. Interior)', targetTemp: 175, actualTemp: 175 },
      { name: 'Z2 (Tolva Ext. Exterior)', targetTemp: 185, actualTemp: 185 },
      { name: 'Z3 (Compresión Capa Doble)', targetTemp: 195, actualTemp: 195 },
      { name: 'Cámara de Mezcla', targetTemp: 200, actualTemp: 200 },
      { name: 'Cabezal Coextrusión', targetTemp: 205, actualTemp: 205 },
      { name: 'Formador Ondas SN4', targetTemp: 210, actualTemp: 210 },
      { name: 'Manga de Enfriamiento', targetTemp: 20, actualTemp: 20 },
    ],
    notes: 'Comprobar paso de sierras perforadoras para evitar rebabas en ranuras.',
  },
  {
    id: 'prod-tubo-32',
    name: 'Tubo Liso HDPE Ø32mm SDR 11 PN16',
    code: 'TUBO-HDPE-32',
    category: 'Tubo Liso',
    diameterMm: 32,
    innerDiameterMm: 26.0,
    polymerType: 'HDPE (Polietileno Alta Densidad)',
    color: 'Negro con 4 Franjas Azules',
    standardNorm: 'ISO 4427 / UNE-EN 12201 (Agua Potable)',
    targetThicknessMm: 3.0,
    nominalWeightGm: 285,
    defaultRpm: 52,
    defaultPressureBar: 188,
    defaultMeltTempC: 206,
    defaultSpeedMpm: 8.5,
    defaultVacuumBar: -0.65,
    defaultWaterTempC: 17.5,
    recommendedZones: [
      { name: 'Z1 (Alimentación)', targetTemp: 175, actualTemp: 175 },
      { name: 'Z2 (Compresión)', targetTemp: 185, actualTemp: 185 },
      { name: 'Z3 (Dosificación)', targetTemp: 195, actualTemp: 195 },
      { name: 'Z4 (Homogeneización)', targetTemp: 200, actualTemp: 200 },
      { name: 'Adaptador / Filtro', targetTemp: 205, actualTemp: 205 },
      { name: 'Cabezal Zona 1', targetTemp: 205, actualTemp: 205 },
      { name: 'Hilera / Dado', targetTemp: 210, actualTemp: 210 },
    ],
    notes: 'Control continuo por ultrasonido de espesor mín 2.95mm y máx 3.10mm.',
  },
  {
    id: 'prod-tubo-63',
    name: 'Tubo Liso HDPE Ø63mm SDR 17 PN10',
    code: 'TUBO-HDPE-63',
    category: 'Tubo Liso',
    diameterMm: 63,
    innerDiameterMm: 55.4,
    polymerType: 'HDPE (Polietileno Alta Densidad)',
    color: 'Negro Franjas Azules',
    standardNorm: 'UNE-EN 12201',
    targetThicknessMm: 3.8,
    nominalWeightGm: 720,
    defaultRpm: 45,
    defaultPressureBar: 192,
    defaultMeltTempC: 208,
    defaultSpeedMpm: 4.2,
    defaultVacuumBar: -0.70,
    defaultWaterTempC: 17.0,
    recommendedZones: [
      { name: 'Z1 (Alimentación)', targetTemp: 175, actualTemp: 175 },
      { name: 'Z2 (Compresión)', targetTemp: 185, actualTemp: 185 },
      { name: 'Z3 (Dosificación)', targetTemp: 195, actualTemp: 195 },
      { name: 'Z4 (Homogeneización)', targetTemp: 200, actualTemp: 200 },
      { name: 'Adaptador / Filtro', targetTemp: 205, actualTemp: 205 },
      { name: 'Cabezal Zona 1', targetTemp: 205, actualTemp: 205 },
      { name: 'Hilera / Dado', targetTemp: 210, actualTemp: 210 },
    ],
    notes: 'Tubería de acometida general. Enfriamiento intensivo en cascada.',
  },
  {
    id: 'prod-pvc-50',
    name: 'Tubo PVC Presión Ø50mm Encolar PN10',
    code: 'TUBO-PVC-50',
    category: 'Tubo Liso',
    diameterMm: 50,
    innerDiameterMm: 45.2,
    polymerType: 'PVC Rígido',
    color: 'Gris Oscuro',
    standardNorm: 'UNE-EN 1452',
    targetThicknessMm: 2.4,
    nominalWeightGm: 560,
    defaultRpm: 24,
    defaultPressureBar: 210,
    defaultMeltTempC: 188,
    defaultSpeedMpm: 5.5,
    defaultVacuumBar: -0.55,
    defaultWaterTempC: 18.0,
    recommendedZones: [
      { name: 'Z1 (Tolva Entrada)', targetTemp: 160, actualTemp: 160 },
      { name: 'Z2 (Desgasificado Vacío)', targetTemp: 170, actualTemp: 170 },
      { name: 'Z3 (Zona Alta Presión)', targetTemp: 175, actualTemp: 175 },
      { name: 'Adaptador', targetTemp: 180, actualTemp: 180 },
      { name: 'Cuerpo Cabezal', targetTemp: 185, actualTemp: 185 },
      { name: 'Mandril / Labios Calibrados', targetTemp: 190, actualTemp: 190 },
    ],
    notes: 'No elevar la masa térmica por encima de 192°C para evitar quemado.',
  },
  {
    id: 'prod-pvc-110',
    name: 'Tubo PVC Sanitario Evacuación Ø110mm',
    code: 'TUBO-PVC-110',
    category: 'Tubo Liso',
    diameterMm: 110,
    innerDiameterMm: 104.0,
    polymerType: 'PVC Rígido',
    color: 'Gris Claro RAL 7037',
    standardNorm: 'UNE-EN 1329',
    targetThicknessMm: 3.0,
    nominalWeightGm: 1520,
    defaultRpm: 22,
    defaultPressureBar: 215,
    defaultMeltTempC: 189,
    defaultSpeedMpm: 3.2,
    defaultVacuumBar: -0.60,
    defaultWaterTempC: 18.5,
    recommendedZones: [
      { name: 'Z1 (Tolva Entrada)', targetTemp: 160, actualTemp: 160 },
      { name: 'Z2 (Desgasificado Vacío)', targetTemp: 170, actualTemp: 170 },
      { name: 'Z3 (Zona Alta Presión)', targetTemp: 175, actualTemp: 175 },
      { name: 'Adaptador', targetTemp: 180, actualTemp: 180 },
      { name: 'Cuerpo Cabezal', targetTemp: 185, actualTemp: 185 },
      { name: 'Mandril / Labios Calibrados', targetTemp: 190, actualTemp: 190 },
    ],
    notes: 'Control de abocardado con junta labiada o encolar.',
  },
];

export const DEFAULT_PRESETS: MachinePreset[] = [
  {
    id: 'preset-1',
    name: 'Tubo HDPE Presión PN16 (190°C-210°C)',
    polymerType: 'HDPE (Polietileno Alta Densidad)',
    recommendedZones: [
      { name: 'Z1 (Alimentación)', targetTemp: 175, actualTemp: 175 },
      { name: 'Z2 (Compresión)', targetTemp: 185, actualTemp: 185 },
      { name: 'Z3 (Dosificación)', targetTemp: 195, actualTemp: 195 },
      { name: 'Z4 (Homogeneización)', targetTemp: 200, actualTemp: 200 },
      { name: 'Adaptador / Filtro', targetTemp: 205, actualTemp: 205 },
      { name: 'Cabezal Zona 1', targetTemp: 205, actualTemp: 205 },
      { name: 'Hilera / Dado', targetTemp: 210, actualTemp: 210 },
    ],
    recommendedRpm: 48,
    recommendedPressureBar: 185,
    notes: 'Masa térmica estable. Presión máxima admisible en filtro: 240 bar.',
  },
  {
    id: 'preset-2',
    name: 'Tubo Corrugado Eléctrico PP (180°C-200°C)',
    polymerType: 'PP (Polipropileno)',
    recommendedZones: [
      { name: 'Z1 (Alimentación)', targetTemp: 165, actualTemp: 165 },
      { name: 'Z2 (Plastificación)', targetTemp: 180, actualTemp: 180 },
      { name: 'Z3 (Medición)', targetTemp: 190, actualTemp: 190 },
      { name: 'Cuello Extrusión', targetTemp: 195, actualTemp: 195 },
      { name: 'Cabezal Angular', targetTemp: 195, actualTemp: 195 },
      { name: 'Bloques Formadores Corruga', targetTemp: 45, actualTemp: 45 },
    ],
    recommendedRpm: 58,
    recommendedPressureBar: 155,
    notes: 'Asegurar vacío en bloques de corrugado para perfecta definición de cresta.',
  },
  {
    id: 'preset-3',
    name: 'Perfil y Tubo PVC Rígido (165°C-190°C)',
    polymerType: 'PVC Rígido',
    recommendedZones: [
      { name: 'Z1 (Tolva Entrada)', targetTemp: 160, actualTemp: 160 },
      { name: 'Z2 (Desgasificado Vacío)', targetTemp: 170, actualTemp: 170 },
      { name: 'Z3 (Zona Alta Presión)', targetTemp: 175, actualTemp: 175 },
      { name: 'Adaptador', targetTemp: 180, actualTemp: 180 },
      { name: 'Cuerpo Cabezal', targetTemp: 185, actualTemp: 185 },
      { name: 'Mandril / Labios Calibrados', targetTemp: 190, actualTemp: 190 },
    ],
    recommendedRpm: 24,
    recommendedPressureBar: 210,
    notes: 'No exceder 192°C para evitar degradación térmica.',
  },
];

export const DEFAULT_LOGS: ExtrusionLog[] = [
  {
    id: 'log-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    machineId: 'mach-2',
    machineCode: 'EXT-02',
    machineName: 'Corrugadora Rápida Eléctrica 50mm',
    shift: 'Mañana (06:00 - 14:00)',
    operatorName: 'Carlos Mendoza',
    supervisorName: 'Ing. Laura Valdés',
    orderNumber: 'OP-2026-CORR-88',
    batchNumber: 'LOTE-PP-4921',
    productDescription: 'Tubo Corrugado Eléctrico Ø25mm con Guía',
    polymerType: 'PP (Polipropileno)',
    polymerGrade: 'TotalEnergies PPC 7810',
    masterbatchColor: 'Gris RAL 7035',
    masterbatchPercent: 2.0,
    regrindPercent: 5,
    thermalZones: [
      { name: 'Z1 (Alimentación)', targetTemp: 165, actualTemp: 166 },
      { name: 'Z2 (Plastificación)', targetTemp: 180, actualTemp: 179 },
      { name: 'Z3 (Medición)', targetTemp: 190, actualTemp: 191 },
      { name: 'Cuello Extrusión', targetTemp: 195, actualTemp: 196 },
      { name: 'Cabezal Angular', targetTemp: 195, actualTemp: 195 },
      { name: 'Bloques Formadores Corruga', targetTemp: 45, actualTemp: 44 },
    ],
    screwRpm: 58,
    motorAmps: 48,
    motorLoadPercent: 71,
    meltPressureBar: 156,
    meltTempC: 196,
    haulOffSpeedMpm: 24.2,
    coolingWaterTempC: 16.0,
    vacuumPressureBar: -0.45,
    outerDiameterMm: 25.05,
    weightPerMeterG: 42.2,
    visualQuality: 'Excelente',
    qualityNotes: 'Paso de corruga nítido, sin rebabas, cable guía insertado correctamente.',
    producedKg: 280,
    producedMeters: 6600,
    scrapKg: 4,
    machineStatus: 'running',
    notes: 'Línea operando a velocidad nominal. Excelente estabilidad de presión.',
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    machineId: 'mach-1',
    machineCode: 'EXT-01',
    machineName: 'Línea Tubería HDPE 75mm',
    shift: 'Mañana (06:00 - 14:00)',
    operatorName: 'Rodrigo Méndez',
    supervisorName: 'Ing. Laura Valdés',
    orderNumber: 'OP-2026-TUB-104',
    batchNumber: 'LOTE-HDPE-9442',
    productDescription: 'Tubo Liso HDPE Ø32mm SDR 11 PN16',
    polymerType: 'HDPE (Polietileno Alta Densidad)',
    polymerGrade: 'TotalEnergies XS 10',
    masterbatchColor: 'Negro con Franja Azul',
    masterbatchPercent: 2.5,
    regrindPercent: 0,
    thermalZones: [
      { name: 'Z1 (Alimentación)', targetTemp: 175, actualTemp: 176 },
      { name: 'Z2 (Compresión)', targetTemp: 185, actualTemp: 184 },
      { name: 'Z3 (Dosificación)', targetTemp: 195, actualTemp: 196 },
      { name: 'Z4 (Homogeneización)', targetTemp: 200, actualTemp: 201 },
      { name: 'Adaptador / Filtro', targetTemp: 205, actualTemp: 205 },
      { name: 'Cabezal Zona 1', targetTemp: 205, actualTemp: 204 },
      { name: 'Hilera / Dado', targetTemp: 210, actualTemp: 209 },
    ],
    screwRpm: 52,
    motorAmps: 76,
    motorLoadPercent: 74,
    meltPressureBar: 188,
    meltTempC: 206,
    haulOffSpeedMpm: 8.5,
    coolingWaterTempC: 17.5,
    vacuumPressureBar: -0.65,
    wallThicknessMinMm: 2.96,
    wallThicknessMaxMm: 3.08,
    wallThicknessNominalMm: 3.00,
    outerDiameterMm: 32.1,
    weightPerMeterG: 285,
    visualQuality: 'Excelente',
    qualityNotes: 'Superficie lisa sin estrías, marcado métrico continuo legible.',
    producedKg: 420,
    producedMeters: 1470,
    scrapKg: 6,
    machineStatus: 'running',
    notes: 'Presión en cabezal muy estable. Espesores dentro de norma UNE-EN 12201.',
  },
  {
    id: 'log-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    machineId: 'mach-3',
    machineCode: 'EXT-03',
    machineName: 'Corrugadora Doble Pared 90mm',
    shift: 'Noche (22:00 - 06:00)',
    operatorName: 'Antonio Silva',
    supervisorName: 'Ing. Laura Valdés',
    orderNumber: 'OP-2026-DP-502',
    batchNumber: 'LOTE-HDPE-7721',
    productDescription: 'Corrugado Sanitario Doble Pared Ø110mm SN4',
    polymerType: 'HDPE (Polietileno Alta Densidad)',
    polymerGrade: 'Sabic B5429',
    masterbatchColor: 'Teja Exterior / Blanco Interior',
    masterbatchPercent: 3.0,
    regrindPercent: 0,
    thermalZones: [
      { name: 'Z1 (Tolva Ext. Interior)', targetTemp: 175, actualTemp: 176 },
      { name: 'Z2 (Tolva Ext. Exterior)', targetTemp: 185, actualTemp: 187 },
      { name: 'Z3 (Compresión Capa Doble)', targetTemp: 195, actualTemp: 196 },
      { name: 'Cámara de Mezcla', targetTemp: 200, actualTemp: 202 },
      { name: 'Cabezal Coextrusión', targetTemp: 205, actualTemp: 206 },
      { name: 'Formador Ondas SN4', targetTemp: 208, actualTemp: 209 },
      { name: 'Manga de Enfriamiento', targetTemp: 22, actualTemp: 23 },
    ],
    screwRpm: 46,
    motorAmps: 84,
    motorLoadPercent: 78,
    meltPressureBar: 196,
    meltTempC: 208,
    haulOffSpeedMpm: 4.8,
    coolingWaterTempC: 15.0,
    vacuumPressureBar: -0.65,
    outerDiameterMm: 110.2,
    weightPerMeterG: 452,
    visualQuality: 'Excelente',
    qualityNotes: 'Rigidez anular verificada en probeta SN4. Soldadura perfecta.',
    producedKg: 650,
    producedMeters: 1438,
    scrapKg: 12,
    machineStatus: 'running',
    notes: 'Producción continua de tubería corrugada de saneamiento sin atascos.',
  },
];

export const DEFAULT_OPERATORS = [
  'Carlos Mendoza',
  'Rodrigo Méndez',
  'Antonio Silva',
  'Javier Navarro',
  'Miguel Ángel Ruiz',
  'Ing. Laura Valdés',
];

// Helper: Haptics (Vibration on Android)
export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' | 'error' = 'light') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(25);
          break;
        case 'medium':
          navigator.vibrate(50);
          break;
        case 'success':
          navigator.vibrate([30, 40, 60]);
          break;
        case 'warning':
          navigator.vibrate([60, 60, 100]);
          break;
        case 'error':
          navigator.vibrate([100, 50, 100, 50, 150]);
          break;
      }
    } catch {
      // Ignored
    }
  }
}

// Helper: Web Audio Industrial Beep
export function playIndustrialBeep(type: 'click' | 'save' | 'alert') {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'save') {
      osc.frequency.setValueAtTime(587, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(320, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // Web audio blocked
  }
}

export const StorageService = {
  // Machines
  getMachines(): ExtrusionMachine[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_MACHINES);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_MACHINES, JSON.stringify(DEFAULT_MACHINES));
        return DEFAULT_MACHINES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_MACHINES;
    }
  },

  saveMachines(machines: ExtrusionMachine[]): void {
    localStorage.setItem(STORAGE_KEY_MACHINES, JSON.stringify(machines));
  },

  getMachineById(id: string): ExtrusionMachine | undefined {
    return this.getMachines().find((m) => m.id === id);
  },

  addMachine(machine: ExtrusionMachine): void {
    const list = this.getMachines();
    list.unshift(machine);
    this.saveMachines(list);
  },

  updateMachine(machine: ExtrusionMachine): void {
    const list = this.getMachines().map((m) => (m.id === machine.id ? machine : m));
    this.saveMachines(list);
  },

  deleteMachine(id: string): void {
    const list = this.getMachines().filter((m) => m.id !== id);
    this.saveMachines(list);
  },

  // Products (Pipes and Corrugated)
  getProducts(): PipeProduct[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRODUCTS;
    }
  },

  saveProducts(products: PipeProduct[]): void {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  },

  getProductById(id: string): PipeProduct | undefined {
    return this.getProducts().find((p) => p.id === id);
  },

  addProduct(product: PipeProduct): void {
    const list = this.getProducts();
    list.unshift(product);
    this.saveProducts(list);
  },

  updateProduct(product: PipeProduct): void {
    const list = this.getProducts().map((p) => (p.id === product.id ? product : p));
    this.saveProducts(list);
  },

  deleteProduct(id: string): void {
    const list = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(list);
  },

  // Active Station Selection (Machine + Pipe/Corrugated)
  getActiveSelection(): { machineId: string; productId: string } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SELECTION);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch {
      return null;
    }
  },

  setActiveSelection(selection: { machineId: string; productId: string } | null): void {
    if (selection) {
      localStorage.setItem(STORAGE_KEY_SELECTION, JSON.stringify(selection));
    } else {
      localStorage.removeItem(STORAGE_KEY_SELECTION);
    }
  },

  // Logs
  getLogs(): ExtrusionLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LOGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(DEFAULT_LOGS));
        return DEFAULT_LOGS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_LOGS;
    }
  },

  saveLogs(logs: ExtrusionLog[]): void {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  },

  addLog(log: ExtrusionLog): void {
    const list = this.getLogs();
    list.unshift(log);
    this.saveLogs(list);

    // Update current machine status if changed
    const machines = this.getMachines();
    const mach = machines.find((m) => m.id === log.machineId);
    if (mach) {
      mach.status = log.machineStatus;
      if (log.productDescription) {
        mach.currentProduct = log.productDescription;
      }
      this.saveMachines(machines);
    }
  },

  updateLog(log: ExtrusionLog): void {
    const list = this.getLogs().map((item) => (item.id === log.id ? log : item));
    this.saveLogs(list);
  },

  deleteLog(id: string): void {
    const list = this.getLogs().filter((item) => item.id !== id);
    this.saveLogs(list);
  },

  getPresets(): MachinePreset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PRESETS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(DEFAULT_PRESETS));
        return DEFAULT_PRESETS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRESETS;
    }
  },

  savePresets(presets: MachinePreset[]): void {
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
  },

  getOperators(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_OPERATORS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(DEFAULT_OPERATORS));
        return DEFAULT_OPERATORS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_OPERATORS;
    }
  },

  addOperator(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    const list = this.getOperators();
    if (!list.includes(trimmed)) {
      list.push(trimmed);
      localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(list));
    }
  },

  exportToCSV(): string {
    const logs = this.getLogs();
    if (logs.length === 0) return '';

    const headers = [
      'ID Registro',
      'Fecha y Hora',
      'Código Máquina',
      'Nombre Máquina',
      'Turno',
      'Operador',
      'Supervisor',
      'Orden de Producción',
      'Lote Materia Prima',
      'Producto',
      'Polímero',
      'Grado Polímero',
      'Color / Masterbatch',
      '% Masterbatch',
      '% Molido / Reciclado',
      'RPM Husillo',
      'Amperaje Motor (A)',
      'Presión Masa (bar)',
      'Temperatura Masa (°C)',
      'Velocidad Arrastre (m/min)',
      'Temp Agua Tina (°C)',
      'Vacío Tanque (bar)',
      'Espesor Mín (mm)',
      'Espesor Máx (mm)',
      'Espesor Nominal (mm)',
      'Diámetro Exterior (mm)',
      'Peso por Metro (g/m)',
      'Calidad Visual',
      'Kg Producidos',
      'Metros Producidos',
      'Merma (Kg)',
      'Estado Máquina',
      'Alarma Activa',
      'Notas / Observaciones',
    ];

    const rows = logs.map((log) => [
      `"${log.id}"`,
      `"${new Date(log.timestamp).toLocaleString('es-ES')}"`,
      `"${log.machineCode || ''}"`,
      `"${log.machineName.replace(/"/g, '""')}"`,
      `"${log.shift}"`,
      `"${log.operatorName.replace(/"/g, '""')}"`,
      `"${(log.supervisorName || '').replace(/"/g, '""')}"`,
      `"${log.orderNumber || ''}"`,
      `"${log.batchNumber || ''}"`,
      `"${(log.productDescription || '').replace(/"/g, '""')}"`,
      `"${log.polymerType}"`,
      `"${(log.polymerGrade || '').replace(/"/g, '""')}"`,
      `"${(log.masterbatchColor || '').replace(/"/g, '""')}"`,
      log.masterbatchPercent ?? '',
      log.regrindPercent ?? '',
      log.screwRpm ?? '',
      log.motorAmps ?? '',
      log.meltPressureBar ?? '',
      log.meltTempC ?? '',
      log.haulOffSpeedMpm ?? '',
      log.coolingWaterTempC ?? '',
      log.vacuumPressureBar ?? '',
      log.wallThicknessMinMm ?? '',
      log.wallThicknessMaxMm ?? '',
      log.wallThicknessNominalMm ?? '',
      log.outerDiameterMm ?? '',
      log.weightPerMeterG ?? '',
      `"${log.visualQuality}"`,
      log.producedKg ?? 0,
      log.producedMeters ?? 0,
      log.scrapKg ?? 0,
      `"${log.machineStatus}"`,
      log.alarmTriggered ? 'SÍ' : 'NO',
      `"${(log.notes || '').replace(/"/g, '""')}"`,
    ]);

    const BOM = '\uFEFF';
    return BOM + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  },

  downloadCSV(): void {
    const csvContent = this.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `ExtruData_Registros_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportBackupJSON(): void {
    const data = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      machines: this.getMachines(),
      products: this.getProducts(),
      logs: this.getLogs(),
      presets: this.getPresets(),
      operators: this.getOperators(),
      activeSelection: this.getActiveSelection(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `ExtruData_Backup_${dateStr}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importBackupJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.machines)) {
        this.saveMachines(data.machines);
      }
      if (Array.isArray(data.products)) {
        this.saveProducts(data.products);
      }
      if (Array.isArray(data.logs)) {
        this.saveLogs(data.logs);
      }
      if (Array.isArray(data.presets)) {
        this.savePresets(data.presets);
      }
      if (Array.isArray(data.operators)) {
        localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(data.operators));
      }
      if (data.activeSelection) {
        this.setActiveSelection(data.activeSelection);
      }
      return { success: true, message: 'Datos importados correctamente.' };
    } catch {
      return { success: false, message: 'Archivo JSON inválido o corrupto.' };
    }
  },

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEY_MACHINES);
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_PRESETS);
    localStorage.removeItem(STORAGE_KEY_OPERATORS);
    localStorage.removeItem(STORAGE_KEY_SELECTION);
  },
};
