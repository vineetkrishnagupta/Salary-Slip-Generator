import { useRef } from 'react';
import { Download, Printer, FileText } from 'lucide-react';
import { formatCurrency, numberToWords, getMonthName, formatDisplayDate } from '../utils/salary';

export default function SlipPreview({ data }) {
  const slipRef = useRef(null);

  if (!data) {
    return (
      <div className="card">
        <div className="empty-state">
          <FileText size={52} strokeWidth={1.2} />
          <p>Fill in the form and click <strong>Generate Slip</strong> to preview your salary slip here.</p>
        </div>
      </div>
    );
  }

  const { employee, company, earnings, deductions, totals, period } = data;

  const parseItems = (items) => {
    if (Array.isArray(items)) {
      return items.filter(i => i.name && i.name.trim() !== '').map(i => ({ name: i.name, amount: i.amount || 0 }));
    }
    return Object.keys(items)
      .filter(k => k && k.trim() !== '')
      .map(k => ({ name: k, amount: items[k] || 0 }));
  };

  const earnList = parseItems(earnings);
  const deductList = parseItems(deductions);
  const maxRows = Math.max(earnList.length, deductList.length, 1);

  const sharedStyles = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f1f5f9;
      color: #111827;
      line-height: 1.5;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .slip-a4-page {
      width: 210mm;
      min-height: 297mm;
      max-width: 100%;
      margin: 20px auto;
      background: #ffffff;
      padding: 18mm 18mm;
      border-radius: 3px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
      color: #111827;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .slip-content-body {
      flex: 1 0 auto;
    }
    .slip-content-footer {
      flex-shrink: 0;
      margin-top: 36px;
    }
    .slip-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 26px;
    }
    .slip-company-info h2 {
      font-size: 1.45rem;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }
    .slip-company-info p {
      font-size: 0.88rem;
      color: #4b5563;
      margin-top: 4px;
      line-height: 1.4;
    }
    .slip-company-logo-img {
      max-height: 48px;
      max-width: 160px;
      object-fit: contain;
      margin-bottom: 8px;
      display: block;
    }
    .slip-header-meta {
      text-align: right;
    }
    .slip-header-meta .meta-subtitle {
      font-size: 0.82rem;
      color: #4b5563;
      font-weight: 400;
    }
    .slip-header-meta .meta-month {
      font-size: 1.15rem;
      font-weight: 700;
      color: #111827;
      margin-top: 2px;
    }
    .slip-summary-grid {
      display: grid;
      grid-template-columns: 1fr 290px;
      gap: 28px;
      align-items: start;
      margin-bottom: 24px;
    }
    @media (max-width: 720px) {
      .slip-summary-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
    .slip-section-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: #4b5563;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .slip-kv-table {
      display: grid;
      grid-template-columns: 130px 14px 1fr;
      row-gap: 7px;
      font-size: 0.85rem;
      line-height: 1.4;
    }
    .slip-kv-table .k-label {
      color: #4b5563;
      font-weight: 400;
    }
    .slip-kv-table .k-colon {
      color: #4b5563;
      text-align: center;
    }
    .slip-kv-table .k-value {
      color: #111827;
      font-weight: 600;
    }
    .slip-net-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      background: #ffffff;
    }
    .slip-net-card-top {
      background: #f0fdf4;
      border-left: 4px solid #22c55e;
      padding: 16px 20px;
    }
    .slip-net-amount-big {
      font-size: 1.85rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.15;
    }
    .slip-net-card-sub {
      font-size: 0.82rem;
      color: #475569;
      font-weight: 500;
      margin-top: 4px;
    }
    .slip-net-card-bottom {
      padding: 12px 20px;
      background: #ffffff;
      border-top: 1px solid #f1f5f9;
      display: grid;
      grid-template-columns: 90px 14px 1fr;
      row-gap: 6px;
      font-size: 0.85rem;
    }
    .slip-table-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      margin-top: 16px;
      margin-bottom: 20px;
    }
    .slip-breakdown-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .slip-breakdown-table thead th {
      font-size: 0.76rem;
      font-weight: 700;
      color: #374151;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 10px 16px;
      background: #ffffff;
      border-bottom: 1px dotted #9ca3af;
    }
    .slip-breakdown-table tbody td {
      padding: 8px 16px;
      color: #1f2937;
      font-size: 0.85rem;
      border-bottom: none;
    }
    .slip-breakdown-table td.col-amount,
    .slip-breakdown-table th.col-amount {
      text-align: right;
    }
    .slip-breakdown-table tbody tr.row-totals {
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .slip-breakdown-table tbody tr.row-totals td {
      padding: 10px 16px;
      font-weight: 700;
      color: #111827;
    }
    .slip-net-payable-box {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      margin-bottom: 12px;
    }
    .slip-net-payable-left .net-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: #111827;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .slip-net-payable-left .net-formula {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 2px;
    }
    .slip-net-payable-pill {
      background: #f0fdf4;
      border: 1px solid #dcfce7;
      padding: 6px 18px;
      border-radius: 6px;
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
    }
    .slip-words-row {
      text-align: right;
      font-size: 0.82rem;
      color: #374151;
      font-weight: 500;
      margin-bottom: 24px;
    }
    .slip-system-notice {
      text-align: center;
      font-size: 0.75rem;
      color: #6b7280;
      margin-bottom: 20px;
    }
    .slip-bottom-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      color: #6b7280;
      border-top: 1px solid #f1f5f9;
      padding-top: 14px;
    }
    .slip-bottom-footer a {
      color: #2563eb;
      text-decoration: none;
    }
    @media print {
      @page {
        size: A4 portrait;
        margin: 0;
      }
      html, body {
        padding: 0 !important;
        margin: 0 !important;
        background: #ffffff !important;
      }
      .slip-a4-page {
        width: 210mm !important;
        min-height: 297mm !important;
        max-width: 210mm !important;
        margin: 0 auto !important;
        padding: 16mm 16mm !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        page-break-inside: avoid !important;
        page-break-after: avoid !important;
      }
    }
  `;

  const handlePrint = () => {
    const content = slipRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=900,height=750');
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Salary Slip - ${employee.name || 'Employee'} - ${getMonthName(period.month)} ${period.year}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="slip-a4-page">${content}</div>
</body>
</html>`);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 400);
    };
  };

  const handleDownload = () => {
    const content = slipRef.current.innerHTML;
    const blob = new Blob([`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Salary Slip - ${employee.name || 'Employee'} - ${getMonthName(period.month)} ${period.year}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>${sharedStyles}</style>
</head>
<body style="padding: 24px; background: #f1f5f9;">
  <div class="slip-a4-page">${content}</div>
</body>
</html>`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Salary_Slip_${(employee.name || 'Employee').replace(/\s+/g, '_')}_${period.month}_${period.year}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="a4-preview-wrapper">
      {/* Top Action Toolbar */}
      <div className="a4-toolbar">
        <div className="a4-badge">
          <FileText size={14} />
          <span>A4 Format (210 × 297 mm)</span>
        </div>
        <div className="btn-group" style={{ margin: 0 }}>
          <button className="btn btn-accent" id="btn-download-slip" onClick={handleDownload}>
            <Download size={15} />
            Download HTML
          </button>
          <button className="btn btn-primary" id="btn-print-slip" onClick={handlePrint}>
            <Printer size={15} />
            Print A4
          </button>
        </div>
      </div>

      {/* A4 Workspace Canvas */}
      <div className="a4-preview-canvas">
        <div ref={slipRef} className="slip-a4-page" id="salary-slip-preview">
          {/* Main Body Content */}
          <div className="slip-content-body">
            {/* Header */}
            <div className="slip-header-row">
              <div className="slip-company-info">
                {company.logo && (
                  <img
                    src={company.logo}
                    alt="Company Logo"
                    className="slip-company-logo-img"
                  />
                )}
                <h2>{company.name || 'Company Name'}</h2>
                <p>{company.address || 'Company Address'}</p>
              </div>
              <div className="slip-header-meta">
                <div className="meta-subtitle">Payslip For the Month</div>
                <div className="meta-month">{getMonthName(period.month)} {period.year}</div>
              </div>
            </div>

            {/* Employee Summary & Net Pay Stats */}
            <div className="slip-summary-grid">
              {/* Left: Summary */}
              <div className="slip-emp-summary-col">
                <div className="slip-section-title">EMPLOYEE SUMMARY</div>
                <div className="slip-kv-table">
                  <div className="k-label">Employee Name</div>
                  <div className="k-colon">:</div>
                  <div className="k-value">{employee.name || '—'}</div>

                  <div className="k-label">Employee ID</div>
                  <div className="k-colon">:</div>
                  <div className="k-value">{employee.id || '—'}</div>

                  <div className="k-label">Pay Period</div>
                  <div className="k-colon">:</div>
                  <div className="k-value">{getMonthName(period.month)} {period.year}</div>

                  <div className="k-label">Pay Date</div>
                  <div className="k-colon">:</div>
                  <div className="k-value">{formatDisplayDate(period.payDate) || '—'}</div>

                  {employee.designation && (
                    <>
                      <div className="k-label">Designation</div>
                      <div className="k-colon">:</div>
                      <div className="k-value">{employee.designation}</div>
                    </>
                  )}
                  {employee.department && (
                    <>
                      <div className="k-label">Department</div>
                      <div className="k-colon">:</div>
                      <div className="k-value">{employee.department}</div>
                    </>
                  )}
                  {employee.doj && (
                    <>
                      <div className="k-label">Date of Joining</div>
                      <div className="k-colon">:</div>
                      <div className="k-value">{formatDisplayDate(employee.doj)}</div>
                    </>
                  )}
                  {employee.bankAccount && (
                    <>
                      <div className="k-label">Bank Account</div>
                      <div className="k-colon">:</div>
                      <div className="k-value">{employee.bankAccount}</div>
                    </>
                  )}
                  {employee.pan && (
                    <>
                      <div className="k-label">PAN</div>
                      <div className="k-colon">:</div>
                      <div className="k-value">{employee.pan}</div>
                    </>
                  )}
                  {employee.uan && (
                    <>
                      <div className="k-label">UAN</div>
                      <div className="k-colon">:</div>
                      <div className="k-value">{employee.uan}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Right: Net Pay Highlight Card */}
              <div className="slip-net-card-col">
                <div className="slip-net-card">
                  <div className="slip-net-card-top">
                    <div className="slip-net-amount-big">{formatCurrency(totals.netSalary)}</div>
                    <div className="slip-net-card-sub">Total Net Pay</div>
                  </div>
                  <div className="slip-net-card-bottom">
                    <div className="k-label">Paid Days</div>
                    <div className="k-colon">:</div>
                    <div className="k-value">{period.paidDays ?? '30'}</div>

                    <div className="k-label">LOP Days</div>
                    <div className="k-colon">:</div>
                    <div className="k-value">{period.lopDays ?? '0'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings and Deductions Table */}
            <div className="slip-table-card">
              <table className="slip-breakdown-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '35%' }}>EARNINGS</th>
                    <th className="col-amount" style={{ width: '15%' }}>AMOUNT</th>
                    <th style={{ textAlign: 'left', width: '35%' }}>DEDUCTIONS</th>
                    <th className="col-amount" style={{ width: '15%' }}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: maxRows }, (_, i) => {
                    const eItem = earnList[i] || {};
                    const dItem = deductList[i] || {};
                    return (
                      <tr key={i}>
                        <td>{eItem.name || ''}</td>
                        <td className="col-amount">
                          {eItem.name ? formatCurrency(eItem.amount) : ''}
                        </td>
                        <td>{dItem.name || ''}</td>
                        <td className="col-amount">
                          {dItem.name ? formatCurrency(dItem.amount) : ''}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="row-totals">
                    <td>Gross Earnings</td>
                    <td className="col-amount">{formatCurrency(totals.totalEarnings)}</td>
                    <td>Total Deductions</td>
                    <td className="col-amount">{formatCurrency(totals.totalDeductions)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Net Payable Box */}
            <div className="slip-net-payable-box">
              <div className="slip-net-payable-left">
                <div className="net-title">TOTAL NET PAYABLE</div>
                <div className="net-formula">Gross Earnings - Total Deductions</div>
              </div>
              <div className="slip-net-payable-pill">
                {formatCurrency(totals.netSalary)}
              </div>
            </div>

            {/* Amount In Words */}
            <div className="slip-words-row">
              Amount In Words : {numberToWords(totals.netSalary)}
            </div>
          </div>

          {/* Footer Section - Pushed neatly to bottom of A4 page */}
          <div className="slip-content-footer">
            {/* System Generated Notice */}
            <div className="slip-system-notice">
              -- This is a system-generated document. --
            </div>

            {/* Bottom Powered By */}
            <div className="slip-bottom-footer">
              <span> </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}