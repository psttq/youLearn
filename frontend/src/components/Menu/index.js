import { Button, Col, Layout, Menu, Row } from "antd";
import React, { useLayoutEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ContainerOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  UserOutlined,
  EditOutlined,
  RocketOutlined,
  StarOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Профиль", "mainprofile", <UserOutlined />,
    [
      getItem("Страница", "profile", <StarOutlined />),
      getItem("Редактировать", "editprofile", <EditOutlined />),
      getItem("Выйти", "logout", <LogoutOutlined />)
    ]
  ),
  getItem("-", "-", undefined, undefined, "divider"),
  getItem("Наборы", "mainsets", <UnorderedListOutlined />, [
    getItem("Все", "sets", <RocketOutlined />),
    getItem("Создать", "create", <PlusOutlined />),

  ]),
  getItem("Option 3", "4", <ContainerOutlined />),
];

export const MainMenu = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onMenuItemClicked = (item) => {
    let key = item.key;
    navigate(`/${key}`)
  };

  return (
    <Layout  className="mainLayout">
      <Sider className="siderMenu" 
      width={230}
      collapsed={collapsed}>
        <div
        >
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{
              marginBottom: 16,
            }}
            shape="circle"
          >
            {collapsed ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )}
          </Button>
          <Menu
            className="App-menu"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            onClick={(item) => onMenuItemClicked(item)}
            mode="inline"
            theme="lighth"
            items={items}
            inlineIndent={16} 
             />
        </div>
      </Sider>
      <Layout className="outletLayout">
        <Content className="contentLayout" ><Outlet /></Content>
      </Layout>
    </Layout>
  );
};
