import { useNavigate } from "react-router";
import { useState } from "react";

export default function WelcomeContent({ onAiRequest, loading, error }) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const handleClick = () => {
    if (prompt.trim()) {
      onAiRequest(prompt);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="welcome-content">
      <h1>
        <span style={{ fontWeight: "700", textTransform: "uppercase" }}>
          SELAMAT DATANG DI MY <span style={{ color: "#4cc9f0" }}>PHONES</span>
        </span>
      </h1>
      <p>
        Kami akan bantu cari handphone yang paling cocok sesuai kebutuhan
        kamu...
      </p>

      <div className="form-container">
        <div className="mb-3">
          <label className="form-label">
            Ceritakan singkat tentang HP yang kamu inginkan?
          </label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Saya ingin HP gaming dan baterai tahan lama"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>
        {error && <div className="text-danger mb-2">{error}</div>}
        <button
          className="btn btn-primary w-100"
          onClick={handleClick}
          disabled={loading || !prompt.trim()}
        >
          {loading ? "Memproses..." : "Bantu carikan.."}
        </button>
      </div>
    </div>
  );
}
