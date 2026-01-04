
// Getevent.jsx
import React, { useState } from "react";

function Getevent() {
  const [date, setDate] = useState("");
  const [eventData, setEventData] = useState(null);
  const [parsedEvent, setParsedEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper: safely parse possible { raw: "stringified json" } responses
  function normalizeResponse(data) {
    if (!data) return null;
    if (typeof data === "object" && data.raw && typeof data.raw === "string") {
      try {
        return JSON.parse(data.raw);
      } catch {
        return { raw: data.raw };
      }
    }
    return data; // already an object from JSON
  }

  async function Saver() {
    if (!date) {
      //setError("Please select a date before fetching.");
      setEventData(null);
      setParsedEvent(null);
      return;
    }

    setError(null);
    setEventData(null);
    setParsedEvent(null);
    setIsLoading(true);

    try {
      const url =
        "https://hbd0z8nsy9.execute-api.us-east-1.amazonaws.com/default/Url-Short-Post";

      const response = await fetch(url, {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json", // keep this enabled for Lambda/API Gateway
        // },
        // IMPORTANT: send the correct key name if your backend expects UniqueId
        // If your Lambda reads `Id`, you can keep Id. Otherwise prefer UniqueId to match table.
        body: JSON.stringify({ Id: date }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `Request failed with status ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";
      const rawData = contentType.includes("application/json")
        ? await response.json()
        : { raw: await response.text() };

      const normalized = normalizeResponse(rawData);

      setEventData(rawData);
      setParsedEvent(normalized);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err?.message ||
          "Failed to fetch event data. Please check the API configuration."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="ge-container">
      <div className="ge-card">
        <header className="ge-header">
          <h1 className="ge-title">Event Lookup</h1>
          <p className="ge-sub">Find saved events by their date (UniqueId)</p>
        </header>

        <form
          className="ge-form"
          onSubmit={(e) => {
            e.preventDefault();
            Saver();
          }}
        >
          <div className="ge-controls">
            <div className="ge-field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                required
              />
              <small className="ge-hint">
                Use the same format used when saving the event.
              </small>
            </div>

            <div className="ge-actions">
              <button
                type="submit"
                className="ge-primary"
                disabled={!date || isLoading}
              >
                {isLoading ? "Fetching..." : "Get Event"}
              </button>
              <button
                type="button"
                className="ge-ghost"
                onClick={() => {
                  setDate("");
                  setEventData(null);
                  setParsedEvent(null);
                  setError(null);
                }}
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="ge-alert ge-error" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading && (
          <div className="ge-skeleton">
            <div className="ge-skel-line" />
            <div className="ge-skel-line short" />
            <div className="ge-skel-line" />
          </div>
        )}

        {parsedEvent && !isLoading && (
          <section className="ge-section">
            <h2 className="ge-section-title">Event Details</h2>

            <div className="ge-grid">
              <Detail label="UniqueId" value={parsedEvent.UniqueId} />
              <Detail label="Mode" value={parsedEvent.Mode} />
              <Detail label="Cash" value={parsedEvent.Cash} />
              <Detail label="Events" value={parsedEvent.Events} />
              <Detail
                label="Important"
                value={
                  typeof parsedEvent.Important === "number"
                    ? `${parsedEvent.Important}/10`
                    : parsedEvent.Important
                }
              />
              <Detail label="CreatedAt" value={parsedEvent.CreatedAt} />
            </div>

            {/* Event Names (multi-line) */}
            <div className="ge-block">
              <label>Event Names</label>
              <div className="ge-code">
                {(parsedEvent.eventNames || "")
                  .trim()
                  .split(/\r?\n/)
                  .filter(Boolean)
                  .map((line, idx) => (
                    <div key={idx} className="ge-chip">
                      {line}
                    </div>
                  ))}
                {!parsedEvent.eventNames && <span className="ge-muted">N/A</span>}
              </div>
            </div>

            {/* Raw JSON preview for debugging */}
            {/* <div className="ge-block">
              <label>Raw Response</label>
              <pre className="ge-pre">
                {JSON.stringify(eventData, null, 2)}
              </pre>
            </div> */}
          </section>
        )}
      </div>

      {/* Inline styles for demo. Move to a CSS file in production. */}
      <style>{`
        :root {
          --bg: #0f172a; /* slate-900 */
          --card: #111827; /* gray-900 */
          --text: #e5e7eb; /* gray-200 */
          --muted: #9ca3af; /* gray-400 */
          --primary: #38bdf8; /* sky-400 */
          --primary-600: #0284c7; /* sky-600 */
          --border: #1f2937; /* gray-800 */
          --error: #ef4444;
        }
        .ge-container {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: var(--bg);
          color: var(--text);
          font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          padding: 24px;
        }
        .ge-card {
          width: 100%;
          max-width: 900px;
          background: linear-gradient(180deg, rgba(56,189,248,0.08), transparent), var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 12px 32px rgba(0,0,0,0.35);
          border-radius: 16px;
          overflow: hidden;
        }
        .ge-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          background: radial-gradient(1200px 220px at 20% -10%, rgba(56,189,248,0.18), transparent);
        }
        .ge-title { margin: 0; font-size: 1.5rem; }
        .ge-sub { margin-top: 6px; color: var(--muted); }

        .ge-form { padding: 20px 24px; }
        .ge-controls { display: grid; gap: 16px; }
        .ge-field { display: flex; flex-direction: column; gap: 8px; }
        .ge-field label { font-weight: 600; }
        .ge-hint { color: var(--muted); }

        input[type="date"] {
          background: #0b1220;
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        input[type="date"]:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(56,189,248,0.25);
        }

        .ge-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .ge-primary, .ge-ghost {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform .06s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
        }
        .ge-primary {
          background: linear-gradient(180deg, var(--primary), var(--primary-600));
          color: white;
          border-color: transparent;
          box-shadow: 0 10px 22px rgba(2,132,199,0.35);
        }
        .ge-primary:disabled { background: #334155; box-shadow: none; cursor: not-allowed; }
        .ge-primary:hover:not(:disabled) { transform: translateY(-1px); }
        .ge-ghost { background: transparent; color: var(--text); }
        .ge-ghost:hover { border-color: var(--primary); }

        .ge-alert {
          margin: 0 24px 16px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(239,68,68,0.35);
          background: rgba(239,68,68,0.15);
          color: #fecaca;
        }
        .ge-error strong { margin-right: 6px; }

        .ge-skeleton { padding: 0 24px 20px; }
        .ge-skel-line {
          height: 14px;
          background: #0b1220;
          border: 1px solid var(--border);
          border-radius: 8px;
          margin-top: 10px;
          animation: pulse 1.2s ease-in-out infinite;
        }
        .ge-skel-line.short { width: 70%; }
        @keyframes pulse {
          0% { opacity: .6; }
          50% { opacity: 1; }
          100% { opacity: .6; }
        }

        .ge-section { padding: 0 24px 24px; }
        .ge-section-title { margin: 10px 0 14px; font-size: 1.2rem; }

        .ge-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        @media (max-width: 640px) {
          .ge-grid { grid-template-columns: 1fr; }
        }

        .ge-detail {
          background: #0b1220;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
        }
        .ge-detail label {
          display: block;
          font-size: 0.9rem;
          color: var(--muted);
        }
        .ge-detail .value {
          margin-top: 4px;
          font-weight: 600;
        }

        .ge-block {
          margin-top: 16px;
        }
        .ge-block label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .ge-code {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ge-chip {
          background: #0b1220;
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 0.9rem;
        }
        .ge-muted { color: var(--muted); }

        .ge-pre {
          background: #0b1220;
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="ge-detail">
      <label>{label}</label>
      <div className="value">{value ?? <span className="ge-muted">N/A</span>}</div>
    </div>
  );
}

export default Getevent;
