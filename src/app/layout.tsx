import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevTranslate | Workspace Intelligence",
  description:
    "Transform technical GitHub activity, architecture states, and Jira tasks into clean, non-technical visual dashboards and plain-language progress briefs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="landing-blobs">
          <div className="blob-shape blob-peach"></div>
          <div className="blob-shape blob-coral"></div>
          <div className="blob-shape blob-mint"></div>
          <div className="geo-outline outline-1"></div>
          <div className="geo-outline outline-2"></div>
        </div>
        
        {/* We need a wrapper with position relative and z-index 1 so the content sits above the fixed blobs */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
