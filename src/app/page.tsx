"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="landing-canvas">
      {/* Background blobs and geometric rings */}
      <div className="mesh-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        
        <div className="geo-ring ring-1"></div>
        <div className="geo-ring ring-2"></div>
        
        <div className="dot-grid"></div>
      </div>

      {/* Navigation */}
      <nav className="landing-nav">
        <Link href="#" className="nav-link">About</Link>
        <Link href="#" className="nav-link">Platform</Link>
        <Link href="/" className="nav-pill" style={{ background: 'var(--text)', color: 'var(--bg)' }}>Home</Link>
        <Link href="#" className="nav-link">Pricing</Link>
        <Link href="#" className="nav-link">Contact</Link>
      </nav>

      {/* Hero Content */}
      <main className="landing-content">
        <h1 className="hero-title">DATA,</h1>
        <h2 className="hero-subtitle">WITHOUT THE CODE</h2>
        
        <p className="hero-text">
          Assemble live business metrics, charts, and reports instantly. Connect your sources, build your visual narrative, and share immediately. The clarity of a data team, the speed of no-code.
        </p>

        {/* Pill CTA from reference */}
        <Link href="/dashboard" className="btn btn-outline" style={{ padding: '8px 8px 8px 32px' }}>
          <span>Login</span>
          <span style={{ margin: '0 16px', opacity: 0.3 }}>|</span>
          <span style={{ fontWeight: 600 }}>Start building →</span>
        </Link>
      </main>
    </div>
  );
}
