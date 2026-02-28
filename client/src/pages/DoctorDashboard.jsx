import { useState, useEffect } from "react";
import {
    Card,
    Table,
    Tag,
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    message,
    Spin,
    Typography,
    Descriptions,
    Popconfirm,
} from "antd";
import {
    UserOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";
import API from "../utils/axiosConfig";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const STATUS_COLORS = {
    pending: "orange",
    approved: "green",
    rejected: "red",
    completed: "blue",
};

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm();

    const menuItems = [
        { key: "profile", icon: <UserOutlined />, label: "My Profile" },
        { key: "appointments", icon: <CalendarOutlined />, label: "My Appointments" },
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (activeTab === "appointments") fetchAppointments();
    }, [activeTab]);

    const fetchProfile = async () => {
        setProfileLoading(true);
        try {
            const { data } = await API.get("/doctor/get-my-profile");
            if (data.success) setProfile(data.data.doctor);
        } catch (error) {
            if (error.response?.status !== 404) {
                message.error("Failed to fetch profile");
            }
            setProfile(null);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleCreateProfile = async (values) => {
        setCreating(true);
        try {
            const { data } = await API.post("/doctor/create-profile", values);
            if (data.success) {
                message.success("Profile created successfully!");
                fetchProfile();
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to create profile");
        } finally {
            setCreating(false);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data } = await API.get("/doctor/get-my-appointments");
            if (data.success) setAppointments(data.data.appointments);
        } catch {
            message.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const { data } = await API.patch(`/doctor/update-appointment-status/${id}`, { status });
            if (data.success) {
                message.success(`Appointment ${status}`);
                fetchAppointments();
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to update");
        }
    };

    const appointmentColumns = [
        {
            title: "Patient",
            key: "patient",
            render: (_, record) => record.patientId?.name || "N/A",
        },
        {
            title: "Email",
            key: "email",
            render: (_, record) => record.patientId?.email || "N/A",
        },
        {
            title: "Date",
            dataIndex: "appointmentDate",
            key: "date",
            render: (date) => dayjs(date).format("DD MMM YYYY"),
        },
        {
            title: "Time Slot",
            dataIndex: "timeSlot",
            key: "timeSlot",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={STATUS_COLORS[status]}>{status.toUpperCase()}</Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) =>
                record.status === "pending" ? (
                    <div style={{ display: "flex", gap: 8 }}>
                        <Popconfirm
                            title="Approve this appointment?"
                            onConfirm={() => handleUpdateStatus(record._id, "approved")}
                        >
                            <Button type="primary" size="small">Approve</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="Reject this appointment?"
                            onConfirm={() => handleUpdateStatus(record._id, "rejected")}
                        >
                            <Button danger size="small">Reject</Button>
                        </Popconfirm>
                    </div>
                ) : null,
        },
    ];

    const renderProfileForm = () => (
        <Card style={{ maxWidth: 600, margin: "0 auto", borderRadius: 12 }}>
            <Title level={4} style={{ marginBottom: 24 }}>Create Your Doctor Profile</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateProfile}
                initialValues={{ availableDays: [], availableTimeSlots: [] }}
            >
                <Form.Item
                    name="specialization"
                    label="Specialization"
                    rules={[{ required: true, message: "Required" }]}
                >
                    <Input placeholder="e.g. Cardiology, Dermatology" />
                </Form.Item>
                <Form.Item
                    name="experience"
                    label="Experience (years)"
                    rules={[{ required: true, message: "Required" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="Years of experience" />
                </Form.Item>
                <Form.Item
                    name="consultationFee"
                    label="Consultation Fee (₹)"
                    rules={[{ required: true, message: "Required" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="Fee per consultation" />
                </Form.Item>
                <Form.Item name="availableDays" label="Available Days">
                    <Select mode="multiple" placeholder="Select available days">
                        {DAYS_OF_WEEK.map((day) => (
                            <Option key={day} value={day}>{day}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="availableTimeSlots" label="Available Time Slots">
                    <Select mode="multiple" placeholder="Select time slots">
                        {TIME_SLOTS.map((slot) => (
                            <Option key={slot} value={slot}>{slot}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="hospitalName" label="Hospital / Clinic Name">
                    <Input placeholder="Hospital or clinic name" />
                </Form.Item>
                <Form.Item name="address" label="Address">
                    <Input placeholder="Clinic address" />
                </Form.Item>
                <Form.Item name="bio" label="Bio">
                    <TextArea rows={3} placeholder="Short bio about yourself" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={creating} block>
                        Create Profile
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );

    const renderProfileCard = () => (
        <Card style={{ maxWidth: 600, margin: "0 auto", borderRadius: 12 }}>
            <Title level={4} style={{ marginBottom: 24 }}>My Profile</Title>
            <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Name">{profile?.userId?.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{profile?.userId?.email}</Descriptions.Item>
                <Descriptions.Item label="Specialization">{profile?.specialization}</Descriptions.Item>
                <Descriptions.Item label="Experience">{profile?.experience} years</Descriptions.Item>
                <Descriptions.Item label="Fee">₹{profile?.consultationFee}</Descriptions.Item>
                <Descriptions.Item label="Hospital">{profile?.hospitalName || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Address">{profile?.address || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Available Days">
                    {profile?.availableDays?.join(", ") || "Not set"}
                </Descriptions.Item>
                <Descriptions.Item label="Time Slots">
                    {profile?.availableTimeSlots?.join(", ") || "Not set"}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Tag color={profile?.isAvailable ? "green" : "red"}>
                        {profile?.isAvailable ? "Available" : "Unavailable"}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );

    const renderProfile = () => {
        if (profileLoading) {
            return <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div>;
        }
        return profile ? renderProfileCard() : renderProfileForm();
    };

    const renderAppointments = () => (
        <div>
            <Title level={4} style={{ marginBottom: 24 }}>My Appointments</Title>
            <Table
                columns={appointmentColumns}
                dataSource={appointments}
                rowKey="_id"
                loading={loading}
                locale={{ emptyText: "No appointments yet" }}
                scroll={{ x: 700 }}
            />
        </div>
    );

    return (
        <DashboardLayout
            menuItems={menuItems}
            selectedKey={activeTab}
            onMenuSelect={setActiveTab}
        >
            {activeTab === "profile" ? renderProfile() : renderAppointments()}
        </DashboardLayout>
    );
};

export default DoctorDashboard;
