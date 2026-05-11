export interface RawVehicleRecord {
  vin: string;
  make: string;
  model: string;
  year: number;
  fuelType: 'GAS' | 'DIESEL' | 'ELECTRIC' | 'PHEV' | 'HYBRID';
  gvw: number; // Gross Vehicle Weight
  countyId: string;
  registrationStatus: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export interface RawEconomicData {
  countyId: string;
  medianIncome: number;
  costOfLivingIndex: number;
  unemploymentRate: number;
}

export interface RawTravelDemand {
  countyId: string;
  avgVmtPerVehicle: number;
  annualVmtGrowthRate: number;
}

/**
 * This file defines the schema for internal data integration.
 * To replace dummy data with real internal data:
 * 1. Prepare your data in JSON or CSV format matching these interfaces.
 * 2. Update the data loading logic in src/utils/data.ts to import your real data.
 * 3. The cleaning pipeline in src/utils/data.ts is already configured to handle RawVehicleRecord.
 */
