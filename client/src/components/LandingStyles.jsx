export default function LandingStyles() {
  return (
    <>
      {" "}
      <meta charSet="UTF-8" />{" "}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />{" "}
      <title>Selamat Datang di My Phones</title>{" "}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />{" "}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />{" "}
      <style
        dangerouslySetInnerHTML={{
          __html: `    body {        background: linear-gradient(135deg, #3a0ca3 0%, #4cc9f0 100%);        min-height: 100vh;        display: flex;        align-items: center;        justify-content: center;        font-family: 'Poppins', sans-serif;        padding: 20px;        color: #fff;    }        .welcome-content {        text-align: center;        max-width: 600px;        padding: 40px;        transition: all 0.3s ease;    }        h1 {        font-weight: 700;        margin-bottom: 20px;        font-size: 3rem;        letter-spacing: 0.5px;        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);    }        p {        color: rgba(255, 255, 255, 0.9);        margin-bottom: 30px;        font-size: 1.2rem;        line-height: 1.6;        text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);    }        .btn-primary {        background: linear-gradient(to right, #f72585, #3a0ca3);        border: none;        border-radius: 30px;        padding: 15px 30px;        font-weight: 600;        transition: all 0.3s ease;        font-size: 1.2rem;        letter-spacing: 0.5px;        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);    }        .btn-primary:hover {        transform: translateY(-3px);        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);    }        .highlight {        color: #f72585;        font-weight: 700;    }        .animated-bg {        position: absolute;        width: 100%;        height: 100%;        top: 0;        left: 0;        z-index: -1;        overflow: hidden;    }        .bg-bubble {        position: absolute;        border-radius: 50%;        background: rgba(255, 255, 255, 0.05);        animation: float 8s ease-in-out infinite;    }        .bg-bubble:nth-child(1) {        width: 80px;        height: 80px;        left: 10%;        top: 10%;        animation-duration: 9s;    }        .bg-bubble:nth-child(2) {        width: 120px;        height: 120px;        right: 15%;        top: 20%;        animation-duration: 7s;        animation-delay: 1s;    }        .bg-bubble:nth-child(3) {        width: 40px;        height: 40px;        left: 20%;        bottom: 20%;        animation-duration: 10s;        animation-delay: 2s;    }    
    .bg-bubble:nth-child(4) {
        width: 100px;
        height: 100px;
        right: 10%;
        bottom: 15%;
        animation-duration: 11s;
        animation-delay: 3s;
    }
    
    @keyframes float {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
        100% { transform: translateY(0) rotate(0deg); }
    }

    .form-container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 30px;
        margin-top: 20px;
        text-align: left;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .form-label {
        color: #ffffff;
        font-weight: 500;
        margin-bottom: 8px;
    }

    .form-control {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #ffffff;
        border-radius: 5px;
        padding: 12px;
        margin-bottom: 20px;
    }

    .form-control::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    .form-control:focus {
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 0 8px rgba(247, 37, 133, 0.4);
        border-color: rgba(247, 37, 133, 0.5);
    }
  `,
        }}
      />
    </>
  );
}
