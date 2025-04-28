import Layout from "@/Components/ui/layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookAIcon, CheckCheckIcon, EyeIcon, XIcon } from "lucide-react";

interface Schedule {
    id: number;
    repo_name: string;
    departmentID: number;
    department_short_name: string;
    semester: string;
    schedules: GeneratedSchedule[];
    status: boolean;
}

interface GeneratedSchedule {
    id: number;
    day_slot: number;
    instructor_id: number;
    instructor_name: string;
    subject_code: string;
    room_number: string;
    section_name: string;
    time_start: number;
    time_end: number;
}

const SchedulePage: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");

    const fetchSchedules = async () => {
        try {
            const response = await axios.get("/admin/schedules/list");
            setSchedules(response.data.data);
            console.log("Fetched schedules:", response.data.data);
        } catch (error) {
            console.error("Error fetching schedules:", error);
        } finally {
            setLoading(false);
        }
    };

    const [archiveModal, setArchieveModal] = useState<boolean>(false);
    const [archives, setArchives] = useState<Schedule[]>([]);
    const fetchArchiveSchedules = async () => {
        try {
            const response = await axios.get("/api/schedules/archives");
            setArchives(response.data.data);
            console.log("Fetched archives:", response.data.data);
        } catch (error) {
            console.error("Error fetching archives:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleClickArchives = () => {
        setArchieveModal((prev) => !prev);
    };

    useEffect(() => {
        fetchSchedules();
        fetchArchiveSchedules();
    }, []);
    const [viewGeneratedSchedule, setViewGeneratedSchedule] =
        useState<Schedule | null>(null);
    const [viewModal, setViewModal] = useState<boolean>(false);
    const handleClickView = (schedule: Schedule) => {
        if (viewModal) {
            setViewModal(false);
            setViewGeneratedSchedule(null);
        } else {
            setViewGeneratedSchedule(schedule);
            setViewModal(true);
        }
    };
    const DAY_MAPPING: { [key: number]: string } = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday",
    };

    const [selectedSection, setSelectedSection] = useState<string>("");
    const [selectedInstructor, setSelectedInstructor] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [selectedRoom, setSelectedRoom] = useState<string>("");

    const filteredRepo = schedules.filter(
        (schedule) =>
            !selectedDepartment ||
            selectedDepartment === schedule.department_short_name
    );
    const filteredSchedules = viewGeneratedSchedule?.schedules.filter(
        (schedule) =>
            (!selectedSection || schedule.section_name === selectedSection) &&
            (!selectedInstructor ||
                schedule.instructor_name === selectedInstructor) &&
            (!selectedDay || DAY_MAPPING[schedule.day_slot] === selectedDay) &&
            (!selectedRoom || schedule.room_number === selectedRoom)
    );

    const filteredArchives = archives.filter(
        (schedule) =>
            !selectedDepartment ||
            schedule.department_short_name === selectedDepartment
    );

    const handlePublish = async (scheduleId: number) => {
        const confirmReject = window.confirm(
            "Are you sure you want to reject this schedule?"
        );
        if (!confirmReject) {
            return;
        }
        try {
            await axios.post(`/api/schedules/publish/${scheduleId}`);
            fetchSchedules(); // Refresh the schedule list after publishing
        } catch (error) {
            console.error("Error publishing schedule:", error);
        }
    };

    const handleReject = async (scheduleId: number) => {
        const confirmReject = window.confirm(
            "Are you sure you want to reject this schedule?"
        );
        if (!confirmReject) {
            return;
        }
        try {
            await axios.delete(`/api/schedules/reject/${scheduleId}`);
            fetchSchedules(); // Refresh the schedule list after rejecting
        } catch (error) {
            console.error("Error rejecting schedule:", error);
        }
    };

    return (
        <Layout>
            <main className="col-span-3 space-y-4">
                <h1 className="font-bold text-2xl mb-4">Schedule Approvals</h1>

                <div className="mb-4 grid grid-cols-2 w-[35rem] flex items-center">
                    <select
                        id="departmentFilter"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="mt-1 block w-[15rem] border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">All Departments</option>
                        {[
                            ...new Set(
                                schedules.map((s) => s.department_short_name)
                            ),
                        ].map((department, idx) => (
                            <option key={idx} value={department}>
                                {department}
                            </option>
                        ))}
                    </select>
                    <button
                        className="w-[10rem] h-[2.5rem] bg-white hover:bg-blue-500 text-gray-600 hover:text-white font-bold rounded shadow"
                        onClick={handleClickArchives}
                    >
                        <BookAIcon className="w-6 h-6 mr-1 inline" />
                        Archives
                    </button>
                </div>
                {/* Filtered Schedules Table */}

                {loading && (
                    <div>
                        <h2 className="text-center py-4">Loading...</h2>
                    </div>
                )}
                {!loading && filteredRepo.length === 0 ? (
                    <div>
                        <h2 className="text-center py-4">
                            No schedules available.
                        </h2>
                    </div>
                ) : (
                    <div className="w-fit overflow-x-auto truncate rounded-2xl shadow-lgs">
                        <table className="w-2/3 table-auto border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Class Schedule Name
                                    </th>
                                    <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRepo?.map((schedule) => (
                                    <tr
                                        key={schedule.id}
                                        className="hover:bg-gray-100"
                                    >
                                        <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {schedule.department_short_name}
                                        </td>
                                        <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {schedule.repo_name}
                                        </td>
                                        <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                onClick={() =>
                                                    handleClickView(schedule)
                                                }
                                            >
                                                <EyeIcon className="w-6 h-6 mr-1 inline" />
                                                View
                                            </button>
                                            <button
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                                                onClick={() =>
                                                    handlePublish(schedule.id)
                                                }
                                            >
                                                <CheckCheckIcon className="w-6 h-6 mr-1 inline" />
                                                Publish
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                                                onClick={() =>
                                                    handleReject(schedule.id)
                                                }
                                            >
                                                <XIcon className="w-6 h-6 mr-1 inline" />
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {archiveModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                        <div className="bg-white w-[55rem] h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <select
                                    id="departmentFilter"
                                    value={selectedDepartment}
                                    onChange={(e) =>
                                        setSelectedDepartment(e.target.value)
                                    }
                                    className="mt-1 block w-[15rem] border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">All Departments</option>
                                    {[
                                        ...new Set(
                                            archives.map(
                                                (s) => s.department_short_name
                                            )
                                        ),
                                    ].map((department, idx) => (
                                        <option key={idx} value={department}>
                                            {department}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={handleClickArchives}>
                                    <XIcon className="w-6 h-6 mr-1 inline" />
                                </button>
                            </div>
                            <table className="w-2/3 table-auto max-h-[60vh] border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Class Schedule Name
                                        </th>
                                        <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredArchives.map((schedule) => (
                                        <tr
                                            key={schedule.id}
                                            className="hover:bg-gray-100"
                                        >
                                            <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {schedule.department_short_name}
                                            </td>
                                            <td className="text-center text-nowrap truncate px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {schedule.repo_name}
                                            </td>
                                            <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {schedule.status
                                                    ? "Approved"
                                                    : "Rejected"}
                                            </td>
                                            <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() =>
                                                        handleClickView(
                                                            schedule
                                                        )
                                                    }
                                                >
                                                    <EyeIcon className="w-6 h-6 mr-1 inline" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {loading && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-center py-4"
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    )}
                                    {!loading &&
                                        filteredArchives.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="text-center py-4"
                                                >
                                                    No schedules available.
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {viewModal &&
                    ((viewGeneratedSchedule?.schedules ?? []).length > 0 ? (
                        <div className="flex items-center justify-center fixed inset-0 z-50 bg-gray-800 bg-opacity-50">
                            <div className="bg-white h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
                                <div className="w-full flex justify-between items-center">
                                    <h2 className="text-2xl font-bold mb-4">
                                        Generated Schedule
                                    </h2>
                                    <button className="flex justify-center">
                                        <XIcon
                                            className="w-6 h-6 mr-1 inline"
                                            onClick={() => setViewModal(false)}
                                        />
                                    </button>
                                </div>
                                <h2 className="inline">
                                    {viewGeneratedSchedule?.repo_name}
                                </h2>
                                <h2 className="text-2xl font-bold mb-4">
                                    Department:{" "}
                                    {
                                        viewGeneratedSchedule?.department_short_name
                                    }
                                </h2>
                                <div>
                                    <select
                                        className="rounded-xl w-[10rem] mr-2"
                                        value={selectedSection}
                                        onChange={(e) =>
                                            setSelectedSection(e.target.value)
                                        }
                                    >
                                        <option value="">Select Section</option>
                                        {[
                                            ...new Set(
                                                viewGeneratedSchedule?.schedules.map(
                                                    (schedule) =>
                                                        schedule.section_name
                                                )
                                            ),
                                        ].map((section, idx) => (
                                            <option key={idx} value={section}>
                                                {section}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="rounded-xl w-[10rem] mr-2"
                                        value={selectedInstructor}
                                        onChange={(e) =>
                                            setSelectedInstructor(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select Instructor
                                        </option>
                                        {[
                                            ...new Set(
                                                viewGeneratedSchedule?.schedules.map(
                                                    (schedule) =>
                                                        schedule.instructor_name
                                                )
                                            ),
                                        ].map((instructor, idx) => (
                                            <option
                                                key={idx}
                                                value={instructor}
                                            >
                                                {instructor}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="rounded-xl w-[10rem] mr-2"
                                        value={selectedDay}
                                        onChange={(e) =>
                                            setSelectedDay(e.target.value)
                                        }
                                    >
                                        <option value="">Select Day</option>
                                        {Object.values(DAY_MAPPING).map(
                                            (day, idx) => (
                                                <option key={idx} value={day}>
                                                    {day}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    <select
                                        className="rounded-xl w-[10rem] mr-2"
                                        value={selectedRoom}
                                        onChange={(e) =>
                                            setSelectedRoom(e.target.value)
                                        }
                                    >
                                        <option value="">Select Room</option>
                                        {[
                                            ...new Set(
                                                viewGeneratedSchedule?.schedules.map(
                                                    (schedule) =>
                                                        schedule.room_number
                                                )
                                            ),
                                        ].map((room, idx) => (
                                            <option key={idx} value={room}>
                                                {room}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="h-[60vh] overflow-y-auto mr-2 mt-4">
                                    <table className="w-full table-auto border-collapse border border-gray-300">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Section
                                                </th>
                                                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subject
                                                </th>
                                                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Day
                                                </th>
                                                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Time
                                                </th>
                                                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Instructor
                                                </th>
                                                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Room
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSchedules?.map(
                                                (schedule, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="hover:bg-gray-100"
                                                    >
                                                        <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                schedule.section_name
                                                            }
                                                        </td>
                                                        <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                schedule.subject_code
                                                            }
                                                        </td>
                                                        <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                DAY_MAPPING[
                                                                    schedule
                                                                        .day_slot
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                schedule.time_start
                                                            }{" "}
                                                            -{" "}
                                                            {schedule.time_end}
                                                        </td>
                                                        <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                schedule.instructor_name
                                                            }
                                                        </td>
                                                        <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                schedule.room_number
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <button
                                    className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => setViewModal(false)}
                                >
                                    <XIcon className="w-6 h-6 mr-1 inline" />
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-lg font-bold mb-4">
                                    No Generated Schedule Available
                                </h2>
                                <button
                                    className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => setViewModal(false)}
                                >
                                    <XIcon className="w-6 h-6 mr-1 inline" />
                                    Close
                                </button>
                            </div>
                        </div>
                    ))}
            </main>
        </Layout>
    );
};

export default SchedulePage;
