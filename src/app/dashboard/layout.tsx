"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { section: "Analytics", items: [
      { name: "Overview", path: "/dashboard", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg> },
      { name: "Project Health", path: "/dashboard/health", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> }
    ]},
    { section: "Intelligence", items: [
      { name: "Translation Engine", path: "/dashboard/translate", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> },
      { name: "Sandbox Q&A", path: "/dashboard/chat", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
      { name: "Slack Digests", path: "/dashboard/digest", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> }
    ]},
    { section: "Management", items: [
      { name: "Settings", path: "#", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
    ]}
  ];

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="sidebar-header" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: 14, height: 14, background: 'var(--accent-primary)', borderRadius: '3px' }}></div>
              <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>Dev-Translate</span>
            </div>
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>DevTranslate</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Workspace Intelligence</p>
          </div>
        </Link>
        
        <nav className="sidebar-nav">
          {navItems.map(group => (
            <div key={group.section}>
              <div className="sidebar-section">{group.section}</div>
              {group.items.map(item => (
                <Link 
                  key={item.name} 
                  href={item.path} 
                  className={`sidebar-item ${pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '12px' }}>AS</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>ANJALI S.</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lead Developer</div>
            </div>
          </div>
        </div>
      </aside>
      
      <main className="dash-main">
        {children}
      </main>
    </div>
  );
}
