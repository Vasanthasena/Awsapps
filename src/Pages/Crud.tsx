
import { useState } from "react";

function Crud() {
  const [date, setDate] = useState("");
  const [events, setEvents] = useState("");
  const [imp, setImp] = useState(5);
  const [privacy, setPrivacy] = useState("Public");
  const [payment, setPayment] = useState("Cash");
  const [eventNames, setEventNames] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const isValid =
    date &&
    Number(events) > 0 &&
    eventNames.trim().length > 0 &&
    imp >= 1 &&
    imp <= 10;

  const Transfer = async () => {
    if (!isValid) {
      setMessage({
        type: "error",
        text: "Please fill all required fields correctly before saving.",
      });
      return;
    }

    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        Id: date,          // keeping your API field names
        events,            // number of events
        imp,               // importance (1–10)
        cash: privacy,     // mapping to your 'cash' field: Public/Private
        pub: payment,      // mapping to your 'pub' field: Cash/Cashless
        eventNames:eventNames,        // extra field for clarity (optional)
      };

      const response = await fetch(
        "https://hbd0z8nsy9.execute-api.us-east-1.amazonaws.com/default/Url-Short-Get",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed with ${response.status}`);
      }

      setMessage({
        type: "success",
        text: "Event saved successfully!",
      });

      // Optional: clear form after save
      setDate("");
      setEvents("");
      setImp(5);
      setPrivacy("Public");
      setPayment("Cash");
      setEventNames("");
    } catch (err) {
      setMessage({
        type: "error",
        text: `Failed to save event: ${err.message}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <header className="cardHeader">
          <h1>AWS – Event Saver App</h1>
          <p className="sub">Log your events and save them to AWS</p>
        </header>

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            Transfer();
          }}
        >
          <div className="grid">
            <div className="field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="dd-mm-yyyy"
                required
              />
              <small>Choose the event date</small>
            </div>

            <div className="field">
              <label htmlFor="events">Number of Events</label>
              <input
                id="events"
                type="number"
                min={1}
                value={events}
                onChange={(e) => setEvents(e.target.value)}
                placeholder="e.g., 3"
                required
              />
              <small>Enter a positive number</small>
            </div>

            <div className="field">
              <label htmlFor="imp">Importance (1–10)</label>
              <input
                id="imp"
                type="range"
                min={1}
                max={10}
                value={imp}
                onChange={(e) => setImp(Number(e.target.value))}
              />
              <div className="rangeLabel">Current: {imp}</div>
            </div>

            <div className="field">
              <label htmlFor="privacy">Privacy</label>
              <select
                id="privacy"
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <option>Public</option>
                <option>Private</option>
              </select>
              <small>Choose who can see this event</small>
            </div>

            <div className="field">
              <label htmlFor="payment">Payment Mode</label>
              <select
                id="payment"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option>Cash</option>
                <option>Cashless</option>
              </select>
              <small>Cash or digital</small>
            </div>
          </div>

          <div className="field">
            <label htmlFor="eventNames">Event Names</label>
            <textarea
              id="eventNames"
              rows={3}
              value={eventNames}
              onChange={(e) => setEventNames(e.target.value)}
              placeholder="List event names (comma separated)"
              required
            />
            <small>Example: Hackathon, Team Meetup, Product Demo</small>
          </div>

          {message.text && (
            <div
              className={`alert ${
                message.type === "success" ? "success" : "error"
              }`}
              role="alert"
            >
              {message.text}
            </div>
          )}

          <div className="actions">
            <button
              type="submit"
              className="primaryBtn"
              disabled={!isValid || isSaving}
            >
              {isSaving ? "Saving..." : "Save Event"}
            </button>
            <button
              type="button"
              className="ghostBtn"
              onClick={() => {
                setDate("");
                setEvents("");
                setImp(5);
                setPrivacy("Public");
                setPayment("Cash");
                setEventNames("");
                setMessage({ type: "", text: "" });
              }}
              disabled={isSaving}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Inline styles just for demo; move to .css in production */}
      <style>{`
        :root {
          --bg: #0f172a; /* slate-900 */
          --card: #111827; /* gray-900 */
          --text: #e5e7eb; /* gray-200 */
          --muted: #9ca3af; /* gray-400 */
          --primary: #38bdf8; /* sky-400 */
          --primary-600: #0284c7; /* sky-600 */
          --success: #22c55e; /* green-500 */
          --error: #ef4444; /* red-500 */
          --border: #1f2937; /* gray-800 */
        }

        * { box-sizing: border-box; }
        body { background: var(--bg); color: var(--text); font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }

        .container {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
        }

        .card {
          width: 100%;
          max-width: 860px;
          background: linear-gradient(180deg, rgba(56,189,248,0.08), transparent),
                      var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }

        .cardHeader {
          padding: 24px 28px;
          border-bottom: 1px solid var(--border);
          background: radial-gradient(1200px 220px at 20% -10%, rgba(56,189,248,0.18), transparent);
        }
        .cardHeader h1 {
          margin: 0;
          font-size: 1.6rem;
          letter-spacing: 0.3px;
        }
        .sub {
          margin-top: 6px;
          color: var(--muted);
          font-size: 0.95rem;
        }

        .form { padding: 24px 28px; }
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (max-width: 640px) {
          .grid { grid-template-columns: 1fr; }
        }

        .field { display: flex; flex-direction: column; gap: 8px; }
        label { font-weight: 600; font-size: 0.94rem; }
        small { color: var(--muted); }

        input, select, textarea {
          background: #0b1220; /* deep slate */
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(56,189,248,0.25);
        }

        input[type="range"] {
          padding: 6px 0;
        }
        .rangeLabel {
          font-size: 0.9rem;
          color: var(--muted);
        }

        .actions {
          margin-top: 20px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .primaryBtn, .ghostBtn {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.06s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .primaryBtn {
          background: linear-gradient(180deg, var(--primary), var(--primary-600));
          border-color: transparent;
          color: white;
          box-shadow: 0 10px 22px rgba(2,132,199,0.35);
        }
        .primaryBtn:disabled {
          background: #334155;
          box-shadow: none;
          cursor: not-allowed;
        }
        .primaryBtn:hover:not(:disabled) { transform: translateY(-1px); }

        .ghostBtn {
          background: transparent;
          color: var(--text);
        }
        .ghostBtn:hover {
          border-color: var(--primary);
        }

        .alert {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          font-weight: 600;
        }
        .alert.success {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.35);
          color: #bbf7d0;
        }
        .alert.error {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.35);
          color: #fecaca;
        }
      `}</style>
    </div>
  );
}

export default Crud;
