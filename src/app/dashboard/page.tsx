"use client";

import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

// Recharts Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-soft)' }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-muted)' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: payload[0].color || 'var(--accent-primary)' }}>
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// Data sets
const VOL_DATA = [
  { time: '08:00', value: 1200 }, { time: '09:00', value: 1800 }, { time: '10:00', value: 3200 },
  { time: '11:00', value: 2900 }, { time: '12:00', value: 4100 }, { time: '13:00', value: 3800 },
  { time: '14:00', value: 5200 }, { time: '15:00', value: 4800 }, { time: '16:00', value: 6100 }
];

const SLA_DATA = [
  { time: '08:00', value: 92 }, { time: '09:00', value: 94 }, { time: '10:00', value: 89 },
  { time: '11:00', value: 96 }, { time: '12:00', value: 98 }, { time: '13:00', value: 95 },
  { time: '14:00', value: 97 }, { time: '15:00', value: 99 }, { time: '16:00', value: 96 }
];

const REGION_DATA = [
  { name: 'East', value: 4000 },
  { name: 'Midwest', value: 3000 },
  { name: 'West', value: 2000 },
];

const HUB_CAPACITY_DATA = [
  { name: 'Core Routes', value: 85 },
  { name: 'Overflow', value: 10 },
  { name: 'Available', value: 5 },
];

const PIE_COLORS = ['var(--accent-primary)', 'var(--warning)', 'var(--border-light)'];

const KPI_DATA = [
  { label: "Active Dispatches", value: 1492, prefix: "", suffix: "", delta: "+4.2%", deltaDir: "up" as const, compare: "vs yesterday", data: VOL_DATA, title: "Dispatch Volume (Today)", color: "var(--accent-primary)" },
  { label: "On-Time Delivery (SLA)", value: 94.8, prefix: "", suffix: "%", delta: "-1.1%", deltaDir: "down" as const, compare: "vs yesterday", data: SLA_DATA, title: "SLA Compliance (Today)", color: "var(--success)" },
  { label: "Idle Fleet Capacity", value: 8.4, prefix: "", suffix: "%", delta: "+2.0%", deltaDir: "up" as const, compare: "vs yesterday", data: VOL_DATA, title: "Fleet Utilization", color: "var(--warning)" },
  { label: "Est. Daily Margin", value: 24500, prefix: "$", suffix: "", delta: "+12.5%", deltaDir: "up" as const, compare: "vs yesterday", data: SLA_DATA, title: "Revenue Trend", color: "var(--accent-primary)" },
];

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1200 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value, duration]);

  const formatted = value >= 1000
    ? Math.round(display).toLocaleString()
    : display % 1 !== 0
      ? display.toFixed(1)
      : Math.round(display).toLocaleString();

  return <>{prefix}{formatted}{suffix}</>;
}

export default function DashboardPage() {
  const [activeKpi, setActiveKpi] = useState(0);
  const [timeRange, setTimeRange] = useState("today");
  const [refreshing, setRefreshing] = useState(false);
  
  const activeData = KPI_DATA[activeKpi];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <>
      <div className="dash-header-row">
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>Operations Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px' }}>Real-time logistics performance for AeroFlow Hubs</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', fontSize: '13px', color: 'var(--text-secondary)' }}
          >
            <option value="today">Today, Oct 24</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button className="btn btn-primary" style={{ padding: '8px 20px' }}>Export Report</button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="kpi-grid">
        {KPI_DATA.map((kpi, i) => (
          <div
            key={kpi.label}
            className="glass-card kpi-card"
            style={{
              cursor: 'pointer',
              border: activeKpi === i ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.6)',
              transform: activeKpi === i ? 'translateY(-2px)' : 'none',
            }}
            onClick={() => setActiveKpi(i)}
          >
            <span className="kpi-label">{kpi.label}</span>
            <div className="kpi-value" style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-display)', margin: '8px 0' }}>
              <AnimatedNumber value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
            </div>
            <div>
              <span className={`kpi-delta ${kpi.deltaDir}`}>
                {kpi.deltaDir === 'up' ? '↑' : '↓'} {kpi.delta.replace(/[+-]/, '')}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>{kpi.compare}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS GRID 1: Dynamic Line & Bar */}
      <div className="charts-grid">
        <div className="glass-card chart-area">
          <h3 className="card-title">{activeData.title}</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeData.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={activeData.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke={activeData.color} fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: activeData.color }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="card-title">Volume by Region</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {REGION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--accent-primary)' : index === 1 ? '#F4A6A6' : 'var(--accent-soft)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS GRID 2: DONUT, PROGRESS, FEED */}
      <div className="charts-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        
        <div className="glass-card">
          <h3 className="card-title">Hub Capacity Utilization</h3>
          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={HUB_CAPACITY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {HUB_CAPACITY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>85%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Utilized</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '13px', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }}></div> Core Routes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }}></div> Overflow</span>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="card-title">Top Performing Routes</h3>
          <div className="progress-list" style={{ marginTop: '20px' }}>
            {[
              { route: "ORD > EWR", val: 98 },
              { route: "LAX > DEN", val: 94 },
              { route: "DFW > ATL", val: 88 },
              { route: "MIA > JFK", val: 76 },
            ].map((r) => (
              <div key={r.route} style={{ marginBottom: '24px' }}>
                <div className="progress-item-header" style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 500 }}>{r.route}</span> 
                  <span className="data-text" style={{ fontWeight: 600 }}>{r.val}%</span>
                </div>
                <div className="progress-track" style={{ height: '8px', background: 'rgba(0,0,0,0.05)' }}>
                  <div className="progress-fill" style={{ height: '100%', borderRadius: '100px', width: `${r.val}%`, background: r.val < 80 ? 'var(--warning)' : 'var(--accent-primary)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 24px 0' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Active Issues</h3>
            <span style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--danger)', marginTop: '6px', flexShrink: 0 }}></div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Weather Delay</span>
                  <span className="tag danger">High Priority</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>Snowstorm impacting I-80. 14 trucks stalled near Cheyenne.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)', marginTop: '6px', flexShrink: 0 }}></div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Maintenance</span>
                  <span className="tag warning">Medium</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>3 vehicles flagged for preventative brake inspection in ATL hub.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
