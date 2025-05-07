import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import ErrorMessage from "../components/ErrorMessage";
import FeaturedDevices from "../components/FeaturedDevices";
import AllDevices from "../components/AllDevices";
import HomeStyles from "../components/HomeStyles";
import WelcomeContent from "../components/WelcomeContent";

export default function HomePage() {
  const [devices, setDevices] = useState([]);
  const [featuredDevices, setFeaturedDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:3000/public/devices",
          {
            timeout: 5000,
          }
        );

        setDevices(response.data);

        const shuffledDevices = response.data.sort(() => 0.5 - Math.random());
        setFeaturedDevices(shuffledDevices.slice(0, 4));

        setLoading(false);
      } catch (err) {
        if (err.code === "ERR_NETWORK" || err.code === "ECONNREFUSED") {
          setError(
            "Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:3000."
          );
        } else {
          setError(
            "Gagal mengambil data dari server: " +
              (err.message || "Unknown error")
          );
        }
        setLoading(false);
        console.error("Error fetching devices:", err);
      }
    };

    fetchDevices();
  }, []);

  const handleCardClick = (phoneId) => {
    navigate(`/devices/${phoneId}`);
  };

  return (
    <>
      <HomeStyles />
      <Navbar />

      {error && <ErrorMessage message={error} />}

      <FeaturedDevices
        devices={featuredDevices}
        loading={loading}
        onCardClick={handleCardClick}
      />

      <AllDevices
        devices={devices}
        loading={loading}
        onCardClick={handleCardClick}
      />
    </>
  );
}
