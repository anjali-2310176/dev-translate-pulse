"use client";

import { useState } from "react";

// Fictional Company: AeroFlow Freight
// Persona: VP of Operations

export default function DashboardPage() {
  const [hoveredNode, setHoveredNode] = useState<{x: number, y: number} | null>(null);
  const [activeKpi, setActiveKpi] = useState<number>(0);

  // Crosshair handler for the signature interaction
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

  return (
    <>
      <div className="dash-header-row">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em' }}>Operations Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Real-time logistics performance for AeroFlow Hubs</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <option>Today, Oct 24</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <button className="btn btn-primary">Export Report</button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="kpi-grid">
        <div 
          className="card kpi-card" 
          style={{ cursor: 'pointer', border: activeKpi === 0 ? '2px solid var(--accent-primary)' : '1px solid var(--border)' }}
          onClick={() => setActiveKpi(0)}
        >
          <span className="kpi-label">Active Dispatches</span>
          <div className="kpi-value">1,492</div>
          <div><span className="kpi-delta up">↑ 4.2%</span> <span style={{fontSize: '11px', color: 'var(--text-muted)'}}>vs yesterday</span></div>
        </div>
        <div 
          className="card kpi-card"
          style={{ cursor: 'pointer', border: activeKpi === 1 ? '2px solid var(--accent-primary)' : '1px solid var(--border)' }}
          onClick={() => setActiveKpi(1)}
        >
          <span className="kpi-label">On-Time Delivery (SLA)</span>
          <div className="kpi-value">94.8%</div>
          <div><span className="kpi-delta down">↓ 1.1%</span> <span style={{fontSize: '11px', color: 'var(--text-muted)'}}>vs yesterday</span></div>
        </div>
        <div 
          className="card kpi-card"
          style={{ cursor: 'pointer', border: activeKpi === 2 ? '2px solid var(--accent-primary)' : '1px solid var(--border)' }}
          onClick={() => setActiveKpi(2)}
        >
          <span className="kpi-label">Idle Fleet Capacity</span>
          <div className="kpi-value">8.4%</div>
          <div><span className="kpi-delta up">↑ 2.0%</span> <span style={{fontSize: '11px', color: 'var(--text-muted)'}}>vs yesterday</span></div>
        </div>
        <div 
          className="card kpi-card"
          style={{ cursor: 'pointer', border: activeKpi === 3 ? '2px solid var(--accent-primary)' : '1px solid var(--border)' }}
          onClick={() => setActiveKpi(3)}
        >
          <span className="kpi-label">Est. Daily Margin</span>
          <div className="kpi-value">$24,500</div>
          <div><span className="kpi-delta up">↑ 12.5%</span> <span style={{fontSize: '11px', color: 'var(--text-muted)'}}>vs yesterday</span></div>
        </div>
      </div>

      {/* CHARTS GRID 1: LINE & BAR */}
      <div className="charts-grid">
        <div className="card chart-area">
          <h3 className="card-title">Delivery SLA Trend (12 Hours)</h3>
          <div style={{ height: '240px', width: '100%', position: 'relative' }}>
            <svg 
              viewBox="0 0 600 200" 
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
              onMouseMove={(e) => handleMouseMove(e, 600, 200)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Grid */}
              <g className="chart-grid">
                <line x1="0" y1="0" x2="600" y2="0" />
                <line x1="0" y1="50" x2="600" y2="50" />
                <line x1="0" y1="100" x2="600" y2="100" />
                <line x1="0" y1="150" x2="600" y2="150" />
                <line x1="0" y1="200" x2="600" y2="200" />
              </g>
              <g className="chart-axis">
                <text x="-10" y="200" textAnchor="end">80%</text>
                <text x="-10" y="100" textAnchor="end">90%</text>
                <text x="-10" y="0" textAnchor="end">100%</text>
              </g>

              {/* Data Line */}
              <path 
                d="M 0 60 C 100 80, 200 40, 300 100 S 400 140, 500 90 S 550 50, 600 20" 
                fill="none" 
                stroke="var(--accent-primary)" 
                strokeWidth="2"
              />
              
              {/* Area Fill */}
              <path 
                d="M 0 200 L 0 60 C 100 80, 200 40, 300 100 S 400 140, 500 90 S 550 50, 600 20 L 600 200 Z" 
                fill="url(#line-grad)" 
              />
              <defs>
                <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Signature Crosshair */}
              {hoveredNode && (
                <>
                  <line x1={hoveredNode.x} y1="0" x2={hoveredNode.x} y2="200" className="crosshair-line" style={{opacity: 1}} />
                  <line x1="0" y1={hoveredNode.y} x2="600" y2={hoveredNode.y} className="crosshair-line" style={{opacity: 1}} />
                  <circle cx={hoveredNode.x} cy={hoveredNode.y} r="4" fill="var(--surface)" stroke="var(--accent-primary)" strokeWidth="2" style={{pointerEvents: 'none'}} />
                </>
              )}
            </svg>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Volume by Region</h3>
          <div style={{ height: '240px', width: '100%' }}>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <g className="chart-grid">
                <line x1="0" y1="0" x2="300" y2="0" />
                <line x1="0" y1="100" x2="300" y2="100" />
                <line x1="0" y1="200" x2="300" y2="200" />
              </g>
              <g className="chart-axis">
                <text x="50" y="220" textAnchor="middle">East</text>
                <text x="150" y="220" textAnchor="middle">Mid</text>
                <text x="250" y="220" textAnchor="middle">West</text>
              </g>
              
              <rect x="30" y="40" width="40" height="160" fill="var(--accent-primary)" rx="4" />
              <rect x="130" y="90" width="40" height="110" fill="var(--accent-primary)" rx="4" opacity="0.8" />
              <rect x="230" y="140" width="40" height="60" fill="var(--accent-primary)" rx="4" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>

      {/* CHARTS GRID 2: DONUT, PROGRESS, FEED/ALERTS */}
      <div className="charts-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        
        <div className="card">
          <h3 className="card-title">Hub Capacity Utilization</h3>
          <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg viewBox="0 0 120 120" style={{ width: '140px', height: '140px' }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-light)" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent-primary)" strokeWidth="12" strokeDasharray="314" strokeDashoffset="47" strokeLinecap="round" style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }} />
              <circle cx="60" cy="60" r="34" fill="none" stroke="var(--border-light)" strokeWidth="8" />
              <circle cx="60" cy="60" r="34" fill="none" stroke="var(--warning)" strokeWidth="8" strokeDasharray="213" strokeDashoffset="120" strokeLinecap="round" style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }} />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>85%</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)'}}></div> Core Routes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)'}}></div> Overflow</span>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Top Performing Routes</h3>
          <div className="progress-list">
            <div>
              <div className="progress-item-header"><span>ORD → EWR</span> <span className="data-text">98%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: '98%' }}></div></div>
            </div>
            <div>
              <div className="progress-item-header"><span>LAX → DEN</span> <span className="data-text">94%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: '94%' }}></div></div>
            </div>
            <div>
              <div className="progress-item-header"><span>DFW → ATL</span> <span className="data-text">88%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: '88%' }}></div></div>
            </div>
            <div>
              <div className="progress-item-header"><span>MIA → JFK</span> <span className="data-text">76%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: '76%', background: 'var(--warning)' }}></div></div>
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 24px 0' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Active Issues</h3>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500, cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', marginTop: '6px' }}></div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Weather Delay</span>
                  <span className="tag danger">High</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Snowstorm impacting I-80. 14 trucks stalled near Cheyenne.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', marginTop: '6px' }}></div>
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
