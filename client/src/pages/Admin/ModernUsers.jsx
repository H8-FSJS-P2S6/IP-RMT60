import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Avatar,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
  Divider
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined,
  CrownOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
  selectAllUsers,
  selectUsersLoading,
  // selectUsersError
} from '../../store/slices/adminSlice';

const { Title, Text } = Typography;
const { Option } = Select;

const ModernUsers = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector(selectUsersLoading);
  // const error = useAppSelector(selectUsersError);
  
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleRoleFilter = (value) => {
    setSelectedRole(value);
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser.id, ...values })).unwrap();
        message.success('User updated successfully');
      } else {
        await dispatch(createUser(values)).unwrap();
        message.success('User created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save user');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space>
          <Avatar 
            size="large" 
            style={{ backgroundColor: record.role === 'Admin' ? '#f5222d' : '#1890ff' }}
          >
            {text?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              <MailOutlined /> {record.email}
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
        <Tag 
          color={role === 'Admin' ? 'red' : 'blue'}
          icon={role === 'Admin' ? <CrownOutlined /> : <UserOutlined />}
        >
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Badge 
          status={isActive ? 'success' : 'error'} 
          text={isActive ? 'Active' : 'Inactive'} 
        />
      ),
    },
    {
      title: 'Joined',
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
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const userStats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'Admin')?.length || 0,
    regular: users?.filter(u => u.role === 'User')?.length || 0,
    active: users?.filter(u => u.isActive)?.length || 0,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          User Management
        </Title>
        <Text type="secondary">
          Manage all users in your platform
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={userStats.total}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Administrators"
              value={userStats.admins}
              prefix={<CrownOutlined style={{ color: '#f5222d' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Regular Users"
              value={userStats.regular}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={userStats.active}
              prefix={<UserSwitchOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search users..."
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by role"
                style={{ width: '100%' }}
                onChange={handleRoleFilter}
                defaultValue="all"
              >
                <Option value="all">All Roles</Option>
                <Option value="Admin">Admin</Option>
                <Option value="User">User</Option>
              </Select>
            </Col>
            <Col xs={24} md={10}>
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    icon={<ExportOutlined />}
                    type="default"
                  >
                    Export
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleCreateUser}
                  >
                    Add User
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        title={editingUser ? 'Edit User' : 'Create New User'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingUser ? 'Update' : 'Create'}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="userForm"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input username!' },
              { min: 3, message: 'Username must be at least 3 characters!' }
            ]}
          >
            <Input 
              placeholder="Enter username" 
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              placeholder="Enter email address" 
              prefix={<MailOutlined />}
            />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select user role">
              <Option value="User">User</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModernUsers;
