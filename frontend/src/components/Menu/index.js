import { Button, Col, Menu, Row } from "antd";
import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ContainerOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

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
  getItem("Профиль", "profile", <UserOutlined />),
  getItem("-", "-", undefined, undefined, "divider"),
  getItem("Создать", "create", <PlusOutlined />),
  getItem("Наборы", "sets", <UnorderedListOutlined />),
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
    if(key === "profile")
      navigate("profile");
  };

  return (
    <Row style={{ width: "100%" }}>
      <Col span={3}>
        <div
          style={{
            width: 210,
          }}
          className="App-menu_wrapper"
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
            inlineCollapsed={collapsed}
            items={items}
          />
        </div>
      </Col>
      <Col span={20} style={{ width: "100%" }}>
        <Outlet />
      </Col>
    </Row>
  );
};
