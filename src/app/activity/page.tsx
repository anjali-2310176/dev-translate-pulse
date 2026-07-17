"use client";

const mockActivity = [
  { time: "2 hours ago", title: "Payment Gateway Integration at 72%", desc: "Stripe v3 migration checkpoint reached. Core payment flow is functional, pending sandbox testing.", type: "milestone" },
  { time: "4 hours ago", title: "Security Enhancement Shipped", desc: "User sessions are now protected with rotating credentials. Customer accounts are better safeguarded against unauthorized access.", type: "shipped" },
  { time: "6 hours ago", title: "Performance Boost Deployed", desc: "The platform can now handle 3x more simultaneous users during peak traffic without slowdowns.", type: "shipped" },
  { time: "Yesterday", title: "Blocker Identified: Payment Sandbox Down", desc: "Third-party payment provider is undergoing scheduled maintenance. Integration testing is temporarily paused.", type: "blocker" },
  { time: "Yesterday", title: "Database Migration Complete", desc: "All customer data has been successfully moved to the upgraded database system, improving reliability and speed.", type: "shipped" },
  { time: "2 days ago", title: "Mobile App Progress Update", desc: "Push notification service has been rebuilt to support the latest standards. Beta launch timeline remains on track.", type: "milestone" },
  { time: "2 days ago", title: "Deployment Pipeline Upgraded", desc: "Engineering can now ship new features and fixes 40% faster, reducing the gap between development and customer availability.", type: "shipped" },
  { time: "3 days ago", title: "Sprint 14 Kicked Off", desc: "Payment and Security Hardening sprint started with 6 engineers and 1 DevOps specialist. Target: 48 story points.", type: "milestone" },
];

const typeColors: Record<string, string> = {
  shipped: "var(--green)",
  milestone: "var(--accent)",
  blocker: "var(--red)",
};

const typeLabels: Record<string, string> = {
  shipped: "SHIPPED",
  milestone: "MILESTONE",
  blocker: "BLOCKER",
};

export default function ActivityPage() {
  return (
    <>
      <header className="page-header">
        <h2>Activity Feed</h2>
        <p>A timeline of translated engineering updates in plain business language</p>
      </header>

      <div className="page-body">
        <div style={{ maxWidth: "720px" }}>
          <div className="timeline">
            {mockActivity.map((item, i) => (
              <div
                className="timeline-item"
                key={i}
                style={{
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <style>{`
                  .timeline-item:nth-child(${i + 1})::before {
                    background: ${typeColors[item.type]} !important;
                    box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.08) !important;
                  }
                `}</style>
                <div className="timeline-time">
                  {item.time}
                  <span
                    className={`badge ${item.type === "shipped" ? "green" : item.type === "blocker" ? "red" : "purple"}`}
                    style={{ marginLeft: "8px" }}
                  >
                    {typeLabels[item.type]}
                  </span>
                </div>
                <div className="timeline-title">{item.title}</div>
                <div className="timeline-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
