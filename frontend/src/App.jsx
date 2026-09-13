import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";

import { analyzeMedicine } from "./api";
import History from "./History";

import "./App.css";

function App() {
  const { getToken } = useAuth();

  const [page, setPage] = useState("analyze");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [file]);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setError("");
  }

  function removeFile() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  }

  async function handleAnalyze() {
    if (!file) {
      setError("Please select a medicine label image.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeMedicine(file, getToken);
      setResult(data);
    } catch (err) {
      console.error("Analysis error:", err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to analyze the medicine label.");
      }
    } finally {
      setLoading(false);
    }
  }

  function uploadAnother() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      {/* =========================
          SIGNED OUT
      ========================== */}

      <SignedOut>
        <div className="login-page">
          <div className="login-card">
            <div className="brand-icon">💊</div>

            <h1>Medicine Label Simplifier</h1>

            <p>
              Understand medicine labels in simple and easy-to-read
              language.
            </p>

            <SignIn />
          </div>
        </div>
      </SignedOut>

      {/* =========================
          SIGNED IN
      ========================== */}

      <SignedIn>
        <div className="app">

          {/* HEADER */}

          <header className="header">
            <div className="brand">
              <div className="brand-logo">💊</div>

              <div>
                <h1>Medicine Simplifier</h1>
                <p>Understand your medicine labels easily</p>
              </div>
            </div>

            <UserButton />
          </header>

          {/* NAVIGATION */}

          <nav className="navigation">

            <button
              className={
                page === "analyze"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setPage("analyze")}
            >
              <span>🔍</span>
              Analyze Medicine
            </button>

            <button
              className={
                page === "history"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setPage("history")}
            >
              <span>📚</span>
              My History
            </button>

          </nav>

          {/* =========================
              ANALYZE PAGE
          ========================== */}

          {page === "analyze" && (
            <main className="main">

              {/* HERO */}

              <section className="hero-section">

                <div className="hero-badge">
                  ✨ AI-Powered Medicine Information
                </div>

                <h2>
                  Understand Your Medicine
                  <span> Labels Easily</span>
                </h2>

                <p>
                  Upload a clear photo of your medicine label and
                  get the important information explained in simple
                  language.
                </p>

              </section>

              {/* UPLOAD CARD */}

              <section className="upload-card">

                {!file && (
                  <>
                    <div className="upload-icon">
                      📷
                    </div>

                    <h3>Upload Medicine Label</h3>

                    <p className="upload-description">
                      Select a clear image of your medicine,
                      supplement or tablet label.
                    </p>

                    <label className="upload-button">
                      Choose Image

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleFileChange}
                        hidden
                      />
                    </label>

                    <p className="file-types">
                      JPG · JPEG · PNG · WEBP
                    </p>
                  </>
                )}

                {file && (
                  <div className="selected-file">

                    <div className="preview-container">
                      {preview && (
                        <img
                          src={preview}
                          alt="Medicine label preview"
                          className="medicine-preview"
                        />
                      )}
                    </div>

                    <div className="file-info">
                      <div className="success-badge">
                        ✓ Image selected
                      </div>

                      <h3>{file.name}</h3>

                      <p>
                        Your medicine label is ready to analyze.
                      </p>
                    </div>

                    <div className="file-actions">

                      <label className="secondary-button">
                        Change Image

                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleFileChange}
                          hidden
                        />
                      </label>

                      <button
                        className="remove-button"
                        onClick={removeFile}
                      >
                        Remove
                      </button>

                    </div>

                    <button
                      className="analyze-button"
                      onClick={handleAnalyze}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Analyzing Label...
                        </>
                      ) : (
                        <>
                          ✨ Simplify Label
                        </>
                      )}
                    </button>

                  </div>
                )}

                {/* ERROR */}

                {error && (
                  <div className="error-box">
                    ⚠️ {error}
                  </div>
                )}

              </section>

              {/* LOADING */}

              {loading && (
                <section className="loading-card">

                  <div className="loading-icon">
                    🔍
                  </div>

                  <h3>Analyzing your medicine label</h3>

                  <p>
                    Extracting information and preparing a
                    simple explanation...
                  </p>

                  <div className="loading-steps">

                    <div className="loading-step active">
                      ✓ Reading label
                    </div>

                    <div className="loading-step active">
                      ✓ Extracting information
                    </div>

                    <div className="loading-step">
                      ⏳ Preparing explanation
                    </div>

                  </div>

                </section>
              )}

              {/* =========================
                  RESULT
              ========================== */}

              {result && !loading && (
                <section className="result-section">

                  <div className="result-header">

                    <div>
                      <span className="result-badge">
                        ✓ Analysis Complete
                      </span>

                      <h2>Medicine Information</h2>

                      <p>
                        Important information found on your
                        medicine label.
                      </p>
                    </div>

                  </div>

                  {/* BASIC INFORMATION */}

                  <div className="basic-info-grid">

                    <div className="info-card medicine-card">
                      <div className="card-icon">💊</div>

                      <div>
                        <span>Medicine Name</span>

                        <strong>
                          {result.medicine_info?.medicine_name ||
                            "Not available"}
                        </strong>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="card-icon">⚖️</div>

                      <div>
                        <span>Strength</span>

                        <strong>
                          {result.medicine_info?.strength ||
                            "Not available"}
                        </strong>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="card-icon">💊</div>

                      <div>
                        <span>Form</span>

                        <strong>
                          {result.medicine_info?.form ||
                            "Not available"}
                        </strong>
                      </div>
                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="details-grid">

                    <InfoCard
                      icon="🧪"
                      title="Ingredients"
                      items={result.medicine_info?.ingredients}
                      emptyMessage="No ingredient information was clearly found on the label."
                    />

                    <InfoCard
                      icon="🎯"
                      title="Uses Mentioned on Label"
                      items={result.medicine_info?.uses}
                      emptyMessage="No use information was clearly found on the label."
                    />

                    <InfoCard
                      icon="📋"
                      title="Directions Mentioned on Label"
                      items={result.medicine_info?.directions}
                      emptyMessage="No directions were clearly found on the label."
                    />

                    <div className="detail-card">

                      <div className="detail-card-header">
                        <span className="detail-icon">📦</span>
                        <h3>Storage</h3>
                      </div>

                      <p>
                        {result.medicine_info?.storage ||
                          "No storage information was clearly found."}
                      </p>

                    </div>

                  </div>

                  {/* WARNINGS */}

                  <div className="warning-card">

                    <div className="warning-header">
                      <span>⚠️</span>

                      <div>
                        <h3>Warnings</h3>
                        <p>
                          Important information found on the label
                        </p>
                      </div>
                    </div>

                    {result.medicine_info?.warnings?.length > 0 ? (
                      <ul>
                        {result.medicine_info.warnings.map(
                          (warning, index) => (
                            <li key={index}>
                              {warning}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>
                        No warning information was clearly found
                        on the label.
                      </p>
                    )}

                  </div>

                  {/* SIMPLE EXPLANATION */}

                  <div className="explanation-card">

                    <div className="explanation-header">

                      <div className="explanation-icon">
                        ✨
                      </div>

                      <div>
                        <h2>Simple Explanation</h2>

                        <p>
                          A simpler explanation of the information
                          found on the label.
                        </p>
                      </div>

                    </div>

                    <div className="explanation-content">
                      <ReactMarkdown>
                        {result.simple_explanation ||
                          "No explanation available."}
                      </ReactMarkdown>
                    </div>

                  </div>

                  {/* UPLOAD ANOTHER */}

                  <div className="another-medicine">

                    <div className="another-icon">
                      ➕
                    </div>

                    <div>
                      <h3>
                        Analyze another medicine
                      </h3>

                      <p>
                        Upload another medicine label and
                        simplify its information.
                      </p>
                    </div>

                    <button
                      className="another-button"
                      onClick={uploadAnother}
                    >
                      Upload Another Label
                    </button>

                  </div>

                  {/* DISCLAIMER */}

                  <div className="disclaimer">

                    <strong>⚕ Important Disclaimer</strong>

                    <p>
                      This application explains information found
                      on a medicine or supplement label. It does
                      not diagnose medical conditions, prescribe
                      medicines, or determine an appropriate dosage.
                      Always consult a doctor or pharmacist for
                      medical advice.
                    </p>

                  </div>

                </section>
              )}

            </main>
          )}

          {/* =========================
              HISTORY PAGE
          ========================== */}

          {page === "history" && (
            <main className="main">
              <History />
            </main>
          )}

          {/* FOOTER */}

          <footer className="footer">
            <p>
              💊 Medicine Simplifier · Information for educational
              purposes
            </p>
          </footer>

        </div>
      </SignedIn>
    </>
  );
}


/* =========================================================
   REUSABLE INFORMATION CARD
========================================================= */

function InfoCard({
  icon,
  title,
  items,
  emptyMessage,
}) {
  return (
    <div className="detail-card">

      <div className="detail-card-header">

        <span className="detail-icon">
          {icon}
        </span>

        <h3>{title}</h3>

      </div>

      {items?.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p>{emptyMessage}</p>
      )}

    </div>
  );
}

export default App;