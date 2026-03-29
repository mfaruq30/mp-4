# Stock Tracker

A Next.js app that looks up real-time stock quotes using the Alpha Vantage API.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

3. Create a `.env.local` file at the root of the project:
   ```
   ALPHA_VANTAGE_KEY="your-key-here"
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  about/
    page.tsx          ← About page (second route)
  api/
    quote/
      route.ts        ← API route that hides the key server-side
  globals.css
  layout.tsx          ← Root layout with metadata
  page.tsx            ← Home page with stock lookup
.env.local            ← API key stored here (gitignored)
```
