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
  Descriptions,
  Modal
} from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  BookOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAllTransactions,
  selectAllTransactions,
  selectTransactionsLoading,
} from '../../store/slices/transactionSlice';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ModernTransactions = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectAllTransactions);
  const loading = useAppSelector(selectTransactionsLoading);
  
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setSelectedStatus(value);
  };

  const handleDateRangeFilter = (dates) => {
    setSelectedDateRange(dates);
  };

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction.id?.toString().includes(searchText) ||
                         transaction.user?.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                         transaction.user?.email?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    
    let matchesDateRange = true;
    if (selectedDateRange && selectedDateRange.length === 2) {
      const transactionDate = new Date(transaction.createdAt);
      const startDate = selectedDateRange[0].toDate();
      const endDate = selectedDateRange[1].toDate();
      matchesDateRange = transactionDate >= startDate && transactionDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircleOutlined />;
      case 'pending': return <ClockCircleOutlined />;
      case 'failed': return <ExclamationCircleOutlined />;
      case 'cancelled': return <ExclamationCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Text strong>#{id}</Text>
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
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <Space direction="vertical" size={0}>
          {items?.slice(0, 2).map((item, index) => (
            <Text key={index} style={{ fontSize: 12 }}>
              <BookOutlined /> {item.lecture?.title}
            </Text>
          ))}
          {items?.length > 2 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              +{items.length - 2} more items
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <Space>
          <DollarOutlined style={{ color: '#52c41a' }} />
          <Text strong>${total}</Text>
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
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => (
        <Space>
          <CreditCardOutlined />
          <Text>{method || 'N/A'}</Text>
        </Space>
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
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const transactionStats = {
    total: transactions?.length || 0,
    completed: transactions?.filter(t => t.status === 'completed')?.length || 0,
    pending: transactions?.filter(t => t.status === 'pending')?.length || 0,
    totalRevenue: transactions?.filter(t => t.status === 'completed')?.reduce((sum, t) => sum + t.total, 0) || 0,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Transaction Management
        </Title>
        <Text type="secondary">
          Monitor and manage all transactions
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={transactionStats.total}
              prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={transactionStats.completed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={transactionStats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={transactionStats.totalRevenue}
              prefix={<DollarOutlined style={{ color: '#eb2f96' }} />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search transactions..."
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by status"
                style={{ width: '100%' }}
                onChange={handleStatusFilter}
                defaultValue="all"
              >
                <Option value="all">All Status</Option>
                <Option value="completed">Completed</Option>
                <Option value="pending">Pending</Option>
                <Option value="failed">Failed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeFilter}
                placeholder={['Start Date', 'End Date']}
              />
            </Col>
            <Col xs={24} md={6}>
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
          dataSource={filteredTransactions}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} transactions`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Transaction Detail Modal */}
      <Modal
        title={`Transaction Details - #${selectedTransaction?.id}`}
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTransaction && (
          <div>
            <Descriptions
              title="Transaction Information"
              bordered
              column={2}
            >
              <Descriptions.Item label="Transaction ID">
                #{selectedTransaction.id}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag 
                  color={getStatusColor(selectedTransaction.status)}
                  icon={getStatusIcon(selectedTransaction.status)}
                >
                  {selectedTransaction.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {selectedTransaction.user?.username} ({selectedTransaction.user?.email})
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <Text strong>${selectedTransaction.total}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedTransaction.paymentMethod || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {new Date(selectedTransaction.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Card 
              title="Items" 
              style={{ marginTop: 16 }}
              size="small"
            >
              {selectedTransaction.items?.map((item, index) => (
                <div key={index} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space>
                        <BookOutlined />
                        <Text>{item.lecture?.title}</Text>
                      </Space>
                    </Col>
                    <Col>
                      <Text strong>${item.price}</Text>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ModernTransactions;
