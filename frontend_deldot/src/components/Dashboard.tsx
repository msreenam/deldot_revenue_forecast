import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  LogOut, 
  Bell, 
  Search, 
  Download,
  FileText,
  PieChart,
  Users,
  Settings,
  ChevronRight,
  TrendingUp,
  Car,
  Info,
  ArrowUpRight,
  HelpCircle,
  Database,
  Map as MapIcon,
  RefreshCw,
  Save,
  Upload,
  CheckCircle2,
  X
} from 'lucide-react';
import RevenueChart from './RevenueChart';
import DelawareMap from './DelawareMap';
import ReportView from './ReportView';
import { INITIAL_MECHANISMS, calculateRevenue, generateScenarioId } from '../utils/data';
import { Scenario, YearlyRevenue, DE_COUNTIES } from '../types/policy';

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

type Tab = 'SCENARIO' | 'TRENDS' | 'GIS' | 'RESEARCH' | 'DATA';

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('SCENARIO');
  const [scenario, setScenario] = useState<Scenario>({
    id: generateScenarioId(),
    name: 'Default Scenario',
    mechanisms: INITIAL_MECHANISMS,
    removeExisting: false,
    viewMode: 'NOMINAL'
  });
  const [showReport, setShowReport] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [importId, setImportId] = useState('');
  const [selectedYear, setSelectedYear] = useState(2025);

  const results = useMemo(() => calculateRevenue(scenario), [scenario]);
  const currentYearData = results.find(r => r.year === selectedYear) || results[0];

  const handleMechanismChange = (mechanisms: any) => {
    setScenario(prev => ({ ...prev, mechanisms }));
  };

  const handleSave = () => {
    setFeedback(`Scenario ${scenario.id} saved successfully!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleImport = () => {
    if (importId) {
      setFeedback(`Imported scenario ${importId}`);
      setScenario(prev => ({ ...prev, id: importId }));
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const exportWorkbook = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Year,Gross,Net\n"
      + results.map(r => `${r.year},${r.gross},${r.net}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DelDOT_Revenue_${scenario.id}.csv`);
    document.body.appendChild(link);
    link.click();
    setFeedback("Workbook exported successfully!");
    setTimeout(() => setFeedback(null), 3000);
  };

  if (showReport) {
    return <ReportView data={results} state={scenario as any} onBack={() => setShowReport(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#004a99] text-white flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#ffc72c] p-2 rounded-lg">
            <Database className="w-6 h-6 text-[#004a99]" />
          </div>
          <span className="font-bold text-xl tracking-tight">DelDOT</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { id: 'SCENARIO', label: 'Scenario Builder', icon: Settings },
            { id: 'TRENDS', label: 'Revenue Trends', icon: TrendingUp },
            { id: 'GIS', label: 'GIS Mapping', icon: MapIcon },
            { id: 'RESEARCH', label: 'Research Tools', icon: FileText },
            { id: 'DATA', label: 'Data Management', icon: Database },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-[#ffc72c] flex items-center justify-center text-[#004a99] font-bold text-xs uppercase">
              {user.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user}</p>
              <p className="text-[10px] text-white/40 uppercase">DMV Analyst</p>
            </div>
            <button onClick={onLogout} className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 20 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold"
            >
              <CheckCircle2 className="w-5 h-5" />
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Revenue Visualization Tool</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Page: {activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setScenario(s => ({...s, viewMode: 'NOMINAL'}))}
                className={`px-3 py-1 text-[10px] font-bold rounded ${scenario.viewMode === 'NOMINAL' ? 'bg-white shadow-sm text-[#004a99]' : 'text-gray-500'}`}
              >NOMINAL</button>
              <button 
                onClick={() => setScenario(s => ({...s, viewMode: 'REAL'}))}
                className={`px-3 py-1 text-[10px] font-bold rounded ${scenario.viewMode === 'REAL' ? 'bg-white shadow-sm text-[#004a99]' : 'text-gray-500'}`}
              >REAL (2.5%)</button>
            </div>
            <button 
              onClick={exportWorkbook}
              className="flex items-center gap-2 bg-[#004a99] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#003a7a] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Workbook
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Scenario Management Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Scenario ID</p>
                <p className="font-mono font-bold text-[#004a99]">{scenario.id}</p>
              </div>
              <div className="h-8 w-px bg-gray-100"></div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={importId}
                  onChange={(e) => setImportId(e.target.value)}
                  placeholder="Enter ID to import..."
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-[#004a99]"
                />
                <button onClick={handleImport} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><Upload className="w-4 h-4 text-gray-600" /></button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={scenario.removeExisting}
                  onChange={(e) => setScenario(s => ({...s, removeExisting: e.target.checked}))}
                  className="w-4 h-4 accent-[#004a99]"
                />
                <span className="text-xs font-bold text-gray-600">Remove Existing Revenue</span>
              </label>
              <button onClick={handleSave} className="flex items-center gap-2 bg-[#ffc72c] text-[#004a99] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#f0ba28]">
                <Save className="w-4 h-4" />
                Save Run
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'SCENARIO' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-[#004a99] mb-6">Policy Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {scenario.mechanisms.map((mech, idx) => (
                          <div key={mech.id} className="flex items-start gap-4">
                            <input 
                              type="checkbox" 
                              checked={mech.enabled}
                              onChange={(e) => {
                                const newMechs = [...scenario.mechanisms];
                                newMechs[idx].enabled = e.target.checked;
                                handleMechanismChange(newMechs);
                              }}
                              className="mt-1 w-4 h-4 accent-[#004a99]"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">{mech.id.replace(/_/g, ' ')}</span>
                                <span className="text-xs font-mono font-bold text-[#004a99]">{mech.value}</span>
                              </div>
                              <input 
                                type="range" 
                                min={0} 
                                max={mech.id.includes('FEE') ? 500 : 1} 
                                step={0.01}
                                value={mech.value}
                                onChange={(e) => {
                                  const newMechs = [...scenario.mechanisms];
                                  newMechs[idx].value = parseFloat(e.target.value);
                                  handleMechanismChange(newMechs);
                                }}
                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#004a99]"
                              />
                              <div className="flex gap-2">
                                {['NONE', 'INFLATION', 'STEP'].map(mode => (
                                  <button 
                                    key={mode}
                                    onClick={() => {
                                      const newMechs = [...scenario.mechanisms];
                                      newMechs[idx].indexing = mode as any;
                                      handleMechanismChange(newMechs);
                                    }}
                                    className={`px-2 py-0.5 text-[8px] font-bold rounded border ${mech.indexing === mode ? 'bg-[#004a99] text-white border-[#004a99]' : 'text-gray-400 border-gray-100'}`}
                                  >
                                    {mode}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Yearly Analysis</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Select Year: {selectedYear}</label>
                          <input 
                            type="range" 
                            min={2025} 
                            max={2050} 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="w-full h-2 bg-blue-50 rounded-lg appearance-none cursor-pointer accent-[#ffc72c] mt-2"
                          />
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl space-y-4">
                          <div>
                            <p className="text-[10px] text-blue-600 font-bold uppercase">Gross Revenue ({selectedYear})</p>
                            <p className="text-2xl font-bold text-[#004a99]">${(currentYearData.gross / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-blue-600 font-bold uppercase">Net Revenue ({selectedYear})</p>
                            <p className="text-2xl font-bold text-[#004a99]">${(currentYearData.net / 1000000).toFixed(1)}M</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'TRENDS' && (
                <div className="space-y-8">
                  <RevenueChart data={results as any} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: '5-Year Net Total', value: results.slice(0, 5).reduce((a, b) => a + b.net, 0) },
                      { label: '10-Year Net Total', value: results.slice(0, 10).reduce((a, b) => a + b.net, 0) },
                      { label: '25-Year Net Total', value: results.reduce((a, b) => a + b.net, 0) },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-[#004a99]">${(stat.value / 1000000000).toFixed(2)}B</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'GIS' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <DelawareMap 
                    data={currentYearData.countyImpacts} 
                    title={`Avg Cost Per Vehicle (${selectedYear})`} 
                  />
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-[#004a99]">Geographic Vulnerability Index (GVI)</h3>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                          GVI is calculated by comparing the average annual revenue cost per vehicle against county-level median income and cost of living indices.
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                      Tertile scores based on exposure (cost vs income) and sensitivity (cost of living).
                    </p>
                    <div className="space-y-4">
                      {DE_COUNTIES.map((county) => {
                        const cost = currentYearData.countyImpacts[county.id] || 0;
                        const exposure = cost / (county.medianIncome / 12); // Monthly exposure
                        const sensitivity = county.costOfLivingIndex / 100;
                        const score = exposure * sensitivity;
                        
                        // Mock tertile thresholds
                        let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
                        if (score > 0.015) level = 'HIGH';
                        else if (score > 0.01) level = 'MEDIUM';

                        return (
                          <div key={county.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-bold text-gray-700 block">{county.name}</span>
                              <span className="text-[10px] text-gray-400">Exposure Score: {score.toFixed(4)}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                              level === 'HIGH' ? 'bg-red-100 text-red-600' : 
                              level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' : 
                              'bg-green-100 text-green-600'
                            }`}>
                              {level}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'RESEARCH' && (
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-[#004a99] mb-4">National Travel & Economic Trends (2025)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="p-6 bg-blue-50 rounded-xl">
                        <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Cumulative VMT Change</p>
                        <p className="text-2xl font-bold text-[#004a99]">+0.9%</p>
                        <p className="text-[10px] text-gray-400 mt-1">FHWA Traffic Volume Trends (July 2025)</p>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-xl">
                        <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Vehicle Sales (SAAR)</p>
                        <p className="text-2xl font-bold text-[#004a99]">16.8M</p>
                        <p className="text-[10px] text-gray-400 mt-1">EIA Total Sales (August 2025)</p>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-xl">
                        <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Northeast Region VMT</p>
                        <p className="text-2xl font-bold text-[#004a99]">+1.1%</p>
                        <p className="text-[10px] text-gray-400 mt-1">Regional Traffic Growth (August 2025)</p>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-[#004a99] mb-4">National Usage Reference</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-6 text-center">
                        <MapIcon className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-400 font-medium">National MBUF Adoption Map</p>
                        <p className="text-[10px] text-gray-400 mt-2">Visualizing states with active, pilot, or planned Road Usage Charge programs.</p>
                      </div>
                      <div className="aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-6 text-center">
                        <TrendingUp className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-400 font-medium">Fuel Tax Revenue Erosion Trends</p>
                        <p className="text-[10px] text-gray-400 mt-2">Historical data showing the impact of fuel efficiency and EV adoption on state trust funds.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="p-6 bg-blue-50 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-[#004a99]">
                          <CheckCircle2 className="w-4 h-4" />
                          <h4 className="font-bold text-sm">Oregon (OReGO)</h4>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">First operational MBUF program in the US. Voluntary enrollment with fuel tax crediting. Uses plug-in devices or telematics.</p>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-[#004a99]">
                          <CheckCircle2 className="w-4 h-4" />
                          <h4 className="font-bold text-sm">Utah (RUC)</h4>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">Mandatory for alternative fuel vehicles as an alternative to a flat surcharge. Integrated with registration renewal.</p>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-[#004a99]">
                          <CheckCircle2 className="w-4 h-4" />
                          <h4 className="font-bold text-sm">Virginia (MBUF)</h4>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">Voluntary program for fuel-efficient and electric vehicles. Participants receive a discount on their highway use fee.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#004a99] text-white p-8 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <HelpCircle className="w-8 h-8 text-[#ffc72c]" />
                      <h3 className="text-xl font-bold">Policy Research Library</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "NCHRP Report 861: Best Practices in MBUF",
                        "Delaware Transportation Trust Fund Analysis (2024)",
                        "Impact of ACC II on State Revenue Streams",
                        "Equity Considerations in Road Usage Charging"
                      ].map(doc => (
                        <a key={doc} href="#" className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group">
                          <span className="text-sm font-medium">{doc}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'DATA' && (
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-[#004a99]">Data Integrity Pipeline</h2>
                        <p className="text-xs text-gray-500 mt-1">Automated filtering of duplicate VINs and inactive registrations.</p>
                      </div>
                      <button className="flex items-center gap-2 bg-[#ffc72c] text-[#004a99] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#f0ba28]">
                        <RefreshCw className="w-4 h-4" />
                        Run Pipeline
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      {[
                        { label: 'Raw Records', value: '1,245,678', color: 'text-gray-900' },
                        { label: 'Duplicates Found', value: '12,432', color: 'text-red-600' },
                        { label: 'Inactive Regs', value: '45,120', color: 'text-orange-600' },
                        { label: 'Cleaned Records', value: '1,188,126', color: 'text-green-600' },
                      ].map(stat => (
                        <div key={stat.label} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{stat.label}</p>
                          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="overflow-hidden border border-gray-100 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 font-bold text-gray-600">Timestamp</th>
                            <th className="px-6 py-4 font-bold text-gray-600">Action</th>
                            <th className="px-6 py-4 font-bold text-gray-600">Status</th>
                            <th className="px-6 py-4 font-bold text-gray-600">Records Affected</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { time: '2026-03-30 01:15', action: 'VIN Deduplication', status: 'Success', count: '12,432' },
                            { time: '2026-03-30 01:10', action: 'Registration Filter', status: 'Success', count: '45,120' },
                            { time: '2026-03-30 01:05', action: 'County Mapping', status: 'Success', count: '1,188,126' },
                          ].map((log, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                              <td className="px-6 py-4 font-bold text-gray-700">{log.action}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-bold text-[8px]">
                                  {log.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-500">{log.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-[#004a99] mb-4">External Data Sources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-gray-100 rounded-xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Database className="w-5 h-5 text-[#004a99]" />
                          </div>
                          <h4 className="font-bold text-gray-900">Internal Data Schema</h4>
                        </div>
                        <p className="text-xs text-gray-500">View the required format for integrating your DMV vehicle registry and economic data.</p>
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-[#004a99] uppercase cursor-pointer hover:underline">View Schema (src/types/data.ts)</span>
                        </div>
                      </div>
                      <div className="p-6 border border-gray-100 rounded-xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-[#004a99]" />
                          </div>
                          <h4 className="font-bold text-gray-900">FHWA & EIA Trends</h4>
                        </div>
                        <p className="text-xs text-gray-500">Real-time VMT (+0.9% YTD) and vehicle sales (16.8M SAAR) tracking for dynamic simulations.</p>
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-green-600 uppercase">Connected</span>
                          <span className="text-gray-400">Last Sync: 1h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
