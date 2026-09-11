import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { getHistory } from "./api";

function History() {
  const { getToken } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory(getToken);

        setHistory(data.items || []);
      } catch (err) {
        console.error(err);

        if (err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Failed to load history.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [getToken]);

  if (loading) {
    return <p>Loading history...</p>;
  }

  return (
    <div>
      <h2>Analysis History</h2>

      {error && <p>{error}</p>}

      {!error && history.length === 0 && (
        <p>No medicine analyses found.</p>
      )}

      {history.length > 0 && (
        <div>
          {history.map((item) => (
            <div key={item.id}>
              <h3>
                {item.medicine_name || "Unknown Medicine"}
              </h3>

              <p>
                <strong>Strength:</strong>{" "}
                {item.strength || "Not available"}
              </p>

              <p>
                <strong>Form:</strong>{" "}
                {item.form || "Not available"}
              </p>

              <p>
                <strong>File:</strong> {item.filename}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "Not available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;