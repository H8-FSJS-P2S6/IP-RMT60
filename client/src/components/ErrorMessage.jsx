export default function ErrorMessage({ message }) {
  return (
    <div className="container">
      <div className="error-message">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {message}
      </div>
    </div>
  );
}
