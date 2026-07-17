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
        {children}
      </body>
    </html>
  );
}
