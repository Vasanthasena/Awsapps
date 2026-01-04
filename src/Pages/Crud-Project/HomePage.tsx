import React from "react";
import { Link } from "react-router-dom";


function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the AWS Event Manager</h1>
        <p>Manage your data seamlessly with a serverless backend.</p>
      </header>
      
     
      <nav className="home-actions">
        <Link to="/crud-put" className="home-btn primary-btn">
          ➕ Add New Event
        </Link>
        <Link to="/crud-get"className="home-btn ghost-btn">
          🔍 Find Specific Event
        </Link>
        <button className="home-btn ghost-btn">
          🗓️ View All Events
        </button>
      </nav>

      <footer className="home-footer">
        <small>Powered by React and AWS Lambda/DynamoDB</small>
      </footer>

    
      <style>{`
        /* Inheriting CSS variables from previous components for consistency */
        :root {
          --bg: #0f172a;
          --card: #111827;
          --text: #e5e7eb;
          --muted: #9ca3af;
          --primary: #38bdf8;
          --primary-600: #0284c7;
          --border: #1f2937;
          --input-bg: #1f2937;
        }

        .home-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          background: var(--bg);
          color: var(--text);
        }

        .home-header h1 {
          font-size: 3rem;
          margin-bottom: 10px;
          color: var(--primary);
        }

        .home-header p {
          font-size: 1.2rem;
          color: var(--muted);
          margin-bottom: 40px;
        }

        .home-actions {
          display: flex;
          flex-direction: column; /* Stacks buttons vertically */
          gap: 15px;
          width: 100%;
          max-width: 300px;
        }

        .home-btn {
          padding: 14px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s;
          text-decoration: none; /* Removes underline from Link component */
          display: block; /* Makes links behave like buttons */
          width: 100%;
          text-align: center;
          font-size: 1rem;
        }

        .primary-btn { 
          background-color: var(--primary); 
          color: var(--bg); 
          box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
        }
        .primary-btn:hover { background-color: var(--primary-600); }

        .ghost-btn { 
          background-color: transparent; 
          color: var(--muted); 
          border: 1px solid var(--border); 
        }
        .ghost-btn:hover { 
          background-color: var(--input-bg); 
          color: var(--text); 
          border-color: var(--primary);
        }
        
        .home-footer {
          margin-top: 60px;
          color: var(--muted);
          font-size: 0.8rem;
        }

      `}</style>
    </div>
  );
}

export default HomePage;
