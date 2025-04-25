import Layout from "@/Components/ui/layout";
import { useEffect, useState } from "react";
import {
    Bell,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    SendHorizonal,
    Trash2,
    View,
    type LucideIcon,
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";

interface Instructor {
    id: number;
    name: string;
    initials: string;
}

interface Curriculum {
    id: number;
    department_short_name: string;
    curriculum_name: string;
    program_name: string;
    program_short_name: string;
}

interface News {
    id: number;
    name: string;
    content: string;
}

interface Schedule {
    id: number;
    schedule: JSON;
    repo_name: string;
    department_short_name: string;
    status: boolean;
}

interface GeneratedSchedule {
    day_slot: number;
    instructor_id: number;
    subject_code: string;
    room_number: string;
    section_name: string;
    time_start: number;
    time_end: number;
}
const DepAdminDashboard: React.FC = () => {
    const [curriculum, setCurriculum] = useState<Curriculum[]>([]);

    const fetchCurriculum = async () => {
        try {
            const response = await axios.get("/api/curriculum");
            setCurriculum(response.data.data);
        } catch (error) {
            console.error("Error fetching curriculum:", error);
        }
    };
    const [generateTab, setGenerateTab] = useState<boolean>(false);
    const [semester, setSemester] = useState<"1st" | "2nd">("1st");
    const [schoolYear, setSchoolYear] = useState<string>("");

    const handleGenerateScheduleClick = () => {
        setGenerateTab((prev) => !prev);
        setSemester("1st");
        setSchoolYear("");
        setViewGeneratedSchedule(null);
    };
    const handleSemesterChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSemester(event.target.value as "1st" | "2nd");
    };
    const handleSchoolYearChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSchoolYear(event.target.value);
    };

    const [viewGeneratedSchedule, setViewGeneratedSchedule] = useState<
        GeneratedSchedule[] | null
    >(null);
    const handleGenerateSchedule = async () => {
        try {
            const response = await axios.post("/api/schedules/generate", {
                semester: semester,
                school_year: semester + " Semester: S.Y " + schoolYear,
            });
            fetchGeneratedSchedule();
            console.log("Schedule generated:", response.data);
            setViewGeneratedSchedule(response.data.data);
        } catch (error) {
            console.error("Error generating schedule:", error);
        }
    };
    const [generatedSchedule, setGeneratedSchedule] = useState<
        Schedule[] | null
    >(null);
    const fetchGeneratedSchedule = async () => {
        try {
            const response = await axios.get("/api/schedules/list");
            setGeneratedSchedule(response.data.data);
        } catch (error) {
            console.error("Error fetching generated schedule:", error);
        }
    };

    const [viewFile, setViewFile] = useState<boolean>(false);

    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
        null
    );
    const handleScheduleClick = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setViewFile((prev) => !prev);
    };
    const [news, setNews] = useState<News[]>([
        {
            id: 1,
            name: "Computer Science",
            content: "Newly added department CENG",
        },
        {
            id: 2,
            name: "Information Technology",
            content: "Newly added department CICT",
        },
        {
            id: 3,
            name: "Civil Engineering",
            content: "Newly added department CIT",
        },
        {
            id: 4,
            name: "Electrical Engineering",
            content: "Newly added department CEE",
        },
    ]);

    const [instructors, setInstructors] = useState<Instructor[] | null>(null);

    const fetchInstructors = async () => {
        try {
            const response = await axios.get("/api/instructors");
            const instructorsData = response.data.data;

            const processedInstructors = instructorsData.map(
                (instructor: Instructor) => {
                    const nameParts = instructor.name.split(" "); // Split the name by spaces
                    const initials = nameParts.map((part) => part[0]).join(""); // Take the first letter of each part
                    return {
                        ...instructor,
                        initials: initials.toUpperCase(), // Set the initials in uppercase
                    };
                }
            );
            setInstructors(processedInstructors);
        } catch (error) {
            console.error("Error fetching instructors:", error);
        }
    };
    const [retrievedFeedback, setRetrievedFeedback] = useState<
        {
            id: number;
            feedback: string;
        }[]
    >([]);

    const fetchFeedback = async () => {
        try {
            const response = await axios.get("/api/feedback/accumulate");
            setRetrievedFeedback(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    useState(() => {
        fetchCurriculum();
        fetchGeneratedSchedule();
        fetchInstructors();
        fetchFeedback();
    });

    return (
        <Layout>
            <main>
                <h1 className="font-bold text-2xl mb-4">
                    Department Admin Dashboard
                </h1>

                <div className="grid md:grid-cols-2 grid-cols1 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-lg md:row-start-1 s:h-70">
                        <div className="flex justify-between">
                            <h2 className="font-semibold text-lg mb-2">
                                Generated Schedules
                            </h2>
                            <select className="border border-gray-300 rounded-lg p-2 pr-10">
                                <option value="all">Past day</option>
                                <option value="current">Past week</option>
                                <option value="past">Past month</option>
                                <option value="future">Past year</option>
                            </select>
                        </div>
                        <div className="mt-5 space-y-4 h-[139px] overflow-y-auto">
                            {generatedSchedule?.length != 0 ? (
                                generatedSchedule?.map((schedule, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-800 text-white p-2 rounded-3xl flex shadow relative items-center justify-between"
                                    >
                                        <div className="ps-5 flex items-center justify-center">
                                            <span>{schedule.repo_name}</span>
                                        </div>
                                        <div className="flex gap-2 pr-4">
                                            <button
                                                className="bg-red-500 text-white hover:bg-red-700 rounded-xl p-2"
                                                onClick={async () => {
                                                    try {
                                                        await axios.delete(
                                                            `/api/schedules/${schedule.id}/delete`
                                                        );
                                                        fetchGeneratedSchedule();
                                                    } catch (error) {
                                                        console.error(
                                                            "Error deleting schedule:",
                                                            error
                                                        );
                                                    }
                                                }}
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleScheduleClick(
                                                        schedule
                                                    )
                                                }
                                                className="bg-green-400 text-white hover:bg-blue-300 rounded-xl p-2"
                                            >
                                                <View size={24} />
                                            </button>
                                            <button
                                                className="bg-blue-400 text-white hover:bg-green-300 rounded-xl p-2"
                                                onClick={async () => {
                                                    if (!schedule.status) {
                                                        try {
                                                            await axios.put(
                                                                `/api/schedules/${
                                                                    schedule.id
                                                                }/${1}`
                                                            );
                                                        } catch (error) {
                                                            console.error(
                                                                "Error sending schedule:",
                                                                error
                                                            );
                                                        }
                                                    } else {
                                                        try {
                                                            await axios.put(
                                                                `/api/schedules/${
                                                                    schedule.id
                                                                }/${0}`
                                                            );
                                                        } catch (error) {
                                                            console.error(
                                                                "Error sending schedule:",
                                                                error
                                                            );
                                                        }
                                                    }
                                                    fetchGeneratedSchedule();
                                                }}
                                            >
                                                {schedule.status ? (
                                                    <CheckCheck size={24} />
                                                ) : (
                                                    <SendHorizonal size={24} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">
                                    No schedules available.
                                </div>
                            )}
                        </div>
                        <PrimaryButton
                            onClick={handleGenerateScheduleClick}
                            className="mt-10 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg "
                        >
                            Generate New Class Schedule
                        </PrimaryButton>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg">
                        <div className="flex justify-between">
                            <h2 className="font-semibold text-lg mb-2">
                                Curriculums
                            </h2>
                        </div>
                        <a href="/dep-admin/courseOfferings">
                            <div className="mt-5 space-y-4 h-[139px] overflow-y-auto">
                                {curriculum.length === 0 ? (
                                    <div className="text-center text-gray-500">
                                        No curriculums available.
                                    </div>
                                ) : (
                                    curriculum.map((Curriculum, idx) => (
                                        <button
                                            key={idx}
                                            className="w-full h-[55px] hover:bg-gray-700 bg-gray-800 text-white p-2 rounded-3xl flex shadow relative items-center justify-between"
                                        >
                                            <div className="pl-5 flex items-center">
                                                <span>
                                                    {Curriculum.curriculum_name}
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </a>
                        <a href="/dep-admin/courseOfferings">
                            <PrimaryButton className="mt-10 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg ">
                                View Curriculums
                            </PrimaryButton>
                        </a>
                    </div>
                    <div className="mt-4 bg-white p-4 rounded-2xl shadow-lg col-span-2  ">
                        <h2 className="font-semibold text-lg mb-4">Faculty</h2>
                        <div className="relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                                {instructors?.length === 0 ? (
                                    <div className="text-center text-gray-500 col-span-5 mt-10">
                                        No instructors available.
                                    </div>
                                ) : (
                                    instructors?.map((instructor) => (
                                        <PrimaryButton
                                            key={instructor.id}
                                            className="bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-lg shadow flex flex-col items-center justify-center"
                                        >
                                            <div className="text-6xl font-bold mb-2">
                                                {instructor.initials}
                                            </div>
                                            <div className="text-center">
                                                {instructor.name}
                                            </div>
                                        </PrimaryButton>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between">
                            <a href="/dep-admin/instructors">
                                <PrimaryButton className="mt-10 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg ">
                                    View All
                                </PrimaryButton>
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-lg md:row-start-3 col-start-1 h-[300px] overflow-y-auto">
                        <h2 className="font-semibold text-lg">News</h2>
                        <div className="mt-5 space-y-4 h-[200px] s:h-70 overflow-y-auto">
                            {news.map((news, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-800 text-white p-4 rounded-3xl flex justify-between items-center shadow relative"
                                >
                                    <div className="flex items-center gap-5">
                                        <Bell />
                                        <span>{news.content}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {viewFile && selectedSchedule && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-4">
                                Schedule for {selectedSchedule.repo_name}
                            </h2>

                            {/* Section Filter */}
                            <div className="mb-4">
                                <label
                                    htmlFor="sectionFilter"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Filter by Section
                                </label>
                                <select
                                    id="sectionFilter"
                                    value={selectedSection || ""}
                                    onChange={(e) =>
                                        setSelectedSection(e.target.value)
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">All Sections</option>
                                    {Array.from(
                                        new Set(
                                            JSON.parse(
                                                selectedSchedule.schedule as unknown as string
                                            ).map(
                                                (item: GeneratedSchedule) =>
                                                    item.section_name
                                            )
                                        )
                                    ).map((sectionName, idx) => (
                                        <option
                                            key={idx}
                                            value={sectionName as string}
                                        >
                                            {sectionName as string}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Schedule Table */}
                            <div className="overflow-y-auto max-h-[50vh]">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2 text-left">
                                                Section
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">
                                                Subject Code
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">
                                                Room Number
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">
                                                Day Slot
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">
                                                Start Time
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">
                                                End Time
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">
                                                Instructor Name
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {JSON.parse(
                                            selectedSchedule.schedule as unknown as string
                                        )
                                            .filter(
                                                (item: GeneratedSchedule) =>
                                                    !selectedSection ||
                                                    item.section_name ===
                                                        selectedSection
                                            )
                                            .map(
                                                (
                                                    item: GeneratedSchedule,
                                                    idx: number
                                                ) => (
                                                    <tr
                                                        key={idx}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.section_name}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.subject_code}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.room_number}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.day_slot}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.time_start}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.time_end}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {
                                                                instructors?.find(
                                                                    (
                                                                        instructor
                                                                    ) =>
                                                                        instructor.id ===
                                                                        item.instructor_id
                                                                )?.name
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Close Button */}
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setViewFile(false)}
                                    className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {generateTab &&
                    (viewGeneratedSchedule ? (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[90vh]">
                                <h2 className="text-xl font-semibold mb-4">
                                    Generated Schedule
                                </h2>

                                {/* Section Selection */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="sectionSelect"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Select Section
                                    </label>
                                    <select
                                        id="sectionSelect"
                                        value={selectedSection || ""}
                                        onChange={(e) =>
                                            setSelectedSection(e.target.value)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="" disabled>
                                            Select a section
                                        </option>
                                        {Array.from(
                                            new Set(
                                                viewGeneratedSchedule.map(
                                                    (schedule) =>
                                                        schedule.section_name
                                                )
                                            )
                                        ).map((sectionName) => (
                                            <option
                                                key={sectionName}
                                                value={sectionName}
                                            >
                                                {sectionName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Schedule Table */}
                                {selectedSection && (
                                    <div className=" overflow-y-auto max-h-[50vh]">
                                        <h3 className="text-lg font-bold mb-2">
                                            Section: {selectedSection}
                                        </h3>
                                        <table className="w-full border-collapse border border-gray-300 ">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Subject Code
                                                    </th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Room Number
                                                    </th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Day Slot
                                                    </th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Start Time
                                                    </th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        End Time
                                                    </th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Instructor Name
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {viewGeneratedSchedule
                                                    .filter(
                                                        (schedule) =>
                                                            schedule.section_name ===
                                                            selectedSection
                                                    )
                                                    .map((schedule, idx) => (
                                                        <tr
                                                            key={idx}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    schedule.subject_code
                                                                }
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    schedule.room_number
                                                                }
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    schedule.day_slot
                                                                }
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    schedule.time_start
                                                                }
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    schedule.time_end
                                                                }
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    instructors?.find(
                                                                        (
                                                                            instructor
                                                                        ) =>
                                                                            instructor.id ===
                                                                            schedule.instructor_id
                                                                    )?.name
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Close Button */}
                                <div className="flex justify-end mt-4">
                                    <PrimaryButton
                                        onClick={handleGenerateScheduleClick}
                                        className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-lg"
                                    >
                                        Close
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-2xl shadow-full">
                                <h2 className="text-xl font-semibold mb-4">
                                    Generate Class Schedule
                                </h2>
                                <div className="mb-4">
                                    <label
                                        htmlFor="schoolYear"
                                        className="mt-2 block text-sm font-medium text-gray-700"
                                    >
                                        School Year
                                    </label>
                                    <input
                                        type="text"
                                        id="schoolYear"
                                        value={schoolYear}
                                        onChange={handleSchoolYearChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="e.g. 2023-2024"
                                    />
                                    <label
                                        htmlFor="semester"
                                        className="mt-2 block text-sm font-medium text-gray-700"
                                    >
                                        Semester
                                    </label>
                                    <select
                                        id="semester"
                                        value={semester}
                                        onChange={handleSemesterChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="1st">
                                            1st Semester
                                        </option>
                                        <option value="2nd">
                                            2nd Semester
                                        </option>
                                    </select>
                                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <PrimaryButton
                                            onClick={handleGenerateSchedule}
                                            className="bg-blue-500 hover:bg-blue-400 text-white flex justify-center rounded-lg"
                                        >
                                            Generate Schedule
                                        </PrimaryButton>
                                        <button
                                            onClick={
                                                handleGenerateScheduleClick
                                            }
                                            className="bg-red-500 hover:bg-red-400 text-white flex justify-center p-4 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div className="mt-5 flex items-center justify-center">
                                        {retrievedFeedback.length > 0 && (
                                            <PrimaryButton className="w-1/2 bg-green-600 hover:bg-green-500 text-white flex justify-center rounded-lg"
                                                onClick={async () => {
                                                    try {
                                                       const response = await axios.get(
                                                            "/api/schedules/generate-from-feedback"
                                                        );
                                                        fetchGeneratedSchedule();
                                                        console.log(response.data.data);
                                                        setViewFile(false);
                                                    }
                                                    catch (error) {
                                                        console.error(
                                                            "Error generating schedule from feedback:",
                                                            error
                                                        );
                                                        console.log("Error field");
                                                    }
                                                }}
                                            >
                                                Generate Class Schedule from
                                                Feedback
                                            </PrimaryButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </main>
        </Layout>
    );
};

export default DepAdminDashboard;
