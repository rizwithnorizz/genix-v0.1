import PrimaryButton from "@/Components/PrimaryButton";
import Layout from "@/Components/ui/layout";
import {
    Upload,
    Edit,
    Trash2,
    UserPlus,
    Search,
    X,
    Check,
    Plus,
    Save,
    DoorClosed,
    DoorOpen,
    Eye,
    EyeOff,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Department {
    id: number;
    department_full_name: string;
    department_short_name: string;
}

interface Room {
    id: number;
    room_number: string;
    room_type: string;
}

interface DepartmentAdmin {
    name: string;
    email: string;
    department_short_name: string;
    password: string;
}

const DepartmentPage: React.FC = () => {
    // State management
    const [departments, setDepartments] = useState<Department[]>([]);
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [csrfToken, setCsrfToken] = useState<string>("");

    // Modal states
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [selectedDepartment, setSelectedDepartment] =
        useState<Department | null>(null);

    const [depAdmins, setDepAdmins] = useState<DepartmentAdmin[]>([]);

    const fetchDepartmentAdmins = async (department: string) => {
        try {
            const response = await axios.get(
                `/admin/departments/${department}/admins`
            );
            setDepAdmins(response.data.data);
        } catch (error) {
            console.error("Error fetching department admins:", error);
        }
    };

    const handleRemoveAdmin = async (email: string, department: string) => {
        if (window.confirm("Are you sure you want to remove this admin?")) {
            try {
                await axios.delete(`/admin/departments/admins/${email}`);
                fetchDepartmentAdmins(department);
            } catch (error) {
                console.error("Error removing admin:", error);
            }
        }
    };

    // Form states
    const [form, setFormData] = useState({
        department_full_name: "",
        department_short_name: "",
        admin_name: "",
        admin_email: "",
        password: "",
    });
    const [editFormData, setEditFormData] = useState({
        department_full_name: "",
        department_short_name: "",
        admin_name: "",
        admin_email: "",
        password: "",
    });

    // Get CSRF token on component mount
    useEffect(() => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        if (token) {
            setCsrfToken(token);
            axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [deptResponse, roomsResponse] = await Promise.all([
                axios.get("/admin/get-departments"),
                axios.get("/api/get-rooms"),
            ]);
            setDepartments(deptResponse.data.data);
            setRoomList(roomsResponse.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log("Editting fordata", name, value);
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoomToggle = (roomId: number) => {
        setSelectedRooms((prev) =>
            prev.includes(roomId)
                ? prev.filter((id) => id !== roomId)
                : [...prev, roomId]
        );
        console.log("selectedRooms", roomId);
    };

    const handleCreateDepartment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedRoomNumbers = roomList
                .filter((room) => selectedRooms.includes(room.id))
                .map((room) => room.room_number);

            const formData = new FormData();
            formData.append("department_full_name", form.department_full_name);
            formData.append(
                "department_short_name",
                form.department_short_name
            );
            console.log("department short name", form.department_short_name);
            formData.append("admin_name", form.admin_name);
            formData.append("admin_email", form.admin_email);
            formData.append("password", form.password);
            selectedRoomNumbers.forEach((roomNumber) => {
                formData.append("selectedRooms[]", roomNumber);
            });

            await axios.post("/admin/create-department", formData);
            fetchData();
            setShowCreateModal(false);
            resetForm();
        } catch (error) {
            console.error("Error creating department:", error);
            alert(`Department already exists. Please try again. ${error}`);
        }
    };

    const handleUpdateDepartment = async () => {
        if (!selectedDepartment) return;
        try {
            const response = await axios.put(
                `/admin/departments/update/${selectedDepartment.department_short_name}`,
                editFormData
            );
            fetchData();
            console.log(response.data.generated_password);
        } catch (error) {
            console.error("Error updating department:", error);
        }
    };

    const handleDeleteDepartment = async (department: Department) => {
        if (
            window.confirm(
                `Are you sure you want to delete ${department.department_full_name}?`
            )
        ) {
            try {
                await axios.delete(
                    `/admin/departments/delete/${department.department_short_name}`
                );
                fetchData();
            } catch (error) {
                console.error("Error deleting department:", error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            department_full_name: "",
            department_short_name: "",
            admin_name: "",
            admin_email: "",
            password: "",

        });
        setSelectedRooms([]);
    };

    const openEditModal = (department: Department) => {
        fetchDepartmentAdmins(department.department_short_name);
        setSelectedDepartment(department);
        setEditFormData({
            department_full_name: department.department_full_name,
            department_short_name: department.department_short_name,
            admin_name: "",
            admin_email: "",
            password: "",
        });
        setShowEditModal(true);
    };

    const filteredRooms = roomList.filter(
        (room) =>
            room.room_number
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            room.room_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [adminListQueue, setAdminListQueue] = useState<DepartmentAdmin[]>([]);

    const handleAddAdminList = () => {
        setAdminListQueue((prev) => [
            ...prev,
            {
                name: editFormData?.admin_name || "",
                email: editFormData?.admin_email || "",
                password: editFormData?.password || "",
                department_short_name:
                    selectedDepartment?.department_short_name || "",
            },
        ]);

        console.log(editFormData?.password);
        setDepAdmins((prev) => [
            ...prev,
            {
                name: editFormData?.admin_name || "",
                email: editFormData?.admin_email || "",
                password: editFormData?.password || "",
                department_short_name:
                    selectedDepartment?.department_short_name || "",
            },
        ]);
        handleUpdateDepartment();
        console.log(adminListQueue);
    };
    const [roomDepartment, setRoomDepartment] = useState<Room[]>([]);
    const fetchRoomDepartment = async (department: string) => {
        try {
            const response = await axios.get(
                `/admin/departments/${department}/rooms`
            );
            setRoomDepartment(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.error("Error fetching room department:", error);
        }
    };
    const deleteRoomDepartment = async (room_number: string, department: string) => {
        try {
            await axios.delete(
                `/admin/departments/${department}/rooms/${room_number}`
            );
            fetchRoomDepartment(department);
        } catch (error) {
            console.error("Error deleting room department:", error);
        }
    }
    const [roomModal, setRoomModal] = useState<boolean>(false);
    const openRoomModal = (department: Department) => {
        setSelectedDepartment(department);
        fetchRoomDepartment(department.department_short_name);
        setRoomModal(true);
        console.log("department room", department);
    };

    const [assignRoomModal, setAssignRoomModal] = useState<boolean>(false);
    const [toBeAssignedRooms, setToBeAssignedRooms] = useState<Room[]>([]);
    const handleAssignRoom = () => {
        const unassignedRooms = roomList.filter(
            (room) =>
                !roomDepartment.some(
                    (assignedRoom) => assignedRoom.id === room.id
                )
        );
        setToBeAssignedRooms(unassignedRooms);
    }
    const [showPassword, setShowPassword] = useState<{
        idx: number,
        show: boolean,
    }>({
        idx: -1,
        show: false,
    });
    const handleAssignRoomSubmit = async () => {
    }

    return (
        <Layout>
            <main className="col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-2xl">
                        Department Management
                    </h1>
                    <PrimaryButton
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Create Department
                    </PrimaryButton>
                </div>

                {/* Departments List */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="font-semibold text-lg mb-4">Departments</h2>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : departments.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No departments found. Create your first department.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Short Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Full Name
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {departments.map((department, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full text-blue-800 flex items-center justify-center font-medium">
                                                        {
                                                            department.department_short_name
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {
                                                    department.department_full_name
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        onClick={() =>
                                                            openRoomModal(
                                                                department
                                                            )
                                                        }
                                                        title="Room Assignment"
                                                    >
                                                        <DoorOpen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(
                                                                department
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteDepartment(
                                                                department
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Create Department Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Create New Department
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            resetForm();
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateDepartment}>
                                    <input
                                        type="hidden"
                                        name="_token"
                                        value={csrfToken}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Department Name
                                            </label>
                                            <input
                                                type="text"
                                                name="department_full_name"
                                                value={
                                                    form.department_full_name
                                                }
                                                onChange={handleInputChange}
                                                placeholder="e.g. College of..."
                                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Short Name
                                            </label>
                                            <input
                                                type="text"
                                                name="department_short_name"
                                                value={
                                                    form.department_short_name
                                                }
                                                onChange={handleInputChange}
                                                placeholder="e.g. CENG"
                                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex justify-between gap-5">
                                            <div className="w-full">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Admin Name
                                                </label>
                                                <input
                                                    type="name"
                                                    name="admin_name"
                                                    value={form.admin_name}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. Juan Dela Cruz"
                                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="w-full">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={form.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Input Password"
                                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Admin Email
                                            </label>
                                            <input
                                                type="email"
                                                name="admin_email"
                                                value={form.admin_email}
                                                onChange={handleInputChange}
                                                placeholder="e.g. admin@example.com"
                                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="font-semibold text-lg mb-3">
                                            Room Assignment
                                        </h3>
                                        <div className="relative mb-4">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search rooms..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10 w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="grid grid-cols-12 bg-gray-100 p-3 font-medium">
                                                <div className="col-span-1"></div>
                                                <div className="col-span-4">
                                                    Room Number
                                                </div>
                                                <div className="col-span-4">
                                                    Type
                                                </div>
                                                <div className="col-span-3">
                                                    Status
                                                </div>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto">
                                                {filteredRooms.length > 0 ? (
                                                    filteredRooms.map(
                                                        (room) => (
                                                            <div
                                                                key={room.id}
                                                                className="grid grid-cols-12 items-center p-3 border-b hover:bg-gray-50"
                                                            >
                                                                <div className="col-span-1">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedRooms.includes(
                                                                            room.id
                                                                        )}
                                                                        onChange={() =>
                                                                            handleRoomToggle(
                                                                                room.id
                                                                            )
                                                                        }
                                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                    />
                                                                </div>
                                                                <div className="col-span-4">
                                                                    {
                                                                        room.room_number
                                                                    }
                                                                </div>
                                                                <div className="col-span-4">
                                                                    <span
                                                                        className={`px-2 py-1 text-xs rounded-full ${room.room_type ===
                                                                            "Laboratory"
                                                                            ? "bg-purple-100 text-purple-800"
                                                                            : "bg-blue-100 text-blue-800"
                                                                            }`}
                                                                    >
                                                                        {
                                                                            room.room_type
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="col-span-3">
                                                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                                        Available
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500">
                                                        No rooms found matching
                                                        your search.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCreateModal(false);

                                                resetForm();
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Create Department
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {roomModal && roomDepartment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Room Assignment
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setRoomModal(false);
                                            resetForm();
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="mb-6">
                                    <button
                                        onClick={() => {
                                            setAssignRoomModal(true);
                                            handleAssignRoom();
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700">
                                        Assign Room/s
                                    </button>
                                </div>
                                <div className="overflow-x-auto overflow-y-auto max-h-96">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Room Number
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Room Type
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {roomDepartment.map((room) => (
                                                <tr
                                                    key={room.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {room.room_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {room.room_type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() =>
                                                                deleteRoomDepartment(
                                                                    room.room_number,
                                                                    selectedDepartment?.department_short_name ||
                                                                    ""
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 p-1"
                                                            title="Remove"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {assignRoomModal && selectedDepartment && roomList && toBeAssignedRooms && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Assign Rooms</h2>
                                    <button
                                        onClick={() => setAssignRoomModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Select
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Room Number
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Room Type
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {toBeAssignedRooms.map((room) => (
                                                <tr key={room.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRooms.includes(
                                                                room.id
                                                            )}
                                                            onChange={() =>
                                                                handleRoomToggle(room.id)
                                                            }
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {room.room_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {room.room_type}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={async () => {
                                            try {
                                                const selectedRoomNumbers = roomList
                                                    .filter((room) =>
                                                        selectedRooms.includes(room.id)
                                                    )
                                                    .map((room) => room.room_number);

                                                await axios.post(
                                                    `/admin/departments/${selectedDepartment?.department_short_name}/assign-rooms`,
                                                    { rooms: selectedRoomNumbers }
                                                );

                                                fetchRoomDepartment(
                                                    selectedDepartment?.department_short_name ||
                                                    ""
                                                );
                                                setAssignRoomModal(false);
                                                setSelectedRooms([]);
                                            } catch (error) {
                                                console.error(
                                                    "Error assigning rooms:",
                                                    error
                                                );
                                            }
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700"
                                    >
                                        Add Selected Rooms
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Edit Department Modal */}
                {showEditModal && selectedDepartment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 ">
                        <div className="bg-white rounded-lg shadow-xl w-svw max-w-2xl h-fit">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Edit Department
                                    </h2>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <div className="block text-sm font-medium text-gray-700 mb-1">
                                            Department Name
                                        </div>
                                        <input
                                            type="text"
                                            name="department_full_name"
                                            value={
                                                editFormData.department_full_name
                                            }
                                            onChange={handleEditInputChange}
                                            className="w-full p-3"
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="block text-sm font-medium text-gray-700 mb-1">
                                            Short Name
                                        </h2>
                                        <input
                                            type="text"
                                            name="department_short_name"
                                            value={
                                                editFormData.department_short_name
                                            }
                                            onChange={handleEditInputChange}
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={true}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Admin Name
                                        </label>
                                        <input
                                            type="name"
                                            name="admin_name"
                                            value={editFormData.admin_name}
                                            onChange={handleEditInputChange}
                                            placeholder="e.g. admin@example.com"
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Admin Email
                                        </label>
                                        <input
                                            type="email"
                                            name="admin_email"
                                            value={editFormData.admin_email}
                                            onChange={handleEditInputChange}
                                            placeholder="e.g. admin@example.com"
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Admin's Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={editFormData.password}
                                            onChange={handleEditInputChange}
                                            placeholder="Input Password"
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <PrimaryButton
                                        onClick={handleAddAdminList}
                                        className="bg-green-700 hover:bg-green-600 w-2/5 flex items-center justify-center h-10"
                                    >
                                        Add Admin
                                    </PrimaryButton>

                                    <h2 className="col-span-2 text-lg font-semibold mt-4">
                                        <span className="font-semibold text-lg mb-3">
                                            Department Admins
                                        </span>
                                    </h2>
                                    <div className="md:col-span-2 shadow-xl p-4 rounded-xl h-[35vh] overflow-y-auto col-span-1">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Password
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {depAdmins.map((admin, id) => (
                                                    <tr key={id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {admin.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {admin.email}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {showPassword.show && showPassword.idx == id ? (
                                                                <div className="w-full grid grid-cols-2">
                                                                    
                                                                    <Eye onClick={() => setShowPassword({ ...showPassword, idx: -1, show: false })} className="cursor-pointer" />
                                                                    <input
                                                                        type="text"
                                                                        name="show"
                                                                        value={
                                                                            admin.password
                                                                        }
                                                                        readOnly
                                                                        className="bg-gray-100 border border-gray-300 rounded-lg w-20 h-[2rem] text-gray-900"   
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="text-gray-400 grid grid-cols-2">
                                                                    <EyeOff onClick={() => setShowPassword({ ...showPassword, idx: id, show: true })} className="cursor-pointer" />
                                                                    ********
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveAdmin(
                                                                        admin.email,
                                                                        admin.department_short_name
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900 p-1"
                                                                title="Remove"
                                                            >
                                                                <Trash2
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </Layout>
    );
};

export default DepartmentPage;
