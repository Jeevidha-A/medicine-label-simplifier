import { useEffect, useState } from "react";

import { getHistory } from "./api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory();

        setHistory(data.items || []);
      } catch (err) {
        console.error(err);

        if (err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Failed to load medicine history.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-loading">
        <div className="history-spinner"></div>
        <h2>Loading medicine history...</h2>
        <p>Please wait while we retrieve the history.</p>
      </div>
    );
  }

  return (
    <section className="history-page">

      {/* HEADER */}

      <div className="history-header">

        <div>
          <span className="history-badge">
            📚 Saved Information
          </span>

          <h2>Medicine History</h2>

          <p>
            View the medicine labels that have been analyzed previously.
          </p>
        </div>

        <div className="history-count">
          <strong>{history.length}</strong>
          <span>Analyses</span>
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error-box">
          ⚠️ {error}
        </div>
      )}

      {/* EMPTY */}

      {!error && history.length === 0 && (
        <div className="empty-history">

          <div className="empty-icon">
            💊
          </div>

          <h3>No medicine analyses yet</h3>

          <p>
            Upload a medicine label to start building
            the medicine history.
          </p>

        </div>
      )}

      {/* HISTORY CARDS */}

      {history.length > 0 && (
        <div className="history-grid">

          {history.map((item) => (
            <div
              className="history-card"
              key={item.id}
            >

              <div className="history-card-icon">
                💊
              </div>

              <div className="history-card-content">

                <span className="history-date">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Date unavailable"}
                </span>

                <h3>
                  {item.medicine_name ||
                    "Unknown Medicine"}
                </h3>

                <div className="history-details">

                  <div>
                    <span>Strength</span>
                    <strong>
                      {item.strength ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>Form</span>
                    <strong>
                      {item.form ||
                        "Not available"}
                    </strong>
                  </div>

                </div>

                {item.filename && (
                  <p className="history-file">
                    📄 {item.filename}
                  </p>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default History;