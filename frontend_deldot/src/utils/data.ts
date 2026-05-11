import { Scenario, YearlyRevenue, DE_COUNTIES, PolicyMechanism } from '../types/policy';
import { RawVehicleRecord } from '../types/data';

const INFLATION_RATE = 0.025;
const VEHICLE_GROWTH = 0.007;
const VMT_GROWTH = 0.009; // Updated based on 2025 FHWA Traffic Volume Trends (+0.9% cumulative)
const SCRAPPAGE_RATE = 0.045;

/**
 * Advanced Clean Cars II (ACC II) Schedule for Delaware.
 * Percentage of NEW vehicle sales that must be ZEV (Zero Emission Vehicles).
 */
const ACC_II_SCHEDULE: Record<number, number> = {
  2025: 0.10,
  2026: 0.25,
  2027: 0.43,
  2028: 0.51,
  2029: 0.59,
  2030: 0.68,
  2031: 0.76,
  2032: 0.82,
  2033: 0.88,
  2034: 0.94,
  2035: 1.00,
};

// Collection costs
const COLLECTION_COSTS: Record<string, number> = {
  FUEL_TAX_GAS: 0.0062,
  FUEL_TAX_DIESEL: 0.0062,
  REG_FEE_BASE_LIGHT: 0.13,
  REG_FEE_BASE_HEAVY: 0.13,
  REG_FEE_EV_SURCHARGE: 0.13,
  REG_FEE_PHEV_SURCHARGE: 0.13,
  REG_FEE_HYBRID_SURCHARGE: 0.13,
  REG_FEE_VALUE_BASED: 0.15,
  REG_FEE_AGE_BASED: 0.15,
  REG_FEE_WEIGHT_BASED: 0.15,
  MBUF_LIGHT: 0.10,
  MBUF_HEAVY: 0.10,
  KWH_TAX: 0.05,
  DELIVERY_FEE: 0.08,
  FOR_HIRE_FEE: 0.08,
};

/**
 * Mock data cleaning pipeline to satisfy IT requirements.
 * In a real app, this would query a database and filter duplicates.
 */
export function cleanVehicleData(rawData: RawVehicleRecord[]): RawVehicleRecord[] {
  const seenVins = new Set();
  return rawData.filter(record => {
    if (seenVins.has(record.vin)) return false;
    seenVins.add(record.vin);
    return record.registrationStatus === 'ACTIVE';
  });
}

export function generateScenarioId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function calculateRevenue(scenario: Scenario): YearlyRevenue[] {
  const results: YearlyRevenue[] = [];
  const startYear = 2025;
  const endYear = 2050;

  let baseVehicles = 923000;
  let baseVmt = 10000000000; 
  
  // Track fleet composition over time
  let currentIceFleet = baseVehicles * 0.95;
  let currentEvFleet = baseVehicles * 0.05;

  for (let year = startYear; year <= endYear; year++) {
    const yearsElapsed = year - startYear;
    const inflationFactor = Math.pow(1 + INFLATION_RATE, yearsElapsed);
    
    // Fleet dynamics with ACC II
    // 1. Scrappage (remove old vehicles)
    const scrappedIce = currentIceFleet * SCRAPPAGE_RATE;
    const scrappedEv = currentEvFleet * SCRAPPAGE_RATE;
    
    // 2. Growth (new vehicles entering the fleet)
    const totalFleetBeforeNew = (currentIceFleet - scrappedIce) + (currentEvFleet - scrappedEv);
    const targetFleetSize = baseVehicles * Math.pow(1 + VEHICLE_GROWTH, yearsElapsed);
    const newVehiclesNeeded = targetFleetSize - totalFleetBeforeNew;

    // 3. Apply ACC II Mandate to new sales
    const zevMandateShare = ACC_II_SCHEDULE[year] || (year > 2035 ? 1.00 : 0.10);
    const newEvs = newVehiclesNeeded * zevMandateShare;
    const newIces = newVehiclesNeeded * (1 - zevMandateShare);

    currentIceFleet = (currentIceFleet - scrappedIce) + newIces;
    currentEvFleet = (currentEvFleet - scrappedEv) + newEvs;

    const totalVehicles = currentIceFleet + currentEvFleet;
    const evFleetShare = currentEvFleet / totalVehicles;
    const totalVmt = baseVmt * Math.pow(1 + VMT_GROWTH, yearsElapsed);

    const byMechanism: Record<string, number> = {};
    let yearlyGross = 0;
    let yearlyNet = 0;

    scenario.mechanisms.forEach(mech => {
      if (!mech.enabled) return;

      let revenue = 0;
      let rate = mech.value;

      // Handle indexing
      if (mech.indexing === 'INFLATION') {
        rate *= inflationFactor;
      } else if (mech.indexing === 'STEP' && mech.stepValue && mech.stepFrequency) {
        const steps = Math.floor(yearsElapsed / mech.stepFrequency);
        rate += (steps * mech.stepValue);
      }

      // Logic per mechanism
      switch (mech.id) {
        case 'FUEL_TAX_GAS':
          // Only ICE vehicles pay fuel tax
          revenue = totalVmt * (1 - evFleetShare) * (rate / 22); // 22 MPG avg
          break;
        case 'FUEL_TAX_DIESEL':
          revenue = (totalVmt * 0.15) * (rate / 15); // 15% diesel fleet, 15 MPG
          break;
        case 'REG_FEE_BASE_LIGHT':
          revenue = totalVehicles * 0.85 * rate; // 85% light vehicles
          break;
        case 'REG_FEE_BASE_HEAVY':
          revenue = totalVehicles * 0.15 * rate; // 15% heavy vehicles
          break;
        case 'REG_FEE_EV_SURCHARGE':
          revenue = currentEvFleet * rate;
          break;
        case 'REG_FEE_PHEV_SURCHARGE':
          revenue = totalVehicles * 0.05 * rate; // 5% PHEV assumption
          break;
        case 'REG_FEE_HYBRID_SURCHARGE':
          revenue = totalVehicles * 0.10 * rate; // 10% Hybrid assumption
          break;
        case 'REG_FEE_VALUE_BASED':
          revenue = totalVehicles * 35000 * rate; // Avg value $35k
          break;
        case 'REG_FEE_AGE_BASED':
          revenue = totalVehicles * rate; // Flat fee based on age brackets (simplified)
          break;
        case 'REG_FEE_WEIGHT_BASED':
          revenue = totalVehicles * 4000 * rate; // Avg weight 4000 lbs
          break;
        case 'MBUF_LIGHT':
          // MBUF Logic: subtract fuel tax paid
          const mbufGross = totalVmt * 0.85 * rate;
          const fuelTaxPaid = totalVmt * 0.85 * (1 - evFleetShare) * (0.23 / 22);
          revenue = Math.max(0, mbufGross - fuelTaxPaid);
          break;
        case 'MBUF_HEAVY':
          const mbufHeavyGross = totalVmt * 0.15 * rate;
          const dieselTaxPaid = totalVmt * 0.15 * (0.22 / 15);
          revenue = Math.max(0, mbufHeavyGross - dieselTaxPaid);
          break;
        case 'KWH_TAX':
          // Only EVs pay KWH tax
          revenue = totalVmt * evFleetShare * (0.3 * rate); // 0.3 kWh per mile
          break;
        case 'DELIVERY_FEE':
          revenue = 60000000 * rate * Math.pow(1.04, yearsElapsed); // 60M packages/year, 4% growth
          break;
        case 'FOR_HIRE_FEE':
          revenue = 15000000 * rate * Math.pow(1.03, yearsElapsed); // 15M trips/year, 3% growth
          break;
        default:
          revenue = 0;
      }

      const costRate = COLLECTION_COSTS[mech.id] || 0.1;
      const net = revenue * (1 - costRate);

      byMechanism[mech.id] = scenario.viewMode === 'REAL' ? revenue / inflationFactor : revenue;
      yearlyGross += revenue;
      yearlyNet += net;
    });

    // County Impacts & GVI
    const countyImpacts: Record<string, number> = {};
    DE_COUNTIES.forEach(county => {
      // Cost per vehicle in this county
      const avgCost = (yearlyGross / totalVehicles) * (county.vmtPerVehicle / 12000);
      countyImpacts[county.id] = avgCost;
    });

    results.push({
      year,
      gross: scenario.viewMode === 'REAL' ? yearlyGross / inflationFactor : yearlyGross,
      net: scenario.viewMode === 'REAL' ? yearlyNet / inflationFactor : yearlyNet,
      byMechanism,
      countyImpacts,
    });
  }

  return results;
}

export const INITIAL_MECHANISMS: PolicyMechanism[] = [
  { id: 'FUEL_TAX_GAS', enabled: true, value: 0.23, indexing: 'NONE' },
  { id: 'FUEL_TAX_DIESEL', enabled: true, value: 0.22, indexing: 'NONE' },
  { id: 'REG_FEE_BASE_LIGHT', enabled: true, value: 40, indexing: 'NONE' },
  { id: 'REG_FEE_BASE_HEAVY', enabled: false, value: 120, indexing: 'NONE' },
  { id: 'REG_FEE_EV_SURCHARGE', enabled: false, value: 150, indexing: 'NONE' },
  { id: 'REG_FEE_PHEV_SURCHARGE', enabled: false, value: 75, indexing: 'NONE' },
  { id: 'REG_FEE_HYBRID_SURCHARGE', enabled: false, value: 50, indexing: 'NONE' },
  { id: 'REG_FEE_VALUE_BASED', enabled: false, value: 0.01, indexing: 'NONE' },
  { id: 'REG_FEE_AGE_BASED', enabled: false, value: 20, indexing: 'NONE' },
  { id: 'REG_FEE_WEIGHT_BASED', enabled: false, value: 0.05, indexing: 'NONE' },
  { id: 'MBUF_LIGHT', enabled: false, value: 0.02, indexing: 'NONE' },
  { id: 'MBUF_HEAVY', enabled: false, value: 0.08, indexing: 'NONE' },
  { id: 'KWH_TAX', enabled: false, value: 0.03, indexing: 'NONE' },
  { id: 'DELIVERY_FEE', enabled: false, value: 0.50, indexing: 'NONE' },
  { id: 'FOR_HIRE_FEE', enabled: false, value: 1.00, indexing: 'NONE' },
];
