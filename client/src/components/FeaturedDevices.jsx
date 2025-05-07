import Card from "./card";
import LoadingSpinner from "./LoadingSpinner";
import { useState, useEffect } from "react";

export default function FeaturedDevices({ devices, loading, onCardClick }) {
  const [aiResponse, setAiResponse] = useState(null);

  useEffect(() => {
    try {
      const storedResponse = localStorage.getItem("aiResponse");
      if (storedResponse) {
        setAiResponse(JSON.parse(storedResponse));
      }
    } catch (error) {
      console.error("Error parsing AI response from localStorage:", error);
    }
  }, []);

  return (
    <section className="container mb-5 mt-5">
      <h2 className="section-title">
        {aiResponse
          ? `Rekomendasi AI: ${aiResponse}`
          : "Berikut beberapa pilihan HP yang sangat cocok sesuai kebutuhan kamu..."}
      </h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="row">
          {devices.map((device) => (
            <div className="col-md-3 col-sm-6 mb-4" key={device.id}>
              <Card
                title={device.device_name}
                genres={device.key ? [device.key.split("-")[0]] : []}
                releaseYear={
                  device.os_type ? device.os_type.split(",")[0] : "Unknown"
                }
                imageUrl={device.device_image}
                isFeatured={true}
                badgeText="HOT"
                price={device.price}
                onClick={() => onCardClick(device.id)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
