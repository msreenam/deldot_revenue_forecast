export type RevenueMechanismType = 
  | 'FUEL_TAX_GAS' 
  | 'FUEL_TAX_DIESEL'
  | 'REG_FEE_BASE_LIGHT'
  | 'REG_FEE_BASE_HEAVY'
  | 'REG_FEE_EV_SURCHARGE'
  | 'REG_FEE_PHEV_SURCHARGE'
  | 'REG_FEE_HYBRID_SURCHARGE'
  | 'REG_FEE_VALUE_BASED'
  | 'REG_FEE_AGE_BASED'
  | 'REG_FEE_WEIGHT_BASED'
  | 'MBUF_LIGHT'
  | 'MBUF_HEAVY'
  | 'KWH_TAX'
  | 'DELIVERY_FEE'
  | 'FOR_HIRE_FEE';

export interface PolicyMechanism {
  id: RevenueMechanismType;
  enabled: boolean;
  value: number; // Rate, fee amount, or percentage
  indexing: 'NONE' | 'INFLATION' | 'STEP';
  stepValue?: number;
  stepFrequency?: number; // years
}

export interface Scenario {
  id: string;
  name: string;
  mechanisms: PolicyMechanism[];
  removeExisting: boolean;
  viewMode: 'NOMINAL' | 'REAL';
}

export interface CountyData {
  id: string;
  name: string;
  medianIncome: number;
  costOfLivingIndex: number;
  vmtPerVehicle: number;
}

export const DE_COUNTIES: CountyData[] = [
  { id: '10001', name: 'Kent', medianIncome: 65000, costOfLivingIndex: 98, vmtPerVehicle: 12500 },
  { id: '10003', name: 'New Castle', medianIncome: 78000, costOfLivingIndex: 105, vmtPerVehicle: 11000 },
  { id: '10005', name: 'Sussex', medianIncome: 62000, costOfLivingIndex: 102, vmtPerVehicle: 14000 },
];

export interface YearlyRevenue {
  year: number;
  gross: number;
  net: number;
  byMechanism: Record<string, number>;
  countyImpacts: Record<string, number>; // Avg cost per vehicle
}
