// This is a client component so we can use useState and other React hooks
"use client";
// Import useState to manage component state
import { useState } from "react";

// Main home page component - this is the stock lookup page
export default function Home() {
  // State for the user's input (what they type in the search box)
  const [symbol, setSymbol] = useState("");
  // State for storing the result from the API
  const [result, setResult] = useState("");
  // State for storing any error messages
  const [error, setError] = useState("");
  // State to track if we're currently loading (so we can disable the button)
  const [loading, setLoading] = useState(false);

  // This function runs when user clicks the Search button
  async function handleSearch() {
    // Clear any previous errors or results
    setError("");
    setResult("");
    // Set loading to true so button shows "Loading..."
    setLoading(true);
    try {
      // Make a GET request to our API route with the user's symbol
      // encodeURIComponent makes sure special characters are safe for URLs
      const res = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
      // Convert the response to JSON
      const data = await res.json();
      // Check if there's an error in the response
      if (data.error) {
        setError(data.error);
      } else {
        // If no error, build a readable result string to display
        setResult(
          `${data.symbol}: $${parseFloat(data.price).toFixed(2)} (${parseFloat(data.change) >= 0 ? "+" : ""}${parseFloat(data.change).toFixed(2)}, ${data.changePercent})`
        );
      }
    } catch {
      // If the fetch itself fails (network error, etc), show error
      setError("Failed to fetch quote.");
    } finally {
      // Always turn off loading when done (whether success or error)
      setLoading(false);
    }
  }

  // Return the JSX that renders the page
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 16,
      }}
    >
      {/* Link to the about page - positioned in top right corner */}
      <a
        href="/about"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          padding: "8px 16px",
          border: "1px solid #fff",
          textDecoration: "none",
          color: "#fff",
        }}
      >
        About
      </a>
      {/* Title of the app */}
      <h1>Stock Tracker</h1>
      {/* Container for input and button, side by side */}
      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 600 }}>
        {/* Input field where user types a stock ticker */}
        <input
          style={{ flex: 1, padding: 8, border: "1px solid #fff" }}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="e.g. AAPL, TSLA, SPY"
        />
        {/* Button to submit the search */}
        <button
          onClick={handleSearch}
          disabled={!symbol || loading}
          style={{ border: "1px solid #fff", padding: 8, background: "transparent", color: "#fff" }}
        >
          {/* Show different text based on loading state */}
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {/* Conditionally render error message if there's an error */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {/* Conditionally render result if we got one */}
      {result && (
        <p>
          <b>Result: </b>
          {result}
        </p>
      )}
    </main>
  );
}
