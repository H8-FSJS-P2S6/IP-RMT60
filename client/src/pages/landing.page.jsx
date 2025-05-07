import { useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import WelcomeContent from "../components/WelcomeContent";
import LandingStyles from "../components/LandingStyles";
import axios from "axios";

export default function LandingPage() {
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAiRequest = async (prompt) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/ai",
        { prompt },
        {
          timeout: 10000,
        }
      );

      if (response.data && response.data.response) {
        setAiResponse(response.data.response);
        localStorage.setItem(
          "aiResponse",
          JSON.stringify(response.data.response)
        );
      } else {
        throw new Error("Respons AI tidak valid");
      }
    } catch (err) {
      if (err.code === "ERR_NETWORK" || err.code === "ECONNREFUSED") {
        setError(
          "Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:3000."
        );
      } else {
        setError(
          "Gagal mendapatkan respons dari AI: " +
            (err.message || "Unknown error")
        );
      }
      console.error("Error fetching AI response:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LandingStyles />
      <AnimatedBackground />
      <WelcomeContent
        onAiRequest={handleAiRequest}
        loading={loading}
        error={error}
      />
    </>
  );
}
