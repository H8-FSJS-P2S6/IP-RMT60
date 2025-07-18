import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lectures/my-courses');
      console.log('My courses response:', response.data);
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessCourse = async (courseId) => {
    try {
      // Check if user can access the course content
      const response = await api.get(`/lectures/content/${courseId}`);
      if (response.data.access_granted) {
        navigate(`/courses/${courseId}/learn`);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        alert('Access denied. Please complete payment first.');
        navigate('/cart');
      } else {
        alert('An error occurred while accessing the course');
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="bi bi-mortarboard me-2"></i>
              My Courses
            </h2>
            <span className="badge bg-primary fs-6">
              {courses.length} Courses
            </span>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {courses.length === 0 ? (
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="card text-center">
                  <div className="card-body py-5">
                    <i className="bi bi-mortarboard-fill display-1 text-muted mb-3"></i>
                    <h4>No Courses Yet</h4>
                    <p className="text-muted mb-4">
                      You don't have any accessible courses yet. Please purchase a course first.
                    </p>
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => navigate('/courses')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Browse Courses
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {courses.map((course) => (
                <div key={course.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      <img 
                        src={course.imgUrl || '/api/placeholder/300/200'} 
                        alt={course.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Purchased
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-body d-flex flex-column">
                      <div className="mb-2">
                        <span className="badge bg-secondary">
                          {course.category?.name || 'No Category'}
                        </span>
                      </div>
                      
                      <h5 className="card-title">{course.name}</h5>
                      <p className="card-text text-muted small flex-grow-1">
                        {course.description?.length > 100 
                          ? course.description.substring(0, 100) + '...'
                          : course.description
                        }
                      </p>
                      
                      <div className="course-info small text-muted mb-3">
                        <div className="d-flex justify-content-between">
                          <span>
                            <i className="bi bi-calendar3 me-1"></i>
                            Purchased: {new Date(course.purchase_date).toLocaleDateString('en-US')}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                          <span>
                            <i className="bi bi-receipt me-1"></i>
                            {course.invoice_number}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                          <span>
                            <i className="bi bi-credit-card me-1"></i>
                            {course.payment_method === 'Manual_Transfer' ? 'Manual Transfer' : course.payment_method}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-footer bg-transparent">
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleAccessCourse(course.id)}
                        >
                          <i className="bi bi-play-circle me-2"></i>
                          Start Learning
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          <i className="bi bi-info-circle me-2"></i>
                          Course Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {courses.length > 0 && (
            <div className="row mt-5">
              <div className="col-12">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h5>Want to enhance your skills?</h5>
                    <p className="text-muted">Explore other courses and improve your capabilities</p>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/courses')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      View Other Courses
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
