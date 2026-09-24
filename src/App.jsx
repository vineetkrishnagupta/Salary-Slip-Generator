import { useState, useEffect, useRef } from 'react';
import {
  Briefcase, FileText, History as HistoryIcon, RotateCcw, Zap,
  Building2, CalendarRange, TrendingUp, TrendingDown, BarChart2,
  CheckCircle2, ImagePlus, X, User
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SlipPreview from './components/SlipPreview';
import History from './components/History';
import Blog from './components/Blog';
import { calculateSalary, generateId } from './utils/salary';
const MONTHS = [
  { v: '01', l: 'January' }, { v: '02', l: 'February' }, { v: '03', l: 'March' },
  { v: '04', l: 'April' }, { v: '05', l: 'May' }, { v: '06', l: 'June' },
  { v: '07', l: 'July' }, { v: '08', l: 'August' }, { v: '09', l: 'September' },
  { v: '10', l: 'October' }, { v: '11', l: 'November' }, { v: '12', l: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

const DEFAULT_EARNINGS = [
  { id: 'e1', name: 'Basic', amount: '' },
  { id: 'e2', name: 'House Rent Allowance', amount: '' },
  { id: 'e3', name: 'Conveyance Allowance', amount: '' },
  { id: 'e4', name: 'Special Allowance', amount: '' },
];

const DEFAULT_DEDUCTIONS = [
  { id: 'd1', name: 'Income Tax', amount: '' },
  { id: 'd2', name: 'Provident Fund', amount: '' },
  { id: 'd3', name: 'Professional Tax', amount: '' },
];

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="toast">
      <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
      {msg}
    </div>
  );
}

function SalarySlipGenerator() {
  const [tab, setTab] = useState('form');
  const [toast, setToast] = useState('');
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('salary_history') || '[]'); }
    catch { return []; }
  });

  const [company, setCompany] = useState({ name: '', address: '', logo: '' });
  const logoInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCompany(p => ({ ...p, logo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setCompany(p => ({ ...p, logo: '' }));
    if (logoInputRef.current) logoInputRef.current.value = '';
  };
  const [employee, setEmployee] = useState({
    name: '', id: '', designation: '', department: '',
    doj: '', bankAccount: '', pan: '', uan: '',
  });
  const today = new Date();
  const defaultPayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;

  const [period, setPeriod] = useState({
    month: String(today.getMonth() + 1).padStart(2, '0'),
    year: String(currentYear),
    payDate: defaultPayDate,
    paidDays: '30',
    lopDays: '0',
  });
  const [earnings, setEarnings] = useState(DEFAULT_EARNINGS);
  const [deductions, setDeductions] = useState(DEFAULT_DEDUCTIONS);
  const [slipData, setSlipData] = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const saveHistory = (record) => {
    const updated = [record, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('salary_history', JSON.stringify(updated));
  };

  const handleGenerate = () => {
    if (!employee.name.trim()) {
      setToast('Please enter employee name.');
      return;
    }
    const totals = calculateSalary(earnings, deductions);
    const record = {
      id: generateId(),
      company: { ...company },
      employee: { ...employee },
      earnings: earnings.map(e => ({ ...e })),
      deductions: deductions.map(d => ({ ...d })),
      totals,
      period: { ...period },
      generatedAt: new Date().toISOString(),
    };
    setSlipData(record);
    saveHistory(record);
    setToast('Salary slip generated!');
    setTab('preview');
  };

  const handleReset = () => {
    setCompany({ name: '', address: '', logo: '' });
    if (logoInputRef.current) logoInputRef.current.value = '';
    setEmployee({ name: '', id: '', designation: '', department: '', doj: '', bankAccount: '', pan: '', uan: '' });
    setPeriod({
      month: String(today.getMonth() + 1).padStart(2, '0'),
      year: String(currentYear),
      payDate: defaultPayDate,
      paidDays: '30',
      lopDays: '0',
    });
    setEarnings(DEFAULT_EARNINGS);
    setDeductions(DEFAULT_DEDUCTIONS);
    setSlipData(null);
    setTab('form');
  };

  const handleLoadHistory = (rec) => {
    const migrate = (data) => Array.isArray(data) ? data : Object.keys(data).map((k, i) => ({ id: `old-${i}-${Date.now()}`, name: k, amount: data[k] }));
    
    setCompany(rec.company);
    setEmployee(rec.employee);
    setEarnings(migrate(rec.earnings));
    setDeductions(migrate(rec.deductions));
    setPeriod(rec.period);
    setSlipData(rec);
    setTab('preview');
  };

  const updateField = (setter, id, key, val) => {
    setter(p => p.map(item => item.id === id ? { ...item, [key]: val } : item));
  };
  const addField = (setter, defaultName) => {
    setter(p => [...p, { id: generateId(), name: defaultName, amount: '' }]);
  };
  const removeField = (setter, id) => {
    setter(p => p.filter(item => item.id !== id));
  };

  const totals = calculateSalary(earnings, deductions);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="header-logo-icon">
            <Briefcase size={20} color="#fff" />
          </div>
          <span className="header-logo-text">SalarySlip Pro</span>
        </div>
        <span className="header-badge">FREE TOOL</span>
        <Link to="/blog" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <FileText size={14} /> Blog
        </Link>
      </header>

      <main className="main-content">
        {/* Hero */}
        <div className="hero">
          <h1>Salary Slip Generator</h1>
          <p>Generate professional salary slips instantly. Fill in details, preview, and download.</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            id="tab-form"
            className={`tab-btn ${tab === 'form' ? 'active' : ''}`}
            onClick={() => setTab('form')}
          >
            <FileText size={15} />
            Form
          </button>
          <button
            id="tab-preview"
            className={`tab-btn ${tab === 'preview' ? 'active' : ''}`}
            onClick={() => setTab('preview')}
          >
            <FileText size={15} />
            Preview
          </button>
          <button
            id="tab-history"
            className={`tab-btn ${tab === 'history' ? 'active' : ''}`}
            onClick={() => setTab('history')}
          >
            <HistoryIcon size={15} />
            History
          </button>
        </div>

        {/* FORM TAB */}
        {tab === 'form' && (
          <div className="grid-layout">
            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Company Info */}
              <div className="card">
                <div className="card-title">
                  <Building2 size={17} />
                  Company Details
                </div>
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Company Name</label>
                    <input
                      id="company-name"
                      type="text"
                      placeholder="Acme Pvt. Ltd."
                      value={company.name}
                      onChange={e => setCompany(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group full">
                    <label>Company Address</label>
                    <input
                      id="company-address"
                      type="text"
                      placeholder="123, Business Park, Mumbai - 400001"
                      value={company.address}
                      onChange={e => setCompany(p => ({ ...p, address: e.target.value }))}
                    />
                  </div>
                  <div className="form-group full">
                    <label>Company Logo</label>
                    {company.logo ? (
                      <div className="logo-preview-wrap">
                        <img src={company.logo} alt="Company Logo" className="logo-thumb" />
                        <button className="logo-remove-btn" onClick={removeLogo} title="Remove logo">
                          <X size={14} /> Remove
                        </button>
                      </div>
                    ) : (
                      <div
                        className="logo-upload-area"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        <ImagePlus size={22} />
                        <span>Click to upload logo (PNG, JPG, SVG)</span>
                        <input
                          ref={logoInputRef}
                          id="company-logo"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleLogoUpload}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pay Period */}
              <div className="card">
                <div className="card-title">
                  <CalendarRange size={17} className="icon" />
                  Pay Period
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Month</label>
                    <select
                      id="period-month"
                      value={period.month}
                      onChange={e => setPeriod(p => ({ ...p, month: e.target.value }))}
                    >
                      {MONTHS.map(m => (
                        <option key={m.v} value={m.v}>{m.l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <select
                      id="period-year"
                      value={period.year}
                      onChange={e => setPeriod(p => ({ ...p, year: e.target.value }))}
                    >
                      {YEARS.map(y => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pay Date</label>
                    <input
                      id="period-pay-date"
                      type="date"
                      value={period.payDate || ''}
                      onChange={e => setPeriod(p => ({ ...p, payDate: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Paid Days</label>
                    <input
                      id="period-paid-days"
                      type="number"
                      min="0"
                      max="31"
                      placeholder="30"
                      value={period.paidDays ?? ''}
                      onChange={e => setPeriod(p => ({ ...p, paidDays: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Loss of Pay (LOP) Days</label>
                    <input
                      id="period-lop-days"
                      type="number"
                      min="0"
                      max="31"
                      placeholder="0"
                      value={period.lopDays ?? ''}
                      onChange={e => setPeriod(p => ({ ...p, lopDays: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Employee Info */}
              <div className="card">
                <div className="card-title">
                  <User size={17} className="icon" />
                  Employee Details
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input id="emp-name" type="text" placeholder="Rahul Sharma" value={employee.name}
                      onChange={e => setEmployee(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input id="emp-id" type="text" placeholder="EMP-001" value={employee.id}
                      onChange={e => setEmployee(p => ({ ...p, id: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input id="emp-designation" type="text" placeholder="Software Engineer" value={employee.designation}
                      onChange={e => setEmployee(p => ({ ...p, designation: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input id="emp-department" type="text" placeholder="Engineering" value={employee.department}
                      onChange={e => setEmployee(p => ({ ...p, department: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Date of Joining</label>
                    <input id="emp-doj" type="date" value={employee.doj}
                      onChange={e => setEmployee(p => ({ ...p, doj: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Bank Account No.</label>
                    <input id="emp-bank" type="text" placeholder="XXXX XXXX 1234" value={employee.bankAccount}
                      onChange={e => setEmployee(p => ({ ...p, bankAccount: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>PAN</label>
                    <input id="emp-pan" type="text" placeholder="ABCDE1234F" value={employee.pan}
                      onChange={e => setEmployee(p => ({ ...p, pan: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>UAN</label>
                    <input id="emp-uan" type="text" placeholder="100123456789" value={employee.uan}
                      onChange={e => setEmployee(p => ({ ...p, uan: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Earnings */}
              <div className="card">
                <div className="card-title">
                  <TrendingUp size={17} className="icon" />
                  Earnings
                </div>
                <div className="salary-section">
                  {earnings.map(item => (
                    <div className="salary-row" key={item.id}>
                      <input
                        className="salary-name-input"
                        type="text"
                        placeholder="Earning Name"
                        value={item.name}
                        onChange={e => updateField(setEarnings, item.id, 'name', e.target.value)}
                      />
                      <div className="amount-wrap">
                        <input
                          type="number"
                          min="0"
                          placeholder="0.00"
                          value={item.amount}
                          onChange={e => updateField(setEarnings, item.id, 'amount', e.target.value)}
                        />
                        <button className="icon-btn danger" onClick={() => removeField(setEarnings, item.id)} title="Remove">
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-secondary" onClick={() => addField(setEarnings, 'New Earning')} style={{ marginTop: '0.5rem', padding: '6px 12px', fontSize: '0.8rem' }}>
                    + Add Earnings
                  </button>
                </div>
              </div>

              {/* Deductions */}
              <div className="card">
                <div className="card-title">
                  <TrendingDown size={17} className="icon" />
                  Deductions
                </div>
                <div className="salary-section">
                  {deductions.map(item => (
                    <div className="salary-row" key={item.id}>
                      <input
                        className="salary-name-input"
                        type="text"
                        placeholder="Deduction Name"
                        value={item.name}
                        onChange={e => updateField(setDeductions, item.id, 'name', e.target.value)}
                      />
                      <div className="amount-wrap">
                        <input
                          type="number"
                          min="0"
                          placeholder="0.00"
                          value={item.amount}
                          onChange={e => updateField(setDeductions, item.id, 'amount', e.target.value)}
                        />
                        <button className="icon-btn danger" onClick={() => removeField(setDeductions, item.id)} title="Remove">
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-secondary" onClick={() => addField(setDeductions, 'New Deduction')} style={{ marginTop: '0.5rem', padding: '6px 12px', fontSize: '0.8rem' }}>
                    + Add Deductions
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="card">
                <div className="card-title">
                  <BarChart2 size={17} className="icon" />
                  Summary
                </div>
                <div className="summary-box">
                  <div className="summary-row">
                    <span className="slabel">Total Earnings</span>
                    <span className="svalue">₹ {totals.totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="summary-row">
                    <span className="slabel">Total Deductions</span>
                    <span className="svalue">₹ {totals.totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="summary-row total">
                    <span className="slabel">Net Salary</span>
                    <span className="svalue">₹ {totals.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="btn-group">
                  <button id="btn-generate" className="btn btn-primary" onClick={handleGenerate}>
                    <Zap size={16} />
                    Generate Slip
                  </button>
                  <button id="btn-reset" className="btn btn-secondary" onClick={handleReset}>
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW TAB */}
        {tab === 'preview' && (
          <SlipPreview data={slipData} />
        )}

        {/* HISTORY TAB */}
        {tab === 'history' && (
          <History records={history} onLoad={handleLoadHistory} />
        )}
      </main>

      <Toast msg={toast} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SalarySlipGenerator />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  );
}
