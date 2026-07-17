"use client";

import { useEffect, useState } from "react";

// Mock Data
const KPIs = [
  { label: "Monthly Recurring Revenue", value: "$124,500", delta: "+12.5%", trend: "up" },
  { label: "Active Customers", value: "1,492", delta: "+4.2%", trend: "up" },
  { label: "Churn Rate", value: "2.1%", delta: "-0.4%", trend: "up" }, // down churn is good (up trend visually for positive)
  { label: "Customer Acquisition Cost", value: "$412", delta: "+8.1%", trend: "down" }
];

const ProgressData = [
  { label: "Enterprise Tier Goal", current: 75 },
  { label: "Q3 Sales Target", current: 42 },
  { label: "Infrastructure Migration", current: 90 },
];

const Alerts = [
  { title: "High API Latency Detected", severity: "danger", time: "2m ago" },
  { title: "Payment Gateway Deprecation", severity: "warning", time: "4h ago" },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <div className="dash-header">
        <h2>Executive Summary</h2>
        <p>Real-time overview of your business metrics</p>
      </div>

      <div className="kpi-grid">
        {KPIs.map((kpi, i) => (
          <div key={i} className="card kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">{kpi.label}</span>
              <div className="kpi-icon">
                {/* SVG Icon Placeholder based on index */}
                {i === 0 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                {i === 1 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                {i === 2 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
                {i === 3 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>}
              </div>
            </div>
            <div className="kpi-value data-text">{kpi.value}</div>
            <div>
              <span className={`kpi-delta ${kpi.trend}`}>
                {kpi.trend === 'up' ? '↑' : '↓'} {kpi.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">Revenue Trend (30 Days)</h3>
          <div style={{ height: '200px', width: '100%' }}>
            <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <g className="chart-grid">
                <line x1="0" y1="0" x2="400" y2="0" />
                <line x1="0" y1="37.5" x2="400" y2="37.5" />
                <line x1="0" y1="75" x2="400" y2="75" />
                <line x1="0" y1="112.5" x2="400" y2="112.5" />
                <line x1="0" y1="150" x2="400" y2="150" />
              </g>
              <g className="chart-axis">
                <text x="-5" y="150" textAnchor="end">0k</text>
                <text x="-5" y="75" textAnchor="end">50k</text>
                <text x="-5" y="0" textAnchor="end">100k</text>
              </g>
              <path 
                d="M0 120 C 50 110, 100 130, 150 90 S 250 110, 300 60 S 350 40, 400 20" 
                fill="none" 
                stroke="var(--accent)" 
                strokeWidth="3"
                strokeLinecap="round"
                className={mounted ? "draw-line" : ""}
                style={{ strokeDasharray: 1000, strokeDashoffset: mounted ? 0 : 1000, transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
              {/* Data points */}
              <circle cx="150" cy="90" r="4" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
              <circle cx="300" cy="60" r="4" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
              <circle cx="400" cy="20" r="4" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
              
              {/* Soft area under line */}
              <path 
                d="M0 150 L 0 120 C 50 110, 100 130, 150 90 S 250 110, 300 60 S 350 40, 400 20 L 400 150 Z" 
                fill="url(#gradient-area)" 
                opacity="0.3"
              />
              <defs>
                <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--surface)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">User Segments</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg viewBox="0 0 120 120" style={{ width: '150px', height: '150px' }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="12" />
              {mounted && (
                <>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" strokeWidth="12" strokeDasharray="314" strokeDashoffset="80" strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out', transformOrigin: 'center', transform: 'rotate(-90deg)' }} />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--warning)" strokeWidth="12" strokeDasharray="314" strokeDashoffset="280" strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out 0.2s', transformOrigin: 'center', transform: 'rotate(150deg)' }} />
                </>
              )}
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>84%</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pro Users</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Weekly Signups</h3>
          <div style={{ height: '200px', width: '100%' }}>
            <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <g className="chart-grid">
                <line x1="0" y1="0" x2="400" y2="0" />
                <line x1="0" y1="50" x2="400" y2="50" />
                <line x1="0" y1="100" x2="400" y2="100" />
                <line x1="0" y1="150" x2="400" y2="150" />
              </g>
              <g className="chart-axis">
                <text x="-5" y="150" textAnchor="end">0</text>
                <text x="-5" y="75" textAnchor="end">100</text>
                <text x="-5" y="0" textAnchor="end">200</text>
              </g>
              {[120, 80, 150, 90, 110, 140, 60].map((val, i) => (
                <rect 
                  key={i}
                  x={i * 55 + 20} 
                  y={150 - (val / 200) * 150} 
                  width="35" 
                  height={(val / 200) * 150} 
                  fill="var(--accent)" 
                  rx="4"
                  style={{ transformOrigin: 'bottom', transform: mounted ? 'scaleY(1)' : 'scaleY(0)', transition: `transform 0.5s ease-out ${i * 0.1}s` }}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3 className="card-title">Key Milestones</h3>
          <div className="progress-list">
            {ProgressData.map((item, i) => (
              <div key={i}>
                <div className="progress-item-header">
                  <span>{item.label}</span>
                  <span className="data-text" style={{ color: 'var(--text-muted)' }}>{item.current}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: mounted ? `${item.current}%` : '0%', background: 'var(--accent)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Active Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Alerts.map((alert, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i < Alerts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{alert.title}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{alert.time}</span>
                </div>
                <div className={`alert-tag ${alert.severity}`}>
                  {alert.severity.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
