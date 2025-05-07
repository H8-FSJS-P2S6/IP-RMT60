import Card from "./card";
import LoadingSpinner from "./LoadingSpinner";

export default function AllDevices({ devices, loading, onCardClick }) {
  return (
    <section className="container mb-5 mt-5">
      <h2 className="section-title">Daftar Lengkap HP</h2>
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
                isFeatured={false}
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
