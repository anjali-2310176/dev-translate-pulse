"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="landing-theme">
      {/* Background treatment: Large soft-focus blurred blobs */}
      <div className="landing-blobs">
        <div className="blob-shape blob-peach"></div>
        <div className="blob-shape blob-coral"></div>
        {mounted && <div className="blob-shape blob-mint"></div>}

        {/* Thin outlined circles overlapping blobs for depth */}
        <div className="geo-outline outline-1"></div>
        <div className="geo-outline outline-2"></div>
      </div>

      {/* Optional floating element */}
      <div className="floating-action">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </div>

      {/* Navigation */}
      <nav className="landing-nav-bar">
        <div className="dot-grid-icon">
          <div></div><div></div><div></div>
          <div></div><div></div><div></div>
          <div></div><div></div><div></div>
        </div>

        <div className="nav-links-center">
          <Link href="#" className="landing-link">About</Link>
          <Link href="#" className="landing-link">Services</Link>
          <Link href="#" className="landing-link">Reviews</Link>
          <Link href="#" className="landing-link">Contact</Link>
        </div>

        <div className="landing-link-active">
          Pulse
        </div>
      </nav>

      {/* Hero */}
      <main className="landing-hero">
        <h1 className="landing-headline">PULSE</h1>
        <h2 className="landing-subhead">Data without the code.</h2>
        
        <p className="landing-body">
          Instantly transform your raw logistics and operations data into decision-ready visual narratives.
        </p>

        {/* CTA Group: Single Continue action */}
        <div className="cta-group">
          <Link href="/dashboard" className="cta-item" style={{ padding: '16px 40px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Continue</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
