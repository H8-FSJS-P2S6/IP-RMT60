import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Image,
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
  Upload,
  InputNumber,
  Rate,
  Progress
} from 'antd';
import {
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  UploadOutlined,
  DollarOutlined,
  StarOutlined,
  UserOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  selectAllCourses,
  selectCoursesLoading,
} from '../../store/slices/courseSlice';
import {
  fetchAllCategories,
  selectAllCategories,
} from '../../store/slices/categorySlice';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ModernCourses = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector(selectAllCourses);
  const loading = useAppSelector(selectCoursesLoading);
  const categories = useAppSelector(selectAllCategories);
  
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAllCourses());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleCategoryFilter = (value) => {
    setSelectedCategory(value);
  };

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.CategoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setIsModalVisible(true);
    form.resetFields();
    setVideoFile(null); // Reset video file
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsModalVisible(true);
    form.setFieldsValue({
      title: course.title,
      description: course.description,
      price: course.price,
      CategoryId: course.CategoryId,
      difficulty: course.difficulty,
      duration: course.duration,
      imageUrl: course.imageUrl,
      videoUrl: course.videoUrl, // Populate videoUrl
    });
    setVideoFile(null); // Reset video file
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await dispatch(deleteCourse(courseId)).unwrap();
      message.success('Course deleted successfully');
    } catch (err) {
      console.error('Delete course error:', err);
      message.error('Failed to delete course');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let finalValues = { ...values };

      if (videoFile) {
        setIsUploadingVideo(true);
        message.loading('Uploading video...', 0);
        try {
          // 1. Get the signed URL for upload from our server
          const { data: { url, id } } = await api.post('/videos/upload');

          // 2. Upload the video file directly to Mux
          await fetch(url, {
            method: 'PUT',
            body: videoFile,
            headers: {
              'Content-Type': videoFile.type,
            },
          });
          finalValues.videoUrl = `https://stream.mux.com/${id}.m3u8`;
          message.success('Video uploaded successfully!');
        } catch (videoUploadError) {
          console.error('Error uploading video to Mux:', videoUploadError);
          message.error('Failed to upload video.');
          setIsUploadingVideo(false);
          return; // Stop the process if video upload fails
        } finally {
          setIsUploadingVideo(false);
        }
      } else if (values.videoUrl) {
        // If no new video is uploaded, but a videoUrl is provided in the form
        finalValues.videoUrl = values.videoUrl;
      } else if (editingCourse && editingCourse.videoUrl) {
        // If no new video is uploaded and no videoUrl is provided in the form, retain existing videoUrl
        finalValues.videoUrl = editingCourse.videoUrl;
      } else {
        // If no video is provided at all (for new course or clearing existing video)
        finalValues.videoUrl = null;
      }

      if (editingCourse) {
        await dispatch(updateCourse({ id: editingCourse.id, ...finalValues })).unwrap();
        message.success('Course updated successfully');
      } else {
        await dispatch(createCourse(finalValues)).unwrap();
        message.success('Course created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setVideoFile(null); // Clear video file state after successful submission
    } catch (err) {
      console.error('Save course error:', err);
      message.error('Failed to save course');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'green';
      case 'intermediate': return 'orange';
      case 'advanced': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Course',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <Image
            width={60}
            height={60}
            src={record.imageUrl}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L"
            style={{ borderRadius: 8 }}
          />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.category?.name}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Space>
          <DollarOutlined style={{ color: '#52c41a' }} />
          <Text strong>Rp{price}</Text>
        </Space>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty) => (
        <Tag color={getDifficultyColor(difficulty)}>
          {difficulty}
        </Tag>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{duration} hours</Text>
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Space>
          <Rate disabled defaultValue={rating || 0} style={{ fontSize: 14 }} />
          <Text type="secondary">({rating || 0})</Text>
        </Space>
      ),
    },
    {
      title: 'Students',
      dataIndex: 'enrolledCount',
      key: 'enrolledCount',
      render: (count) => (
        <Space>
          <UserOutlined />
          <Text>{count || 0}</Text>
        </Space>
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
          <Tooltip title="Edit Course">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditCourse(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Course">
            <Popconfirm
              title="Are you sure you want to delete this course?"
              onConfirm={() => handleDeleteCourse(record.id)}
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

  const courseStats = {
    total: courses?.length || 0,
    active: courses?.filter(c => c.isActive)?.length || 0,
    beginner: courses?.filter(c => c.difficulty?.toLowerCase() === 'beginner')?.length || 0,
    totalRevenue: courses?.reduce((sum, course) => sum + (course.price * (course.enrolledCount || 0)), 0) || 0,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Course Management
        </Title>
        <Text type="secondary">
          Manage all courses in your platform
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={courseStats.total}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Courses"
              value={courseStats.active}
              prefix={<PlayCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Beginner Courses"
              value={courseStats.beginner}
              prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={courseStats.totalRevenue}
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
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search courses..."
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by category"
                style={{ width: '100%' }}
                onChange={handleCategoryFilter}
                defaultValue="all"
              >
                <Option value="all">All Categories</Option>
                {categories?.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
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
                    onClick={handleCreateCourse}
                  >
                    Add Course
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCourses}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Create/Edit Course Modal */}
      <Modal
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingCourse ? 'Update' : 'Create'}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          name="courseForm"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Course Title"
                name="title"
                rules={[
                  { required: true, message: 'Please input course title!' },
                  { min: 3, message: 'Title must be at least 3 characters!' }
                ]}
              >
                <Input 
                  placeholder="Enter course title" 
                  prefix={<BookOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="CategoryId"
                rules={[{ required: true, message: 'Please select a category!' }]}
              >
                <Select placeholder="Select category">
                  {categories?.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input course description!' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter course description"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Price ($)"
                name="price"
                rules={[{ required: true, message: 'Please input price!' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Difficulty"
                name="difficulty"
                rules={[{ required: true, message: 'Please select difficulty!' }]}
              >
                <Select placeholder="Select difficulty">
                  <Option value="Beginner">Beginner</Option>
                  <Option value="Intermediate">Intermediate</Option>
                  <Option value="Advanced">Advanced</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Duration (hours)"
                name="duration"
                rules={[{ required: true, message: 'Please input duration!' }]}
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Course Image URL"
            name="imageUrl"
            rules={[
              { required: true, message: 'Please input image URL!' },
              { type: 'url', message: 'Please enter a valid URL!' }
            ]}
          >
            <Input 
              placeholder="Enter image URL" 
              prefix={<UploadOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Course Video URL (Mux Playback ID)"
            name="videoUrl"
            rules={[
              { type: 'url', message: 'Please enter a valid URL!' }
            ]}
          >
            <Input 
              placeholder="Enter Mux Playback URL (e.g., https://stream.mux.com/YOUR_ID.m3u8)" 
              prefix={<PlayCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Upload New Course Video"
            name="videoFile"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={editingCourse ? [] : [{ required: true, message: 'Please upload a video!' }]}
          >
            <Upload
              name="video"
              listType="picture"
              beforeUpload={() => false} // Prevent auto-upload
              onChange={(info) => setVideoFile(info.fileList[0]?.originFileObj)}
              maxCount={1}
              accept="video/*"
            >
              <Button icon={<UploadOutlined />} disabled={isUploadingVideo}>Click to Upload Video</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModernCourses;
