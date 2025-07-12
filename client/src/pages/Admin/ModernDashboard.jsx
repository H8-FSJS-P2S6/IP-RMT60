import { useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Typography, 
  Space,
  Progress,
  Table,
  Tag,
  Avatar,
  List,
  Skeleton,
  Alert,
  Spin,
  Button,
  Divider
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchDashboardStats,
  fetchRecentUsers,
  fetchRecentOrders,
  fetchCategoryStats,
  fetchMonthlySales,
  selectDashboardStats,
  selectRecentUsers,
  selectRecentOrders,
  selectCategoryStats,
  selectMonthlySales,
  selectDashboardLoading,
  selectDashboardError
} from '../../store/slices/adminSlice';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Title: AntTitle, Text } = Typography;

const ModernDashboard = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectDashboardStats);
  const recentUsers = useAppSelector(selectRecentUsers);
  const recentOrders = useAppSelector(selectRecentOrders);
  const coursesPerCategory = useAppSelector(selectCategoryStats);
  const monthlySales = useAppSelector(selectMonthlySales);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentUsers());
    dispatch(fetchRecentOrders());
    dispatch(fetchCategoryStats());
    dispatch(fetchMonthlySales());
  }, [dispatch]);

  // Prepare chart data
  const pieChartData = {
    labels: coursesPerCategory?.map(item => item.category) || [],
    datasets: [
      {
        data: coursesPerCategory?.map(item => item.count) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const barChartData = {
    labels: monthlySales?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Sales',
        data: monthlySales?.map(item => item.sales) || [],
        backgroundColor: '#1890ff',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const recentUsersColumns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {text?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'Admin' ? 'red' : 'blue'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Dashboard"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: 24 }}
      />
    );
  }

  return (
    <div style={{ padding: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <AntTitle level={2} style={{ margin: 0 }}>
          Dashboard Overview
        </AntTitle>
        <Text type="secondary">
          Welcome back! Here's what's happening with your platform.
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <Tag color="green" style={{ marginLeft: 8 }}>
                  <ArrowUpOutlined /> 12%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={stats?.totalCourses || 0}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <Tag color="green" style={{ marginLeft: 8 }}>
                  <ArrowUpOutlined /> 8%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats?.totalOrders || 0}
              prefix={<ShoppingOutlined style={{ color: '#fa8c16' }} />}
              suffix={
                <Tag color="red" style={{ marginLeft: 8 }}>
                  <ArrowDownOutlined /> 3%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats?.totalRevenue || 0}
              prefix={<DollarOutlined style={{ color: '#eb2f96' }} />}
              precision={2}
              suffix={
                <Tag color="green" style={{ marginLeft: 8 }}>
                  <ArrowUpOutlined /> 15%
                </Tag>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <TrophyOutlined />
                <span>Courses by Category</span>
              </Space>
            }
            extra={<Button type="text" icon={<EyeOutlined />}>View All</Button>}
          >
            <div style={{ height: 300 }}>
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <DollarOutlined />
                <span>Monthly Sales</span>
              </Space>
            }
            extra={<Button type="text" icon={<EyeOutlined />}>View All</Button>}
          >
            <div style={{ height: 300 }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Recent Users</span>
              </Space>
            }
            extra={<Button type="text" icon={<EyeOutlined />}>View All</Button>}
          >
            <Table
              columns={recentUsersColumns}
              dataSource={recentUsers}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <ShoppingOutlined />
                <span>Recent Orders</span>
              </Space>
            }
            extra={<Button type="text" icon={<EyeOutlined />}>View All</Button>}
          >
            <List
              dataSource={recentOrders}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: '#1890ff' }}
                        icon={<ShoppingOutlined />}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>Order #{item.id}</Text>
                        <Tag color={item.status === 'completed' ? 'green' : 'orange'}>
                          {item.status}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">{item.user?.username}</Text>
                        <Text type="secondary">
                          <ClockCircleOutlined /> {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                      </Space>
                    }
                  />
                  <div>
                    <Text strong>${item.total}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card
        title="Quick Actions"
        style={{ marginTop: 24 }}
        extra={<Text type="secondary">Frequently used actions</Text>}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" hoverable>
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Text strong>Add New User</Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" hoverable>
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                <BookOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <Text strong>Create Course</Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" hoverable>
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                <ShoppingOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                <Text strong>View Orders</Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" hoverable>
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                <DollarOutlined style={{ fontSize: 24, color: '#eb2f96' }} />
                <Text strong>Financial Report</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ModernDashboard;
