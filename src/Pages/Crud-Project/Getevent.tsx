// Getevent.jsx

import { useState } from "react";

function Getevent(){
    const [date, setDate] = useState("");
    const [eventData, setEventData] = useState(null); // To store the retrieved event
    const [error, setError] = useState(null); // To handle errors

    async function Saver() {
        setError(null); // Clear previous errors
        try {
            // Your API endpoint URL seems to have a typo in the path segment (Post vs Get)
            // assuming 'Url-Short-Get' should match the POST endpoint name you used earlier
            // or the path in API Gateway is correct as /Url-Short-Post/{date}
           // setDate("2026-05-01")
            const url = `hbd0z8nsy9.execute-api.us-east-1.amazonaws.com{date}`;

            const response = await fetch(url, {
                method: "GET",
                // No headers needed for this simple GET request from the client side
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response body
            const data = await response.json(); 
            console.log(data);
            setEventData(data); // Store the data in state

        } catch (err) {
            console.error("Fetch error:", err);
            //setError("Failed to fetch event data. Check AWS CORS configuration.");
        }
    }

    return(
        <> 
        <h2>Get Event</h2>
        <input 
            placeholder="Enter Date (YYYY-MM-DD)" 
            type="date" // Use type date for better UX
            onChange={(e) => setDate(e.target.value)}
            value={date}
        />
        <button onClick={Saver}>Get Event On That Day</button>
        
        {/* Display the results or error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {eventData && (
            <div>
                <h3>Event Details:</h3>
                <pre>{JSON.stringify(eventData, null, 2)}</pre>
            </div>
        )}
        </>
    )
}
export default Getevent;
