export default function HomeStyles() {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Xiaomi Phone Catalog</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
       :root {
           --primary-color: #3a0ca3;
           --secondary-color: #4cc9f0;
           --accent-color: #f72585;
           --dark-bg: #121212;
           --card-bg: #1e1e1e;
       }
       
       body {
           background-color: var(--dark-bg);
           color: #fff;
           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
       }
       
       .navbar {
           background-color: var(--primary-color);
           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
       }
       
       .navbar-brand {
           font-weight: 700;
           font-size: 1.8rem;
           text-transform: uppercase;
       }
       
       .nav-link {
           font-weight: 500;
           text-transform: uppercase;
           letter-spacing: 0.5px;
           transition: all 0.3s ease;
       }
       
       .nav-link:hover {
           color: var(--secondary-color) !important;
           transform: translateY(-2px);
       }
       
       .search-box {
           position: relative;
       }
       
       .search-box input {
           background-color: rgba(255, 255, 255, 0.1);
           border: none;
           border-radius: 25px;
           color: #fff;
           padding-left: 40px;
       }
       
       .search-box input::placeholder {
           color: rgba(255, 255, 255, 0.7);
       }
       
       .search-box i {
           position: absolute;
           left: 15px;
           top: 50%;
           transform: translateY(-50%);
           color: rgba(255, 255, 255, 0.7);
       }
       
       .hero-section {
           background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
           padding: 80px 0;
           margin-bottom: 40px;
           border-radius: 0 0 50px 50px;
       }
       
       .hero-title {
           font-size: 3rem;
           font-weight: 800;
           text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
       }
       
       .game-card {
           background-color: var(--card-bg);
           border-radius: 15px;
           overflow: hidden;
           transition: all 0.3s ease;
           margin-bottom: 25px;
           box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
           border: none;
       }
       
       .game-card:hover {
           transform: translateY(-10px);
           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
       }
       
       .game-card img {
           transition: all 0.3s ease;
       }
       
       .game-card:hover img {
           transform: scale(1.05);
       }
       
       .game-card-body {
           padding: 20px;
       }
       
       .game-title {
           font-weight: 700;
           font-size: 1.3rem;
           margin-bottom: 10px;
           color: #fff;
       }
       
       .game-genre {
           background-color: var(--accent-color);
           color: #fff;
           padding: 5px 10px;
           border-radius: 20px;
           font-size: 0.8rem;
           display: inline-block;
           margin-right: 5px;
           margin-bottom: 5px;
       }
       
       .game-release {
           font-size: 0.9rem;
           color: rgba(255, 255, 255, 0.7);
           margin-bottom: 15px;
       }
       
       .btn-download {
           background: linear-gradient(to right, var(--accent-color), var(--primary-color));
           border: none;
           border-radius: 25px;
           padding: 8px 25px;
           color: #fff;
           font-weight: 600;
           transition: all 0.3s ease;
       }
       
       .btn-download:hover {
           transform: scale(1.05);
           box-shadow: 0 5px 15px rgba(247, 37, 133, 0.4);
       }
       
       .section-title {
           font-size: 2rem;
           font-weight: 700;
           margin-bottom: 30px;
           position: relative;
           padding-left: 15px;
           border-left: 5px solid var(--accent-color);
       }
       
       .category-pill {
           background-color: var(--card-bg);
           color: #fff;
           padding: 10px 20px;
           border-radius: 25px;
           margin: 5px;
           display: inline-block;
           transition: all 0.3s ease;
           border: 1px solid rgba(255, 255, 255, 0.1);
       }
       
       .category-pill:hover {
           background-color: var(--primary-color);
           transform: translateY(-3px);
           box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
           text-decoration: none;
           color: #fff;
       }
       
       .pagination .page-item .page-link {
           background-color: var(--card-bg);
           color: #fff;
           border-color: rgba(255, 255, 255, 0.1);
       }
       
       .pagination .page-item.active .page-link {
           background-color: var(--accent-color);
           border-color: var(--accent-color);
       }
       
       footer {
           background-color: var(--primary-color);
           padding: 40px 0;
           margin-top: 50px;
       }
       
       .footer-title {
           font-weight: 700;
           margin-bottom: 20px;
           font-size: 1.2rem;
       }
       
       .footer-link {
           color: rgba(255, 255, 255, 0.7);
           transition: all 0.3s ease;
           display: block;
           margin-bottom: 10px;
       }
       
       .footer-link:hover {
           color: #fff;
           transform: translateX(5px);
           text-decoration: none;
       }
       
       .social-icon {
           font-size: 1.5rem;
           margin-right: 15px;
           color: rgba(255, 255, 255, 0.7);
           transition: all 0.3s ease;
       }
       
       .social-icon:hover {
           color: var(--secondary-color);
           transform: translateY(-3px);
       }
       
       .featured-badge {
           position: absolute;
           top: 10px;
           right: 10px;
           background-color: var(--accent-color);
           color: #fff;
           padding: 5px 10px;
           border-radius: 10px;
           font-weight: 600;
           z-index: 10;
       }

       .loading-spinner {
           display: flex;
           justify-content: center;
           align-items: center;
           min-height: 200px;
       }

       .error-message {
           background-color: var(--accent-color);
           color: white;
           padding: 15px;
           border-radius: 10px;
           margin: 20px 0;
           text-align: center;
       }`,
        }}
      />
    </>
  );
}
