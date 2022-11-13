import { Button, Col, Menu, Row } from "antd";
import React, { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ContainerOutlined,
    UnorderedListOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";

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
    getItem("Создать", "1", <PlusOutlined />),
    getItem("Наборы", "2", <UnorderedListOutlined />),
    getItem("Option 3", "3", <ContainerOutlined />),
];

export const MainMenu = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Row style={{width: "100%"}}>
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
                        mode="inline"
                        theme="lighth"
                        inlineCollapsed={collapsed}
                        items={items}
                    />
                </div>
            </Col>
            <Col span={20} style={{width: "100%"}}>
                <Outlet />
            </Col>
        </Row>
    );
};
