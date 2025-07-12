import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Typography,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
  Avatar,
  DatePicker,
  Progress,
  Alert
} from 'antd';
import {
  CreditCardOutlined,
  DollarOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  BankOutlined,
  WalletOutlined,
  PayCircleOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAllPayments,
  selectAllPayments,
  selectPaymentsLoading,
} from '../../store/slices/transactionSlice';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ModernPayments = () => {
  const dispatch = useAppDispatch();
  const payments = useAppSelector(selectAllPayments);
  const loading = useAppSelector(selectPaymentsLoading);
  
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setSelectedStatus(value);
  };

  const handleMethodFilter = (value) => {
    setSelectedMethod(value);
  };

  const handleDateRangeFilter = (dates) => {
    setSelectedDateRange(dates);
  };

  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = payment.id?.toString().includes(searchText) ||
                         payment.user?.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                         payment.transactionId?.toString().includes(searchText);
    
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesMethod = selectedMethod === 'all' || payment.paymentMethod === selectedMethod;
    
    let matchesDateRange = true;
    if (selectedDateRange && selectedDateRange.length === 2) {
      const paymentDate = new Date(payment.createdAt);
      const startDate = selectedDateRange[0].toDate();
      const endDate = selectedDateRange[1].toDate();
      matchesDateRange = paymentDate >= startDate && paymentDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDateRange;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return <CheckCircleOutlined />;
      case 'pending': return <ClockCircleOutlined />;
      case 'failed': return <ExclamationCircleOutlined />;
      case 'cancelled': return <ExclamationCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit_card': return <CreditCardOutlined />;
      case 'bank_transfer': return <BankOutlined />;
      case 'e_wallet': return <WalletOutlined />;
      case 'paypal': return <PayCircleOutlined />;
      default: return <CreditCardOutlined />;
    }
  };

  const columns = [
    {
      title: 'Payment ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Text strong>#{id}</Text>
      ),
    },
    {
      title: 'Transaction',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (transactionId) => (
        <Text>TXN-{transactionId}</Text>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <Space>
          <Avatar 
            size="small" 
            style={{ backgroundColor: '#1890ff' }}
            icon={<UserOutlined />}
          />
          <div>
            <Text strong>{user?.username}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Space>
          <DollarOutlined style={{ color: '#52c41a' }} />
          <Text strong>${amount}</Text>
        </Space>
      ),
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => (
        <Space>
          {getMethodIcon(method)}
          <Text>{method?.replace('_', ' ').toUpperCase()}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={getStatusColor(status)}
          icon={getStatusIcon(status)}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <Text>{new Date(date).toLocaleDateString()}</Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const paymentStats = {
    total: payments?.length || 0,
    success: payments?.filter(p => p.status === 'success')?.length || 0,
    pending: payments?.filter(p => p.status === 'pending')?.length || 0,
    totalRevenue: payments?.filter(p => p.status === 'success')?.reduce((sum, p) => sum + p.amount, 0) || 0,
  };

  const methodStats = {
    credit_card: payments?.filter(p => p.paymentMethod === 'credit_card')?.length || 0,
    bank_transfer: payments?.filter(p => p.paymentMethod === 'bank_transfer')?.length || 0,
    e_wallet: payments?.filter(p => p.paymentMethod === 'e_wallet')?.length || 0,
    paypal: payments?.filter(p => p.paymentMethod === 'paypal')?.length || 0,
  };

  const successRate = payments?.length > 0 ? (paymentStats.success / payments.length) * 100 : 0;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Payment Management
        </Title>
        <Text type="secondary">
          Monitor and manage all payment transactions
        </Text>
      </div>

      {/* Alert for payment insights */}
      <Alert
        message="Payment Insights"
        description={`Success Rate: ${successRate.toFixed(1)}% | Most used method: Credit Card | Peak hours: 2-4 PM`}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Payments"
              value={paymentStats.total}
              prefix={<CreditCardOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Successful"
              value={paymentStats.success}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={paymentStats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={paymentStats.totalRevenue}
              prefix={<DollarOutlined style={{ color: '#eb2f96' }} />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Payment Methods Stats */}
      <Card title="Payment Methods Distribution" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={Math.round((methodStats.credit_card / payments?.length) * 100) || 0}
                format={() => `${methodStats.credit_card}`}
                strokeColor="#1890ff"
                size={80}
              />
              <div style={{ marginTop: 8 }}>
                <Text strong>Credit Card</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={Math.round((methodStats.bank_transfer / payments?.length) * 100) || 0}
                format={() => `${methodStats.bank_transfer}`}
                strokeColor="#52c41a"
                size={80}
              />
              <div style={{ marginTop: 8 }}>
                <Text strong>Bank Transfer</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={Math.round((methodStats.e_wallet / payments?.length) * 100) || 0}
                format={() => `${methodStats.e_wallet}`}
                strokeColor="#fa8c16"
                size={80}
              />
              <div style={{ marginTop: 8 }}>
                <Text strong>E-Wallet</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={Math.round((methodStats.paypal / payments?.length) * 100) || 0}
                format={() => `${methodStats.paypal}`}
                strokeColor="#eb2f96"
                size={80}
              />
              <div style={{ marginTop: 8 }}>
                <Text strong>PayPal</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={5}>
              <Input
                placeholder="Search payments..."
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="Filter by status"
                style={{ width: '100%' }}
                onChange={handleStatusFilter}
                defaultValue="all"
              >
                <Option value="all">All Status</Option>
                <Option value="success">Success</Option>
                <Option value="pending">Pending</Option>
                <Option value="failed">Failed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="Filter by method"
                style={{ width: '100%' }}
                onChange={handleMethodFilter}
                defaultValue="all"
              >
                <Option value="all">All Methods</Option>
                <Option value="credit_card">Credit Card</Option>
                <Option value="bank_transfer">Bank Transfer</Option>
                <Option value="e_wallet">E-Wallet</Option>
                <Option value="paypal">PayPal</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeFilter}
                placeholder={['Start Date', 'End Date']}
              />
            </Col>
            <Col xs={24} md={4}>
              <div style={{ textAlign: 'right' }}>
                <Button 
                  icon={<ExportOutlined />}
                  type="default"
                >
                  Export
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredPayments}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} payments`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default ModernPayments;
