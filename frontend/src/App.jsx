import { useState } from "react";
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


function App() {
  const { getToken } = useAuth();

  const [page, setPage] = useState("analyze");

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


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


  return (
    <>
      {/* =====================================================
          NOT SIGNED IN
      ====================================================== */}
      <SignedOut>
        <div style={styles.loginPage}>
          <h1>Medicine Label Simplifier</h1>

          <p>Please sign in to continue.</p>

          <SignIn />
        </div>
      </SignedOut>


      {/* =====================================================
          SIGNED IN
      ====================================================== */}
      <SignedIn>
        <div style={styles.page}>

          {/* HEADER */}
          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>
                Medicine Label Simplifier
              </h1>

              <p style={styles.subtitle}>
                Understand medicine labels more easily
              </p>
            </div>

            <UserButton />
          </header>


          {/* NAVIGATION */}
          <nav style={styles.nav}>
            <button
              onClick={() => setPage("analyze")}
              style={
                page === "analyze"
                  ? styles.activeNavButton
                  : styles.navButton
              }
            >
              Analyze Medicine
            </button>

            <button
              onClick={() => setPage("history")}
              style={
                page === "history"
                  ? styles.activeNavButton
                  : styles.navButton
              }
            >
              History
            </button>
          </nav>


          {/* =====================================================
              ANALYZE PAGE
          ====================================================== */}
          {page === "analyze" && (
            <main style={styles.main}>

              {/* UPLOAD CARD */}
              <div style={styles.uploadCard}>

                <h2>Analyze Medicine Label</h2>

                <p>
                  Upload a clear image of a medicine or supplement
                  label to extract and simplify the information.
                </p>


                {/* FILE INPUT */}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(event) => {
                    const selectedFile =
                      event.target.files?.[0] || null;

                    setFile(selectedFile);
                    setError("");
                    setResult(null);
                  }}
                />


                {/* FILE NAME */}
                {file && (
                  <p style={styles.fileText}>
                    <strong>Selected file:</strong>{" "}
                    {file.name}
                  </p>
                )}


                {/* ANALYZE BUTTON */}
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  style={styles.analyzeButton}
                >
                  {loading
                    ? "Analyzing..."
                    : "Analyze Label"}
                </button>


                {/* ERROR */}
                {error && (
                  <div style={styles.errorBox}>
                    {error}
                  </div>
                )}

              </div>


              {/* =================================================
                  RESULT CARD
              ================================================== */}
              {result && (
                <div style={styles.resultCard}>

                  <h2>Medicine Information</h2>


                  {/* MEDICINE NAME */}
                  <div style={styles.infoSection}>
                    <h3>Medicine Name</h3>

                    <p>
                      {result.medicine_info?.medicine_name ||
                        "Not available"}
                    </p>
                  </div>


                  {/* STRENGTH */}
                  <div style={styles.infoSection}>
                    <h3>Strength</h3>

                    <p>
                      {result.medicine_info?.strength ||
                        "Not available"}
                    </p>
                  </div>


                  {/* FORM */}
                  <div style={styles.infoSection}>
                    <h3>Form</h3>

                    <p>
                      {result.medicine_info?.form ||
                        "Not available"}
                    </p>
                  </div>


                  {/* INGREDIENTS */}
                  <div style={styles.infoSection}>
                    <h3>Ingredients</h3>

                    {result.medicine_info?.ingredients?.length > 0 ? (
                      <ul>
                        {result.medicine_info.ingredients.map(
                          (ingredient, index) => (
                            <li key={index}>
                              {ingredient}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>
                        No ingredient information was clearly
                        found on the label.
                      </p>
                    )}
                  </div>


                  {/* USES */}
                  <div style={styles.infoSection}>
                    <h3>
                      Uses Mentioned on Label
                    </h3>

                    {result.medicine_info?.uses?.length > 0 ? (
                      <ul>
                        {result.medicine_info.uses.map(
                          (use, index) => (
                            <li key={index}>
                              {use}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>
                        No use information was clearly
                        found on the label.
                      </p>
                    )}
                  </div>


                  {/* DIRECTIONS */}
                  <div style={styles.infoSection}>
                    <h3>
                      Directions Mentioned on Label
                    </h3>

                    {result.medicine_info?.directions?.length > 0 ? (
                      <ul>
                        {result.medicine_info.directions.map(
                          (direction, index) => (
                            <li key={index}>
                              {direction}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>
                        No directions were clearly found
                        on the label.
                      </p>
                    )}
                  </div>


                  {/* STORAGE */}
                  <div style={styles.infoSection}>
                    <h3>Storage</h3>

                    <p>
                      {result.medicine_info?.storage ||
                        "No storage information was clearly found."}
                    </p>
                  </div>


                  {/* WARNINGS */}
                  <div style={styles.warningSection}>
                    <h3>Warnings</h3>

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
                        No warning information was clearly
                        found on the label.
                      </p>
                    )}
                  </div>


                  {/* =================================================
                      SIMPLE EXPLANATION
                  ================================================== */}
                  <div style={styles.explanationBox}>

                    <h2>Simple Explanation</h2>

                    <div style={styles.explanation}>

                      <ReactMarkdown>
                        {result.simple_explanation ||
                          "No explanation available."}
                      </ReactMarkdown>

                    </div>
                  </div>


                  {/* DISCLAIMER */}
                  <div style={styles.disclaimer}>

                    <strong>Important:</strong>

                    <p>
                      This application explains information found
                      on a medicine or supplement label. It does
                      not diagnose medical conditions, prescribe
                      medicines, or determine an appropriate dosage.
                      Consult a doctor or pharmacist for medical
                      advice.
                    </p>

                  </div>

                </div>
              )}

            </main>
          )}


          {/* =====================================================
              HISTORY PAGE
          ====================================================== */}
          {page === "history" && (
            <main style={styles.main}>
              <History />
            </main>
          )}

        </div>
      </SignedIn>
    </>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = {

  loginPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    padding: "20px",
  },


  page: {
    minHeight: "100vh",
    padding: "30px",
  },


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    paddingBottom: "20px",
  },


  title: {
    margin: 0,
  },


  subtitle: {
    marginTop: "6px",
  },


  nav: {
    display: "flex",
    gap: "10px",
    marginTop: "25px",
    marginBottom: "30px",
  },


  navButton: {
    padding: "10px 18px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
  },


  activeNavButton: {
    padding: "10px 18px",
    border: "1px solid #333",
    borderRadius: "8px",
    background: "#eee",
    cursor: "pointer",
  },


  main: {
    maxWidth: "850px",
    margin: "0 auto",
  },


  uploadCard: {
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    marginBottom: "25px",
  },


  fileText: {
    marginTop: "15px",
  },


  analyzeButton: {
    display: "block",
    marginTop: "15px",
    padding: "12px 22px",
    border: "1px solid #aaa",
    borderRadius: "8px",
    cursor: "pointer",
  },


  errorBox: {
    marginTop: "20px",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },


  resultCard: {
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "12px",
  },


  infoSection: {
    marginBottom: "25px",
  },


  warningSection: {
    marginBottom: "25px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },


  explanationBox: {
    marginTop: "25px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },


  explanation: {
    lineHeight: "1.7",
  },


  disclaimer: {
    marginTop: "25px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    lineHeight: "1.5",
  },

};


export default App;