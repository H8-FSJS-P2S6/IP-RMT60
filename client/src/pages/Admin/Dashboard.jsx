import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../../utils/api";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalCategories: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [coursesPerCategory, setCoursesPerCategory] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, this might be a single endpoint that returns all dashboard data
        const [statsResponse, usersResponse, ordersResponse, categoriesResponse, salesResponse] = await Promise.all([
          api.get("/admin/statistics"),
          api.get("/admin/users?limit=5"),
          api.get("/admin/orders?limit=5"),
          api.get("/admin/categories/stats"),
          api.get("/admin/orders/monthly")
        ]);

        setStats(statsResponse.data);
        setRecentUsers(usersResponse.data);
        setRecentOrders(ordersResponse.data);
        setCoursesPerCategory(categoriesResponse.data);
        setMonthlySales(salesResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Prepare data for pie chart
  const categoryChartData = {
    labels: coursesPerCategory.map(item => item.name),
    datasets: [
      {
        data: coursesPerCategory.map(item => item.courseCount),
        backgroundColor: [
          '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
          '#5a5c69', '#858796', '#6f42c1', '#20c9a6', '#f8f9fc'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for bar chart
  const salesChartData = {
    labels: monthlySales.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: monthlySales.map(item => item.revenue),
        backgroundColor: '#4e73df',
      },
      {
        label: 'Orders',
        data: monthlySales.map(item => item.orderCount),
        backgroundColor: '#1cc88a',
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Performance',
      },
    },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4 mb-4">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white-50">Total Users</div>
                  <div className="display-6 fw-bold">{stats.totalUsers}</div>
                </div>
                <div>
                  <i className="bi bi-people-fill fs-1"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/users" className="small text-white text-decoration-none">
                View Details
              </Link>
              <div className="small text-white"><i className="bi bi-chevron-right"></i></div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white-50">Total Courses</div>
                  <div className="display-6 fw-bold">{stats.totalCourses}</div>
                </div>
                <div>
                  <i className="bi bi-journal-richtext fs-1"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/courses" className="small text-white text-decoration-none">
                View Details
              </Link>
              <div className="small text-white"><i className="bi bi-chevron-right"></i></div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white-50">Total Orders</div>
                  <div className="display-6 fw-bold">{stats.totalOrders}</div>
                </div>
                <div>
                  <i className="bi bi-cart-check-fill fs-1"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/orders" className="small text-white text-decoration-none">
                View Details
              </Link>
              <div className="small text-white"><i className="bi bi-chevron-right"></i></div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white-50">Total Revenue</div>
                  <div className="fs-5 fw-bold">{formatToIDR(stats.revenue)}</div>
                </div>
                <div>
                  <i className="bi bi-currency-dollar fs-1"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/reports" className="small text-white text-decoration-none">
                View Reports
              </Link>
              <div className="small text-white"><i className="bi bi-chevron-right"></i></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-bar-chart-fill me-1"></i>
              Monthly Sales
            </div>
            <div className="card-body">
              <Bar data={salesChartData} options={salesChartOptions} height={300} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-pie-chart-fill me-1"></i>
              Courses by Category
            </div>
            <div className="card-body">
              <Pie data={categoryChartData} />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-person-plus-fill me-1"></i>
              Recent Users
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <span className={`badge ${user.role === "Admin" ? "bg-danger" : "bg-primary"}`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-3">
                <Link to="/admin/users" className="btn btn-sm btn-primary">
                  View All Users
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-bag-check-fill me-1"></i>
              Recent Orders
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.User.username}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{formatToIDR(order.totalAmount)}</td>
                        <td>
                          <span className={`badge ${
                            order.status === "Completed" ? "bg-success" :
                            order.status === "Processing" ? "bg-warning" :
                            "bg-info"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-3">
                <Link to="/admin/orders" className="btn btn-sm btn-primary">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}