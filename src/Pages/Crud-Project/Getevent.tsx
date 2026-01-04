
// Getevent.jsx
import React, { useState } from "react";

function Getevent() {
  const [date, setDate] = useState("");
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // NOTE:
  // If your API is intended to RETRIEVE data, it's more conventional to use GET:
  // const url = `https://.../Url-Short-Get?date=${encodeURIComponent(date)}`
  // Then call fetch(url, { method: "GET" })
  // For now, we keep POST since that seems to be how your backend is set.

  async function Saver() {
    // Basic validation
    if (!date) {
      //setError("Please select a date before fetching.");
      setEventData(null);
      return;
    }

    setError(null);
    setEventData(null);
    setIsLoading(true);

    try {
        console.log(date);
        
      const url =
        "https://hbd0z8nsy9.execute-api.us-east-1.amazonaws.com/default/Url-Short-Post";

      const response = await fetch(url, {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json", // important for Lambda/API Gateway
        // },
        body: JSON.stringify({ Id: date }),
      });

      if (!response.ok) {
        // Attempt to read response text for richer error
        const text = await response.text().catch(() => "");
        throw new Error(
          text || `Request failed with status ${response.status}`
        );
      }

      // Safely parse JSON (in case API returns non-JSON on certain paths)
      let data = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Fallback: try text and show it
        const text = await response.text();
        data = { raw: text };
      }

      setEventData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      // Common causes:
      // - Wrong URL or method
      // - Lambda error / API Gateway mapping error
      // - CORS misconfiguration
      setError(
        err?.message ||
          "Failed to fetch event data. Please check the API configuration."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2>Get Event</h2>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Enter Date (YYYY-MM-DD)"
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
        <button onClick={Saver} disabled={!date || isLoading}>
          {isLoading ? "Fetching..." : "Get Event On That Day"}
        </button>
        <button
          type="button"
          onClick={() => {
            setDate("");
            setEventData(null);
            setError(null);
          }}
          disabled={isLoading}
        >
          Reset
        </button>
      </div>

      {/* Display the results or error */}
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

      {eventData && (
        <div style={{ marginTop: 12 }}>
          <h3>Event Details:</h3>
          <pre
            style={{
              background: "#0b1220",
              color: "#e5e7eb",
              padding: 12,
              borderRadius: 8,
              overflowX: "auto",
            }}
          >
            {JSON.stringify(eventData, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}

export default Getevent;
