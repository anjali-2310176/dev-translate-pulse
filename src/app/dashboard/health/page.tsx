"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

// Recharts Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-soft)' }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-muted)' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: payload[0].color || 'var(--accent-primary)' }}>
          {payload[0].name}: {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// Data sets
const VELOCITY_DATA = [
  { sprint: 'Sprint 38', completed: 85, planned: 90 },
  { sprint: 'Sprint 39', completed: 92, planned: 85 },
  { sprint: 'Sprint 40', completed: 78, planned: 95 },
  { sprint: 'Sprint 41', completed: 95, planned: 90 },
  { sprint: 'Sprint 42 (Current)', completed: 42, planned: 95 },
];

const TECH_DEBT_DATA = [
  { name: 'Core API', value: 45 },
  { name: 'Payment Gateway', value: 30 },
  { name: 'Mobile Client', value: 15 },
  { name: 'Auth Service', value: 10 },
];

const PIE_COLORS = ['var(--danger)', 'var(--warning)', 'var(--accent-primary)', 'var(--success)'];

export default function ProjectHealthPage() {
  return (
    <>
      <div className="dash-header-row">
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>Project Health</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px' }}>Executive tracking of engineering velocity, technical debt, and risk.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-secondary" style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>Export Executive PDF</button>
        </div>
      </div>

      {/* TOP LEVEL STATUS */}
      <div className="glass-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Overall Project Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 12px var(--success)' }}></div>
            <h1 style={{ fontSize: '36px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>On Track</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', lineHeight: 1.5 }}>
            The Q3 Mobile App Launch is currently tracking to schedule. Sprint velocity remains stable, though technical debt in the Payment Gateway is rising and requires monitoring.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '24px', paddingRight: '24px' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Target Release</div>
            <div style={{ fontSize: '20px', fontWeight: 600 }}>Oct 15, 2026</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Confidence Score</div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--success)' }}>92%</div>
          </div>
        </div>
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        
        {/* VELOCITY CHART */}
        <div className="glass-card">
          <h3 className="card-title">Sprint Velocity (Points Delivered vs Planned)</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VELOCITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="sprint" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="completed" name="Points Completed" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={3} />
                <Area type="monotone" dataKey="planned" name="Points Planned" stroke="var(--text-muted)" fill="none" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RISK & ISSUES FEED */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 24px 0' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Executive Risk Assessment</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)', marginTop: '6px', flexShrink: 0 }}></div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Payment API Refactor</span>
                  <span className="tag warning">Medium Risk</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  The migration to the new Stripe endpoints is 3 days behind schedule due to unexpected legacy test failures.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', marginTop: '6px', flexShrink: 0 }}></div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Auth0 Migration</span>
                  <span className="tag" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>Resolved</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Successfully rolled out to 100% of users. The login spike issue from last week is fully resolved.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CHARTS GRID 2 */}
      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 2fr', marginTop: '24px' }}>
        
        <div className="glass-card">
          <h3 className="card-title">Technical Debt Distribution</h3>
          <div style={{ height: '260px', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TECH_DEBT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {TECH_DEBT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '12px' }}>
            {TECH_DEBT_DATA.map((item, i) => (
              <span key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i] }}></div> {item.name}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 className="card-title">Code Churn by Repository</h3>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TECH_DEBT_DATA} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-primary)', fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="value" name="Churn Score" radius={[0, 4, 4, 0]} fill="var(--accent-primary)" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </>
  );
}
