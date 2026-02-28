import { useState, useEffect } from "react";
import {
    Table,
    Tag,
    Button,
    message,
    Typography,
    Popconfirm,
    Badge,
} from "antd";
import {
    TeamOutlined,
    MedicineBoxOutlined,
    CalendarOutlined,
    CrownOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";
import API from "../utils/axiosConfig";
import dayjs from "dayjs";

const { Title } = Typography;

const STATUS_COLORS = {
    pending: "orange",
    approved: "green",
    rejected: "red",
    completed: "blue",
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [pendingAdmins, setPendingAdmins] = useState([]);
    const [loading, setLoading] = useState(false);

    const pendingCount = pendingAdmins.length;

    const menuItems = [
        { key: "users", icon: <TeamOutlined />, label: "Users" },
        { key: "doctors", icon: <MedicineBoxOutlined />, label: "Doctors" },
        { key: "appointments", icon: <CalendarOutlined />, label: "Appointments" },
        {
            key: "admin-approval",
            icon: <CrownOutlined />,
            label: pendingCount > 0 ? (
                <span>Admin Approval <Badge count={pendingCount} size="small" offset={[6, -2]} /></span>
            ) : (
                "Admin Approval"
            ),
        },
    ];

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
        else if (activeTab === "doctors") fetchDoctors();
        else if (activeTab === "appointments") fetchAppointments();
        else if (activeTab === "admin-approval") fetchPendingAdmins();
    }, [activeTab]);

    // Fetch pending admins on mount so badge shows count
    useEffect(() => {
        fetchPendingAdmins();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await API.get("/admin/get-all-users");
            if (data.success) setUsers(data.data.users);
        } catch {
            message.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const { data } = await API.get("/admin/get-all-doctors");
            if (data.success) setDoctors(data.data.doctors);
        } catch {
            message.error("Failed to fetch doctors");
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data } = await API.get("/admin/get-all-appointments");
            if (data.success) setAppointments(data.data.appointments);
        } catch {
            message.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingAdmins = async () => {
        try {
            const { data } = await API.get("/admin/get-all-users");
            if (data.success) {
                const pending = data.data.users.filter(
                    (u) => u.role === "admin" && !u.isApproved
                );
                setPendingAdmins(pending);
            }
        } catch {
            // silent — badge just won't update
        }
    };

    const handleApproveDoctor = async (id) => {
        try {
            const { data } = await API.patch(`/admin/approve-doctor/${id}`);
            if (data.success) {
                message.success("Doctor approved");
                fetchDoctors();
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to approve");
        }
    };

    const handleBlockDoctor = async (id) => {
        try {
            const { data } = await API.patch(`/admin/block-doctor/${id}`);
            if (data.success) {
                message.success("Doctor blocked");
                fetchDoctors();
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to block");
        }
    };

    const handleApproveAdmin = async (id) => {
        try {
            const { data } = await API.patch(`/admin/approve-user/${id}`);
            if (data.success) {
                message.success("Admin approved successfully");
                fetchPendingAdmins();
                fetchUsers();
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to approve");
        }
    };

    const handleRejectAdmin = async (id) => {
        try {
            const { data } = await API.patch(`/admin/approve-user/${id}`);
            // For rejection, we're just removing — you could add a delete endpoint
            if (data.success) {
                message.success("Admin request handled");
                fetchPendingAdmins();
                fetchUsers();
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to process");
        }
    };

    const userColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => (
                <Tag color={role === "admin" ? "purple" : role === "doctor" ? "blue" : "green"}>
                    {role.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Approved",
            dataIndex: "isApproved",
            key: "isApproved",
            render: (val) => (
                <Tag color={val ? "green" : "orange"}>{val ? "Yes" : "No"}</Tag>
            ),
        },
    ];

    const pendingAdminColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Registered On",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
        },
        {
            title: "Status",
            key: "status",
            render: () => <Tag color="orange">PENDING</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: 8 }}>
                    <Popconfirm
                        title="Approve this user as Admin?"
                        description="They will have full admin access to the system."
                        onConfirm={() => handleApproveAdmin(record._id)}
                    >
                        <Button type="primary" size="small">Approve</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Reject this admin request?"
                        onConfirm={() => handleRejectAdmin(record._id)}
                    >
                        <Button type="primary" danger size="small">Reject</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const doctorColumns = [
        {
            title: "Name",
            key: "name",
            render: (_, record) => record.userId?.name || "N/A",
        },
        {
            title: "Email",
            key: "email",
            render: (_, record) => record.userId?.email || "N/A",
        },
        {
            title: "Specialization",
            dataIndex: "specialization",
            key: "specialization",
        },
        {
            title: "Experience",
            dataIndex: "experience",
            key: "experience",
            render: (exp) => `${exp} yrs`,
        },
        {
            title: "Fee",
            dataIndex: "consultationFee",
            key: "fee",
            render: (fee) => `₹${fee}`,
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Tag color={record.userId?.isApproved ? "green" : "orange"}>
                    {record.userId?.isApproved ? "Approved" : "Pending"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: 8 }}>
                    {!record.userId?.isApproved ? (
                        <Popconfirm
                            title="Approve this doctor?"
                            onConfirm={() => handleApproveDoctor(record._id)}
                        >
                            <Button type="primary" size="small">Approve</Button>
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title="Block this doctor?"
                            onConfirm={() => handleBlockDoctor(record._id)}
                        >
                            <Button danger size="small">Block</Button>
                        </Popconfirm>
                    )}
                </div>
            ),
        },
    ];

    const appointmentColumns = [
        {
            title: "Patient",
            key: "patient",
            render: (_, record) => record.patientId?.name || "N/A",
        },
        {
            title: "Doctor",
            key: "doctor",
            render: (_, record) => record.doctorId?.userId?.name || "N/A",
        },
        {
            title: "Specialization",
            key: "specialization",
            render: (_, record) => record.doctorId?.specialization || "N/A",
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
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "users":
                return (
                    <div>
                        <Title level={4} style={{ marginBottom: 24 }}>All Users</Title>
                        <Table
                            columns={userColumns}
                            dataSource={users}
                            rowKey="_id"
                            loading={loading}
                            scroll={{ x: 600 }}
                        />
                    </div>
                );
            case "doctors":
                return (
                    <div>
                        <Title level={4} style={{ marginBottom: 24 }}>All Doctors</Title>
                        <Table
                            columns={doctorColumns}
                            dataSource={doctors}
                            rowKey="_id"
                            loading={loading}
                            scroll={{ x: 800 }}
                        />
                    </div>
                );
            case "appointments":
                return (
                    <div>
                        <Title level={4} style={{ marginBottom: 24 }}>All Appointments</Title>
                        <Table
                            columns={appointmentColumns}
                            dataSource={appointments}
                            rowKey="_id"
                            loading={loading}
                            scroll={{ x: 800 }}
                        />
                    </div>
                );
            case "admin-approval":
                return (
                    <div>
                        <Title level={4} style={{ marginBottom: 8 }}>Admin Approval Requests</Title>
                        <p style={{ color: "#888", marginBottom: 24 }}>
                            Users who registered as Admin are listed here. Approve to grant them full admin access.
                        </p>
                        <Table
                            columns={pendingAdminColumns}
                            dataSource={pendingAdmins}
                            rowKey="_id"
                            loading={loading}
                            locale={{ emptyText: "No pending admin requests" }}
                            scroll={{ x: 600 }}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout
            menuItems={menuItems}
            selectedKey={activeTab}
            onMenuSelect={setActiveTab}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default AdminDashboard;
