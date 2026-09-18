import { Clock, ChevronRight } from 'lucide-react';

export default function History({ records, onLoad }) {
  if (!records || records.length === 0) {
    return (
      <div className="card">
        <div className="card-title">
          <Clock size={17} className="icon" />
          History
        </div>
        <div className="history-empty">No salary slips generated yet.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">
        <Clock size={17} className="icon" />
        Recent Slips ({records.length})
      </div>
      <div className="history-list">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="history-item"
            id={`history-item-${rec.id}`}
            onClick={() => onLoad(rec)}
            title="Click to reload this slip"
          >
            <div>
              <div className="hi-name">{rec.employee.name || 'Unknown'}</div>
              <div className="hi-details">
                {rec.employee.designation && `${rec.employee.designation} · `}
                {rec.period.month}/{rec.period.year}
                {rec.company.name && ` · ${rec.company.name}`}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="hi-net">
                ₹{parseFloat(rec.totals.netSalary || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
