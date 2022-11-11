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
    getItem("Создать новый набор", "1", <PlusOutlined />),
    getItem("Список всех наборов", "2", <UnorderedListOutlined />),
    getItem("Option 3", "3", <ContainerOutlined />),
];

export const MainMenu = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Row>
            <Col>
                <div
                    style={{
                        width: 256,
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
            <Col>
                <Outlet />
            </Col>
        </Row>
    );
};
