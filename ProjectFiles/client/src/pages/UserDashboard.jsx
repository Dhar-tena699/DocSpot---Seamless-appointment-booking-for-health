import { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Table,
    Tag,
    Button,
    Modal,
    DatePicker,
    Select,
    message,
    Spin,
    Empty,
    Typography,
} from "antd";
import {
    DashboardOutlined,
    CalendarOutlined,
    MedicineBoxOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";
import API from "../utils/axiosConfig";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const STATUS_COLORS = {
    pending: "orange",
    approved: "green",
    rejected: "red",
    completed: "blue",
};

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState("doctors");
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingModal, setBookingModal] = useState({ open: false, doctor: null });
    const [bookingDate, setBookingDate] = useState(null);
    const [bookingTimeSlot, setBookingTimeSlot] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    const menuItems = [
        { key: "doctors", icon: <MedicineBoxOutlined />, label: "Find Doctors" },
        { key: "appointments", icon: <CalendarOutlined />, label: "My Appointments" },
    ];

    useEffect(() => {
        if (activeTab === "doctors") fetchDoctors();
        else fetchAppointments();
    }, [activeTab]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const { data } = await API.get("/doctor/get-all-available");
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
            const { data } = await API.get("/appointments/my-appointments");
            if (data.success) setAppointments(data.data.appointments);
        } catch {
            message.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async () => {
        if (!bookingDate || !bookingTimeSlot) {
            message.warning("Please select date and time slot");
            return;
        }
        setBookingLoading(true);
        try {
            const { data } = await API.post("/appointments/book-appointment", {
                doctorId: bookingModal.doctor._id,
                appointmentDate: bookingDate.toISOString(),
                timeSlot: bookingTimeSlot,
                consultationFee: bookingModal.doctor.consultationFee,
            });
            if (data.success) {
                message.success("Appointment booked successfully!");
                setBookingModal({ open: false, doctor: null });
                setBookingDate(null);
                setBookingTimeSlot(null);
                setActiveTab("appointments");
                fetchAppointments();
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to book appointment");
        } finally {
            setBookingLoading(false);
        }
    };

    const handleCancelAppointment = async (id) => {
        try {
            const { data } = await API.patch(`/appointments/cancel/${id}`);
            if (data.success) {
                message.success("Appointment cancelled");
                fetchAppointments();
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to cancel");
        }
    };

    const appointmentColumns = [
        {
            title: "Doctor",
            key: "doctor",
            render: (_, record) =>
                record.doctorId?.userId?.name || "N/A",
        },
        {
            title: "Specialization",
            key: "specialization",
            render: (_, record) =>
                record.doctorId?.specialization || "N/A",
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
            title: "Fee",
            dataIndex: "consultationFee",
            key: "fee",
            render: (fee) => (fee ? `₹${fee}` : "N/A"),
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
            title: "Action",
            key: "action",
            render: (_, record) =>
                record.status === "pending" ? (
                    <Button
                        size="small"
                        danger
                        onClick={() => handleCancelAppointment(record._id)}
                    >
                        Cancel
                    </Button>
                ) : null,
        },
    ];

    const renderDoctors = () => (
        <div>
            <Title level={4} style={{ marginBottom: 24 }}>Available Doctors</Title>
            {loading ? (
                <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div>
            ) : doctors.length === 0 ? (
                <Empty description="No doctors available right now" />
            ) : (
                <Row gutter={[16, 16]}>
                    {doctors.map((doc) => (
                        <Col xs={24} sm={12} lg={8} key={doc._id}>
                            <Card
                                hoverable
                                style={{ borderRadius: 12 }}
                                actions={[
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={() => setBookingModal({ open: true, doctor: doc })}
                                    >
                                        Book Now
                                    </Button>,
                                ]}
                            >
                                <Card.Meta
                                    title={doc.userId?.name || "Doctor"}
                                    description={doc.specialization}
                                />
                                <div style={{ marginTop: 16 }}>
                                    <Text type="secondary">Experience: </Text>
                                    <Text strong>{doc.experience} years</Text>
                                    <br />
                                    <Text type="secondary">Fee: </Text>
                                    <Text strong>₹{doc.consultationFee}</Text>
                                    <br />
                                    {doc.availableDays?.length > 0 && (
                                        <>
                                            <Text type="secondary">Days: </Text>
                                            <Text>{doc.availableDays.join(", ")}</Text>
                                        </>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );

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
            {activeTab === "doctors" ? renderDoctors() : renderAppointments()}

            <Modal
                title={`Book Appointment with ${bookingModal.doctor?.userId?.name || "Doctor"}`}
                open={bookingModal.open}
                onCancel={() => {
                    setBookingModal({ open: false, doctor: null });
                    setBookingDate(null);
                    setBookingTimeSlot(null);
                }}
                onOk={handleBookAppointment}
                confirmLoading={bookingLoading}
                okText="Confirm Booking"
            >
                <div style={{ marginBottom: 16 }}>
                    <Text strong>Specialization: </Text>
                    <Text>{bookingModal.doctor?.specialization}</Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <Text strong>Fee: </Text>
                    <Text>₹{bookingModal.doctor?.consultationFee}</Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ display: "block", marginBottom: 8 }}>Select Date:</Text>
                    <DatePicker
                        style={{ width: "100%" }}
                        disabledDate={(current) => current && current < dayjs().startOf("day")}
                        onChange={setBookingDate}
                        value={bookingDate}
                    />
                </div>
                <div>
                    <Text strong style={{ display: "block", marginBottom: 8 }}>Select Time Slot:</Text>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Choose a time slot"
                        onChange={setBookingTimeSlot}
                        value={bookingTimeSlot}
                    >
                        {(bookingModal.doctor?.availableTimeSlots?.length > 0
                            ? bookingModal.doctor.availableTimeSlots
                            : ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
                        ).map((slot) => (
                            <Option key={slot} value={slot}>
                                {slot}
                            </Option>
                        ))}
                    </Select>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default UserDashboard;
