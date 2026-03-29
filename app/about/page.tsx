// About page - this is a server component (no "use client" needed)
// This serves as the second route required by the assignment
export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        padding: 32,
      }}
    >
      {/* Container for the text content */}
      <div
        style={{
          maxWidth: 600,
          textAlign: "center",
          color: "#fff",
        }}
      >
        {/* Page title */}
        <h2 style={{ marginBottom: 16 }}>About</h2>
        {/* Description of what the app does */}
        <p>This app uses the Alpha Vantage API to look up real-time stock quotes</p>
      </div>
    </main>
  );
}
