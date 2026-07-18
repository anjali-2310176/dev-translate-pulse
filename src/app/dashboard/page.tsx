"use client";

import { useState, useEffect, useRef } from "react";

// Simulated data sets that swap when a KPI card is selected
const DATA_SETS = [
  { label: "Active Dispatches", linePath: "M 0 60 C 100 80, 200 40, 300 100 S 400 140, 500 90 S 550 50, 600 20", areaPath: "M 0 200 L 0 60 C 100 80, 200 40, 300 100 S 400 140, 500 90 S 550 50, 600 20 L 600 200 Z", bars: [160, 110, 60], chartTitle: "Dispatch Volume (12 Hours)", yLabels: ["0", "750", "1500"] },
  { label: "On-Time Delivery", linePath: "M 0 120 C 80 100, 160 140, 240 80 S 360 40, 480 60 S 540 30, 600 50", areaPath: "M 0 200 L 0 120 C 80 100, 160 140, 240 80 S 360 40, 480 60 S 540 30, 600 50 L 600 200 Z", bars: [140, 80, 120], chartTitle: "SLA Compliance (12 Hours)", yLabels: ["80%", "90%", "100%"] },
  { label: "Idle Fleet", linePath: "M 0 180 C 100 160, 200 170, 300 140 S 400 100, 500 120 S 560 90, 600 60", areaPath: "M 0 200 L 0 180 C 100 160, 200 170, 300 140 S 400 100, 500 120 S 560 90, 600 60 L 600 200 Z", bars: [40, 80, 120], chartTitle: "Fleet Utilization (12 Hours)", yLabels: ["0%", "5%", "10%"] },
  { label: "Daily Margin", linePath: "M 0 150 C 80 130, 160 80, 300 60 S 400 30, 500 50 S 560 20, 600 10", areaPath: "M 0 200 L 0 150 C 80 130, 160 80, 300 60 S 400 30, 500 50 S 560 20, 600 10 L 600 200 Z", bars: [100, 140, 80], chartTitle: "Revenue Trend (12 Hours)", yLabels: ["$10K", "$20K", "$30K"] },
];

const KPI_DATA = [
  { label: "Active Dispatches", value: 1492, prefix: "", suffix: "", delta: "+4.2%", deltaDir: "up" as const, compare: "vs yesterday" },
  { label: "On-Time Delivery (SLA)", value: 94.8, prefix: "", suffix: "%", delta: "-1.1%", deltaDir: "down" as const, compare: "vs yesterday" },
  { label: "Idle Fleet Capacity", value: 8.4, prefix: "", suffix: "%", delta: "+2.0%", deltaDir: "up" as const, compare: "vs yesterday" },
  { label: "Est. Daily Margin", value: 24500, prefix: "$", suffix: "", delta: "+12.5%", deltaDir: "up" as const, compare: "vs yesterday" },
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
  const [hoveredNode, setHoveredNode] = useState<{x: number, y: number} | null>(null);
  const [activeKpi, setActiveKpi] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState("today");
  const [refreshing, setRefreshing] = useState(false);

  const activeData = DATA_SETS[activeKpi];
  const regions = ["East", "Mid", "West"];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>, maxW: number, maxH: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= 0 && x <= maxW && y >= 0 && y <= maxH) {
      setHoveredNode({ x, y });
    } else {
      setHoveredNode(null);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <>
      <div className="dash-header-row">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em' }}>Operations Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Real-time logistics performance for AeroFlow Hubs</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
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
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px', color: 'var(--text-secondary)' }}
          >
            <option value="today">Today, Oct 24</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button className="btn btn-primary">Export Report</button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="kpi-grid">
        {KPI_DATA.map((kpi, i) => (
          <div
            key={kpi.label}
            className="card kpi-card"
            style={{
              cursor: 'pointer',
              border: activeKpi === i ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setActiveKpi(i)}
          >
            <span className="kpi-label">{kpi.label}</span>
            <div className="kpi-value">
              <AnimatedNumber value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
            </div>
            <div>
              <span className={`kpi-delta ${kpi.deltaDir}`}>
                {kpi.deltaDir === 'up' ? '↑' : '↓'} {kpi.delta.replace(/[+-]/, '')}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>{kpi.compare}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS GRID 1: Dynamic Line & Bar */}
      <div className="charts-grid">
        <div className="card chart-area">
          <h3 className="card-title">{activeData.chartTitle}</h3>
          <div style={{ height: '240px', width: '100%', position: 'relative' }}>
            <svg
              viewBox="0 0 600 200"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
              onMouseMove={(e) => handleMouseMove(e, 600, 200)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <g className="chart-grid">
                {[0, 50, 100, 150, 200].map(y => <line key={y} x1="0" y1={y} x2="600" y2={y} />)}
              </g>
              <g className="chart-axis">
                {activeData.yLabels.map((label, i) => (
                  <text key={i} x="-10" y={200 - i * 100} textAnchor="end">{label}</text>
                ))}
              </g>
              <path d={activeData.areaPath} fill="url(#line-grad)" style={{ transition: 'all 0.5s ease' }} />
              <path d={activeData.linePath} fill="none" stroke="var(--accent-primary)" strokeWidth="2" style={{ transition: 'all 0.5s ease' }} />
              <defs>
                <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {hoveredNode && (
                <>
                  <line x1={hoveredNode.x} y1="0" x2={hoveredNode.x} y2="200" className="crosshair-line" style={{ opacity: 1 }} />
                  <line x1="0" y1={hoveredNode.y} x2="600" y2={hoveredNode.y} className="crosshair-line" style={{ opacity: 1 }} />
                  <circle cx={hoveredNode.x} cy={hoveredNode.y} r="4" fill="var(--surface)" stroke="var(--accent-primary)" strokeWidth="2" style={{ pointerEvents: 'none' }} />
                </>
              )}
            </svg>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Volume by Region</h3>
          <div style={{ height: '240px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <g className="chart-grid">
                <line x1="0" y1="0" x2="300" y2="0" />
                <line x1="0" y1="100" x2="300" y2="100" />
                <line x1="0" y1="200" x2="300" y2="200" />
              </g>
              <g className="chart-axis">
                {regions.map((r, i) => <text key={r} x={50 + i * 100} y="220" textAnchor="middle">{r}</text>)}
              </g>
              {activeData.bars.map((h, i) => (
                <g key={i}>
                  <rect
                    x={30 + i * 100} y={200 - h} width="40" height={h}
                    fill="var(--accent-primary)" rx="4"
                    opacity={hoveredBar === i ? 1 : 0.7 + i * 0.1}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  />
                  {hoveredBar === i && (
                    <>
                      <rect x={30 + i * 100} y={200 - h - 28} width="40" height="22" rx="4" fill="var(--text-primary)" />
                      <text x={50 + i * 100} y={200 - h - 13} fill="white" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle">{h}</text>
                    </>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* CHARTS GRID 2: DONUT, PROGRESS, FEED */}
      <div className="charts-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>

        <div className="card">
          <h3 className="card-title">Hub Capacity Utilization</h3>
          <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg viewBox="0 0 120 120" style={{ width: '140px', height: '140px' }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-light)" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent-primary)" strokeWidth="12" strokeDasharray="314" strokeDashoffset="47" strokeLinecap="round" style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 1s ease' }} />
              <circle cx="60" cy="60" r="34" fill="none" stroke="var(--border-light)" strokeWidth="8" />
              <circle cx="60" cy="60" r="34" fill="none" stroke="var(--warning)" strokeWidth="8" strokeDasharray="213" strokeDashoffset="120" strokeLinecap="round" style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>85%</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }}></div> Core Routes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }}></div> Overflow</span>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Top Performing Routes</h3>
          <div className="progress-list">
            {[
              { route: "ORD > EWR", val: 98 },
              { route: "LAX > DEN", val: 94 },
              { route: "DFW > ATL", val: 88 },
              { route: "MIA > JFK", val: 76 },
            ].map((r) => (
              <div key={r.route}>
                <div className="progress-item-header"><span>{r.route}</span> <span className="data-text">{r.val}%</span></div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${r.val}%`, background: r.val < 80 ? 'var(--warning)' : 'var(--accent-primary)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 24px 0' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Active Issues</h3>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500, cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', marginTop: '6px', flexShrink: 0 }}></div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Weather Delay</span>
                  <span className="tag danger">High</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Snowstorm impacting I-80. 14 trucks stalled near Cheyenne.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', marginTop: '6px', flexShrink: 0 }}></div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Maintenance</span>
                  <span className="tag warning">Med</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>3 vehicles flagged for preventative brake inspection in ATL hub.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
