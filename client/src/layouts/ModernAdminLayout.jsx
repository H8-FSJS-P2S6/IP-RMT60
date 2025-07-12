import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  Layout, 
  Menu, 
  Button, 
  Avatar, 
  Dropdown, 
  Typography, 
  Space,
  theme,
  Badge,
  Divider
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../utils/toast';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const ModernAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    showToast.success("Successfully logged out");
    setTimeout(() => {
      navigate("/login");
    }, 100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: '/admin/courses',
      icon: <BookOutlined />,
      label: <Link to="/admin/courses">Courses</Link>,
    },
    {
      key: '/admin/categories',
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/categories">Categories</Link>,
    },
    {
      key: '/admin/transactions',
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/transactions">Transactions</Link>,
    },
    {
      key: '/admin/payments',
      icon: <CreditCardOutlined />,
      label: <Link to="/admin/payments">Payments</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        theme="dark"
      >
        <div style={{ 
          height: 64, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text strong style={{ color: 'white', fontSize: collapsed ? 14 : 16 }}>
            {collapsed ? 'SNS' : 'SNS Admin'}
          </Text>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
        
        <div style={{ 
          position: 'absolute', 
          bottom: 16, 
          left: 16, 
          right: 16 
        }}>
          <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '8px 0'
          }}>
            <Avatar 
              size="small" 
              style={{ backgroundColor: '#1890ff' }}
              icon={<UserOutlined />}
            />
            {!collapsed && (
              <div style={{ marginLeft: 8 }}>
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {user?.email || 'admin@example.com'}
                </Text>
              </div>
            )}
          </div>
        </div>
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Space>
          
          <Space size="large">
            <Button
              type="text"
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={toggleFullscreen}
              style={{ fontSize: '16px' }}
            />
            
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: '16px' }}
              />
            </Badge>
            
            <Dropdown
              menu={{
                items: userMenuItems,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ backgroundColor: '#1890ff' }}
                  icon={<UserOutlined />}
                />
                <Text strong>{user?.username || 'Admin'}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ModernAdminLayout;
