import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
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
  Avatar,
  Progress
} from 'antd';
import {
  AppstoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  BookOutlined,
  StarOutlined,
  TrophyOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  selectAllCategories,
  selectCategoriesLoading,
} from '../../store/slices/categorySlice';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ModernCategories = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectAllCategories);
  const loading = useAppSelector(selectCategoriesLoading);
  
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredCategories = categories?.filter(category => {
    const matchesSearch = category.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      message.success('Category deleted successfully');
    } catch (err) {
      console.error('Delete category error:', err);
      message.error('Failed to delete category');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, ...values })).unwrap();
        message.success('Category updated successfully');
      } else {
        await dispatch(createCategory(values)).unwrap();
        message.success('Category created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error('Save category error:', err);
      message.error('Failed to save category');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const getRandomColor = () => {
    const colors = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1', '#13c2c2'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar 
            size="large" 
            style={{ backgroundColor: getRandomColor() }}
            icon={<FolderOutlined />}
          />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Courses',
      dataIndex: 'courseCount',
      key: 'courseCount',
      render: (count) => (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          <Text strong>{count || 0}</Text>
        </Space>
      ),
    },
    {
      title: 'Popularity',
      dataIndex: 'popularity',
      key: 'popularity',
      render: (popularity) => (
        <div style={{ width: 100 }}>
          <Progress 
            percent={popularity || 0} 
            size="small"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
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
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
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
          <Tooltip title="Edit Category">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditCategory(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Category">
            <Popconfirm
              title="Are you sure you want to delete this category?"
              onConfirm={() => handleDeleteCategory(record.id)}
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

  const categoryStats = {
    total: categories?.length || 0,
    active: categories?.filter(c => c.isActive)?.length || 0,
    totalCourses: categories?.reduce((sum, cat) => sum + (cat.courseCount || 0), 0) || 0,
    avgPopularity: categories?.reduce((sum, cat) => sum + (cat.popularity || 0), 0) / (categories?.length || 1) || 0,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Category Management
        </Title>
        <Text type="secondary">
          Organize and manage course categories
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Categories"
              value={categoryStats.total}
              prefix={<AppstoreOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Categories"
              value={categoryStats.active}
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={categoryStats.totalCourses}
              prefix={<BookOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Popularity"
              value={categoryStats.avgPopularity}
              prefix={<StarOutlined style={{ color: '#eb2f96' }} />}
              precision={1}
              suffix="%"
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
                placeholder="Search categories..."
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={16}>
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
                    onClick={handleCreateCategory}
                  >
                    Add Category
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCategories}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} categories`,
          }}
        />
      </Card>

      {/* Create/Edit Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingCategory ? 'Update' : 'Create'}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="categoryForm"
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              { required: true, message: 'Please input category name!' },
              { min: 2, message: 'Name must be at least 2 characters!' }
            ]}
          >
            <Input 
              placeholder="Enter category name" 
              prefix={<AppstoreOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input category description!' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter category description"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModernCategories;
