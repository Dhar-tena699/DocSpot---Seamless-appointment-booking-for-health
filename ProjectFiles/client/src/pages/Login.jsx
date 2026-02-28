import { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axiosConfig";

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { data } = await API.post("/auth/login", values);

            if (data.success) {
                login(data.data.user, data.data.token);
                message.success("Login successful!");

                const role = data.data.user.role;
                if (role === "admin") navigate("/admin-dashboard");
                else if (role === "doctor") navigate("/doctor-dashboard");
                else navigate("/user-dashboard");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Login failed. Please try again.";
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card" bordered={false}>
                <div className="auth-header">
                    <Title level={2} style={{ margin: 0, color: "#1677ff" }}>
                        Welcome Back
                    </Title>
                    <Text type="secondary">Sign in to your DocSpot account</Text>
                </div>

                <Form
                    name="login"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Please enter a valid email" },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: "Please enter your password" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <div className="auth-footer">
                    <Text>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default Login;
