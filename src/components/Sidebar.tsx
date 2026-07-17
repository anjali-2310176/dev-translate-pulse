"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
  ),
  translate: (
    <svg viewBox="0 0 24 24"><path d="M4 5h7"/><path d="M9 3v2c0 4.418-2.239 8-5 8"/><path d="M5 9c.003 2.756 2.236 5.455 5 7"/><path d="M12 21l3-6 3 6"/><path d="M13.5 18h3"/></svg>
  ),
  flow: (
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M6 9v3a1 1 0 001 1h4"/><path d="M18 9v3a1 1 0 01-1 1h-4"/></svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
  ),
  digest: (
    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
  ),
};

const navItems = [
  { href: "/", label: "Executive Summary", icon: icons.dashboard },
  { href: "/translate", label: "Translation Engine", icon: icons.translate },
  { href: "/flow", label: "Flowchart Studio", icon: icons.flow },
  { href: "/chat", label: "Q&A Sandbox", icon: icons.chat },
  { href: "/digest", label: "Digest Generator", icon: icons.digest },
  { href: "/activity", label: "Activity Feed", icon: icons.activity },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Image
          src="/logo.png"
          alt="DevTranslate"
          width={36}
          height={36}
          className="sidebar-logo-img"
        />
        <div>
          <h1>DevTranslate</h1>
          <span>Workspace Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Platform</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="sidebar-section-label">System</div>
        <Link href="#" style={{ opacity: 0.45, pointerEvents: "none" }}>
          <span className="nav-icon">{icons.settings}</span>
          Settings
        </Link>
      </nav>

      <div className="sidebar-version">
        DevTranslate v1.0
      </div>
    </aside>
  );
}
