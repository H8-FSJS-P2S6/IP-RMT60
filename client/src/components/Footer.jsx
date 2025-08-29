import { Link } from "react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4">
            <h5 className="fw-bold mb-3">SNS NDT Learning</h5>
            <p className="text-muted">
              Leading provider of Non-Destructive Testing training and certification.
              Empowering professionals with expertise in industry-standard testing methods.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white fs-5"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="text-white fs-5"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
          
          <div className="col-6 col-lg-2">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="mb-2"><Link to="/courses" className="text-decoration-none text-muted">Courses</Link></li>
              <li className="mb-2"><Link to="/categories" className="text-decoration-none text-muted">Categories</Link></li>
              <li className="mb-2"><Link to="/about" className="text-decoration-none text-muted">About Us</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-decoration-none text-muted">Contact</Link></li>
            </ul>
          </div>
          
          <div className="col-6 col-lg-2">
            <h6 className="fw-bold mb-3">Courses</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/courses" className="text-decoration-none text-muted">Radiography Testing</Link></li>
              <li className="mb-2"><Link to="/courses" className="text-decoration-none text-muted">Ultrasonic Testing</Link></li>
              <li className="mb-2"><Link to="/courses" className="text-decoration-none text-muted">Magnetic Testing</Link></li>
              <li className="mb-2"><Link to="/courses" className="text-decoration-none text-muted">Penetrant Testing</Link></li>
              <li className="mb-2"><Link to="/courses" className="text-decoration-none text-muted">All Courses</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-4">
            <h6 className="fw-bold mb-3">Contact Information</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2 d-flex">
                <i className="bi bi-geo-alt me-2"></i>
                <span className="text-muted">Jl. Pemuda No. 123, Jakarta Timur, Indonesia</span>
              </li>
              <li className="mb-2 d-flex">
                <i className="bi bi-telephone me-2"></i>
                <span className="text-muted">+1 (555) 123-4567</span>
              </li>
              <li className="mb-2 d-flex">
                <i className="bi bi-envelope me-2"></i>
                <span className="text-muted">info@snsndt.com</span>
              </li>
            </ul>
            
            <h6 className="fw-bold mb-3 mt-4">Subscribe to Newsletter</h6>
            <div className="input-group">
              <input 
                type="email"
                className="form-control"
                placeholder="Your Email"
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-muted">&copy; {currentYear} SNS NDT Learning. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link to="/privacy" className="text-decoration-none text-muted small">Privacy Policy</Link>
              </li>
              <li className="list-inline-item ms-3">
                <Link to="/terms" className="text-decoration-none text-muted small">Terms of Service</Link>
              </li>
              <li className="list-inline-item ms-3">
                <Link to="/faq" className="text-decoration-none text-muted small">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}