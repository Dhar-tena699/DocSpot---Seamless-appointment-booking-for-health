import { useState } from "react";
import { Form, Input, Button, Select, Typography, message, Card } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axiosConfig";

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { data } = await API.post("/auth/register", values);

            if (data.success) {
                const role = data.data.user.role;

                if (role === "admin") {
                    // Admin needs approval — don't auto-login
                    message.info(
                        "Wait for admin approval to access the resources because it contains Sensitive Data.",
                        5
                    );
                    setTimeout(() => {
                        navigate("/");
                    }, 5000);
                } else {
                    login(data.data.user, data.data.token);
                    message.success("Registration successful!");
                    if (role === "doctor") navigate("/doctor-dashboard");
                    else navigate("/user-dashboard");
                }
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Registration failed. Please try again.";
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
                        Create Account
                    </Title>
                    <Text type="secondary">Join DocSpot today</Text>
                </div>

                <Form
                    name="register"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                    initialValues={{ role: "patient" }}
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: "Please enter your name" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
                    </Form.Item>

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
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="I am a"
                        rules={[{ required: true, message: "Please select your role" }]}
                    >
                        <Select placeholder="Select your role">
                            <Option value="patient">Patient</Option>
                            <Option value="doctor">Doctor</Option>
                            <Option value="admin">Admin</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Create Account
                        </Button>
                    </Form.Item>
                </Form>

                <div className="auth-footer">
                    <Text>
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default Register;
