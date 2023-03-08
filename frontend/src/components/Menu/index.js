import {Button, Col, Layout, Menu, Row} from "antd";
import React, {useEffect, useLayoutEffect, useState} from "react";
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
    LogoutOutlined,
    GitlabOutlined, AreaChartOutlined, RiseOutlined, TeamOutlined, LockOutlined,
} from "@ant-design/icons";
import {Outlet, useNavigate} from "react-router-dom";
import axios from "axios";
import {API_URL} from "../../config";

const {Header, Sider, Content} = Layout;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const initial_items = [
    getItem("Профиль", "mainprofile", <UserOutlined/>,
        [
            getItem("Страница", "profile", <StarOutlined/>),
            getItem("Выйти", "logout", <LogoutOutlined/>)
        ]
    ),
    getItem("-", "-", undefined, undefined, "divider"),
    getItem("Наборы", "mainsets", <UnorderedListOutlined/>, [
        getItem("Все", "sets", <RocketOutlined/>),
        getItem("Мои", "mysets", <GitlabOutlined/>),
        getItem("Создать", "create", <PlusOutlined/>),

    ]),
    getItem("Прогресс", "progress", <RiseOutlined/>, [
        getItem("Текущие", "current", <ContainerOutlined/>),
        getItem("Результаты", "results", <AreaChartOutlined/>),
    ]),

];

export const MainMenu = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [items, setItems] = useState(initial_items)

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        axios.get(`${API_URL}/user-info`).then(res => res.data).then((user) => {
            console.log(user)
            if (user.is_admin) {
                let new_items = [...initial_items];
                new_items.push(getItem("Админ", "admin", <LockOutlined/>, [
                    getItem("Пользователи", "admin/users", <TeamOutlined/>),
                ]))
                setItems(new_items);
            }
        });
    }, []);


    const onMenuItemClicked = (item) => {
        let key = item.key;
        navigate(`/${key}`)
    };

    return (
        <Layout className="mainLayout">
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
                            <MenuUnfoldOutlined/>
                        ) : (
                            <MenuFoldOutlined/>
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
                <Content className="contentLayout"><Outlet/></Content>
            </Layout>
        </Layout>
    );
};
