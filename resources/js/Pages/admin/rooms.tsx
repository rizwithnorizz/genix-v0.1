import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/Components/ui/layout";
import axios from "axios";
import { MoreVertical, Edit, Trash2, Plus, Upload, Search } from "lucide-react";

interface Room {
    id: number;
    room_number: string;
    room_type: string;
}

const RoomPage: React.FC = () => {
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showMenuIndex, setShowMenuIndex] = useState<number | null>(null);
    const [roomType, setRoomType] = useState<string>("Lecture");
    const [roomName, setRoomName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch rooms
    const handleGetRooms = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/get-rooms");
            setRoomList(response.data.data);
            setFilteredRooms(response.data.data); // Initialize filtered rooms
        } catch (error) {
            console.error("Error fetching rooms:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter rooms based on search term
    useEffect(() => {
        const filtered = roomList.filter(
            (room) =>
                room.room_number
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                room.room_type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRooms(filtered);
    }, [searchTerm, roomList]);

    const handleEdit = (room: Room) => {
        console.log("Edit:", room);
        setShowMenuIndex(null);
    };

    const handleDelete = async (room: Room) => {
        try {
            await axios.delete(`/api/rooms/${room.id}`);
            handleGetRooms(); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting room:", error);
        }
        setShowMenuIndex(null);
    };

    const toggleMenu = (index: number) => {
        setShowMenuIndex((prev) => (prev === index ? null : index));
    };

    const handleCreateRoom = async () => {
        if (!roomName.trim()) return;

        try {
            await axios.post("/api/create-room", {
                room_number: roomName,
                room_type: roomType,
            });
            setRoomName("");
            handleGetRooms();
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    useEffect(() => {
        handleGetRooms();
    }, []);

    return (
        <Layout>
            <main className="col-span-3 space-y-6">
                <h1 className="font-bold text-2xl">Room Management</h1>

                {/* Room Creation Form */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="font-semibold text-lg mb-4">Add New Room</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Number
                            </label>
                            <input
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                type="text"
                                placeholder="e.g. 101, LAB-1"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Type
                            </label>
                            <select
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Lecture">Lecture</option>
                                <option value="Laboratory">Laboratory</option>
                                <option value="Conference">Conference</option>
                                <option value="Office">Office</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleCreateRoom}
                                disabled={!roomName.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:bg-blue-400"
                            >
                                <Plus size={18} />
                                Add Room
                            </button>
                        </div>
                    </div>
                </div>

                {/* Room List Table */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <h2 className="font-semibold text-lg">
                            Room Directory
                        </h2>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            {/* Search Input */}
                            <div className="relative w-full md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search rooms..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg transition-colors w-full md:w-auto">
                                <Upload size={18} />
                                Import Rooms
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            {searchTerm
                                ? `No rooms found matching "${searchTerm}"`
                                : "No rooms found. Add your first room above."}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Room Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRooms.map((room, idx) => (
                                        <tr
                                            key={room.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-blue-200">
                                                        {room.room_number.charAt(
                                                            0
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {room.room_number}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-sm font-medium">
                                                    {room.room_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                                <button
                                                    onClick={() =>
                                                        toggleMenu(idx)
                                                    }
                                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                >
                                                    <MoreVertical size={20} />
                                                </button>
                                                {showMenuIndex === idx && (
                                                    <div className="origin-top-right absolute right-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        room
                                                                    )
                                                                }
                                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                            >
                                                                <Edit
                                                                    size={16}
                                                                    className="mr-2"
                                                                />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        room
                                                                    )
                                                                }
                                                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                    className="mr-2"
                                                                />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </Layout>
    );
};

export default RoomPage;
