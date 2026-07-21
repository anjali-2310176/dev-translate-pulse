"use client";

import React, { useState, useEffect } from 'react';
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

const PIE_COLORS = ['var(--danger)', 'var(--warning)', 'var(--accent-primary)', 'var(--success)'];

export default function ProjectHealthPage() {
  const [velocityData, setVelocityData] = useState<any[]>([]);
  const [techDebtData, setTechDebtData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [repoName, setRepoName] = useState('Loading...');

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const res = await fetch('/api/github/health');
        if (res.ok) {
          const data = await res.json();
          setVelocityData(data.velocity);
          setTechDebtData(data.techDebt);
          setRepoName(data.repo);
        }
      } catch (error) {
        console.error("Failed to fetch live github data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGitHubData();
  }, []);

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
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>GitHub Rate Limit</span>
                  <span className="tag warning">Monitor</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Live data is being fetched from {repoName}. Ensure PAT is configured to avoid rate limits.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', marginTop: '6px', flexShrink: 0 }}></div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Live Integration</span>
                  <span className="tag" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>Active</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Successfully connected to the live GitHub API. Pulling real-time PR and commit metrics.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CHARTS GRID 2 */}
      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 2fr', marginTop: '24px' }}>
        
        <div className="glass-card">
          <h3 className="card-title">Code Churn by Subsystem</h3>
          <div style={{ height: '260px', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={techDebtData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {techDebtData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '12px' }}>
            {techDebtData.map((item: any, i: number) => (
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
              <BarChart data={techDebtData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
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
