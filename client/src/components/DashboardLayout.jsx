import { useState } from "react";
import { Layout, Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

const DashboardLayout = ({ menuItems, selectedKey, onMenuSelect, children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    const allItems = [
        ...menuItems,
        { type: "divider" },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            danger: true,
        },
    ];

    const handleClick = (e) => {
        if (e.key === "logout") {
            handleLogout();
        } else {
            onMenuSelect(e.key);
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                style={{ background: "#001529" }}
                breakpoint="lg"
            >
                <div
                    style={{
                        height: 48,
                        margin: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: collapsed ? 16 : 20,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                    }}
                >
                    {collapsed ? "🩺" : "🩺 DocSpot"}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={allItems}
                    onClick={handleClick}
                />
            </Sider>
            <Layout>
                <div
                    style={{
                        padding: "12px 24px",
                        background: "#fff",
                        borderBottom: "1px solid #f0f0f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 16, fontWeight: 500 }}>
                        Welcome, {user?.name}
                    </span>
                    <span
                        style={{
                            background: "#f0f5ff",
                            color: "#1677ff",
                            padding: "4px 12px",
                            borderRadius: 16,
                            fontSize: 13,
                            fontWeight: 500,
                            textTransform: "capitalize",
                        }}
                    >
                        {user?.role}
                    </span>
                </div>
                <Content style={{ margin: 24, minHeight: 360 }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
