"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { section: "Analytics", items: [
      { name: "Overview", path: "/dashboard", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg> },
      { name: "Project Health", path: "/dashboard/health", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> }
    ]},
    { section: "Intelligence", items: [
      { name: "Translation Engine", path: "/dashboard/translate", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> },
      { name: "Sandbox Q&A", path: "/dashboard/chat", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
      { name: "Slack Digests", path: "/dashboard/digest", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> }
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
          {session ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {session.user?.image ? (
                  <img src={session.user.image} alt="User Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '12px' }}>
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{session.user?.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GitHub Developer</div>
                </div>
              </div>
              <button onClick={() => signOut()} style={{ fontSize: '12px', background: 'none', border: '1px solid var(--border)', padding: '6px', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-muted)', width: '100%' }}>
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={() => signIn("github")} style={{ fontSize: '13px', fontWeight: 500, background: 'var(--text-primary)', color: 'var(--bg)', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              Sign In with GitHub
            </button>
          )}
        </div>
      </aside>
      
      <main className="dash-main">
        {children}
      </main>
    </div>
  );
}
