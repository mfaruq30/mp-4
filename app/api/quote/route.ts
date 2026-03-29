// Import NextResponse to send JSON responses
import { NextResponse } from "next/server";

// API route handler - this runs on the server side
// GET method means it handles GET requests to /api/quote
export async function GET(req: Request) {
  // Get the query parameters from the URL
  // Example: /api/quote?symbol=AAPL
  const { searchParams } = new URL(req.url);
  // Get the "symbol" parameter and trim whitespace, convert to uppercase
  const symbol = (searchParams.get("symbol") || "").trim().toUpperCase();

  // Check if symbol is empty - if so, return error
  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  // Get the Alpha Vantage API key from environment variables
  // This keeps the key secret (doesn't expose it to the client)
  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  // If the key isn't set, return error
  if (!apiKey) {
    return NextResponse.json({ error: "Server missing key" }, { status: 500 });
  }

  // Build the URL for the Alpha Vantage API
  // GLOBAL_QUOTE returns the latest price info for a single ticker
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;

  try {
    // Make the request to Alpha Vantage API
    // cache: "no-store" means don't cache the response
    const result = await fetch(url, { cache: "no-store" });
    // Check if the request was successful
    if (!result.ok) {
      return NextResponse.json(
        { error: "API error", status: result.status },
        { status: 502 }
      );
    }

    // Parse the JSON response from Alpha Vantage
    const data = await result.json();

    // Check if we got rate limited or an error message
    if (data["Note"] || data["Information"]) {
      return NextResponse.json(
        { error: "API rate limit reached. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    // Extract the quote data from the response
    const quote = data["Global Quote"];

    // If no quote data, the symbol was probably invalid
    if (!quote || Object.keys(quote).length === 0) {
      return NextResponse.json(
        { error: `No data found for symbol "${symbol}"` },
        { status: 404 }
      );
    }

    // Return a cleaned-up version of the quote data
    // Alpha Vantage uses numbered keys like "01. symbol" so we clean them up
    return NextResponse.json({
      symbol: quote["01. symbol"],
      open: quote["02. open"],
      high: quote["03. high"],
      low: quote["04. low"],
      price: quote["05. price"],
      volume: quote["06. volume"],
      latestDay: quote["07. latest trading day"],
      previousClose: quote["08. previous close"],
      change: quote["09. change"],
      changePercent: quote["10. change percent"],
    });
  } catch {
    // If anything goes wrong (network error, etc), return error
    return NextResponse.json({ error: "Network failed" }, { status: 502 });
  }
}
