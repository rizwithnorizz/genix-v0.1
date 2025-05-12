import Layout from "@/Components/ui/layout";
import { useEffect, useState } from "react";
import {
    Bell,
    CalendarArrowUp,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    ComponentIcon,
    FileJson2,
    FilesIcon,
    FileSpreadsheet,
    House,
    MoreVertical,
    Network,
    SendHorizonal,
    ShapesIcon,
    Trash2,
    UserCheck,
    UserPenIcon,
    Users,
    View,
    X,
    type LucideIcon,
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import News from "@/Components/news";
import { Chart } from "@/Components/Chart";
import { Bar_Chart } from "@/Components/Bar_Chart";

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
    repo_name: string;
    departmentID: number;
    semester: string;
    schedules: GeneratedSchedule[];
    status: boolean;
}

interface GeneratedSchedule {
    id: number;
    day_slot: number;
    instructor_id: number;
    subject_code: string;
    room_number: string;
    section_name: string;
    time_start: number;
    time_end: number;
}

interface HeaderCount {
    id: number;
    icon: LucideIcon;
    desc: string;
    count: number;
    url: string;
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
            setIsLoading(true);
            const response = await axios.post("/api/schedules/generate", {
                semester: semester,
                school_year: semester + " Semester: S.Y " + schoolYear,
            });
            setViewGeneratedSchedule(response.data.data);
            fetchGeneratedSchedule();
        } catch (error) {
            window.alert(
                error +
                    "\nCheck parameters: Instructor-Subject Assignment, Room Assignment"
            );
        } finally {
            setIsLoading(false);
        }
    };
    const [generatedSchedule, setGeneratedSchedule] = useState<
        Schedule[] | null
    >(null);
    const fetchGeneratedSchedule = async () => {
        try {
            const response = await axios.get("/api/schedules/list");

            setGeneratedSchedule(response.data.data);
            console.log(response.data.data);
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
    const [genEdInstructors, setGenEdInstructors] = useState<
        Instructor[] | null
    >(null);
    const fetchInstructors = async () => {
        try {
            const response = await axios.get("/api/instructors");
            const responseGenEd = await axios.get("/api/genEdInstructors");
            setGenEdInstructors(responseGenEd.data.data);
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

    const DAY_MAPPING: { [key: number]: string } = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    };

    const groupedSchedules = Object.keys(DAY_MAPPING).reduce((acc, day) => {
        const daySchedules =
            viewGeneratedSchedule
                ?.flatMap((schedule) => schedule)
                .filter(
                    (schedule) =>
                        schedule.day_slot === parseInt(day) &&
                        (!selectedSection ||
                            schedule.section_name === selectedSection) // Filter by selectedSection
                )
                .sort((a, b) => a.time_start - b.time_start) || [];
        acc[day] = daySchedules;
        return acc;
    }, {} as { [key: string]: GeneratedSchedule[] });

    const scheduleFileView = Object.keys(DAY_MAPPING).reduce((acc, day) => {
        const daySchedules =
            selectedSchedule?.schedules
                .filter(
                    (schedule) =>
                        schedule.day_slot === parseInt(day) &&
                        (!selectedSection ||
                            schedule.section_name === selectedSection) // Filter by selectedSection
                )
                .sort((a, b) => a.time_start - b.time_start) || [];
        acc[day] = daySchedules;
        return acc;
    }, {} as { [key: string]: GeneratedSchedule[] });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const headerCount: HeaderCount[] = [
        {
            id: 1,
            icon: FileJson2,
            desc: "Curriculums",
            count: 0,
            url: "/dep-admin/courseOfferings",

        },
        {
            id: 2,
            icon: ShapesIcon,
            desc: "Sections",
            count: 0,
            url: "/dep-admin/courseOfferings",
        },
        {
            id: 3,
            icon: Users,
            desc: "Instructors",
            count: 0,
            url: "/dep-admin/instructors",
        },
        {
            id: 4,
            icon: UserPenIcon,
            count: 0,
            desc: "Feedback",
            url: "/dep-admin/feedback",
        }
    ];
    return (
        <Layout>
            <main className="pr-8">
                <h1 className="font-bold text-2xl mb-4">
                    Department Admin Dashboard
                </h1>
                <div className="grid md:grid-cols-5 grid-cols-2 gap-4 mb-4">
                    {headerCount.map((count, idx) => (
                        <a href={count.url} key={idx}>
                        <div
                            key={idx}
                            className="bg-white p-4 border-2 border-gray-500 rounded-xl md:row-start-1 s:h-70"
                        >
                            <div className="flex items-center justify-center">
                                <count.icon className="h-20 w-20" />
                            </div>
                            <div>
                                <p className="text-lg overflow-hidden truncate text-ellipsis">{count.desc}</p>
                            </div>
                            <div>
                                <label className="text-4xl font-bold">
                                    {count.count}
                                </label>
                            </div>
                        </div>
                        </a>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4 flex mb-12">
                    <div className="h-80">
                        <Chart className="h-full w-full p-4"/>
                        <h2 className="text-center font-semibold text-lg truncate" title="Feedback Rate to Approval Rate">Feedback Rate to Approval Rate</h2>
                    </div>
                    <div className="h-80 rounded-xl p-4">
                        <Bar_Chart className="h-full w-full p-4"/>
                        <h2 className="text-center font-semibold text-lg truncate" title="Generation to Feedback Ratings">Generation to Feedback Ratings</h2>
                    </div>
                </div>

                
                <div className="grid md:grid-cols-2 grid-cols1 gap-4">
                    <div className="bg-white p-4 rounded-2xl border-2 border-gray-500 md:row-start-1 s:h-70">
                        <h2 className="font-semibold text-lg mb-2">
                            Generated Schedules
                        </h2>
                        <div className="mt-5 space-y-4 h-[139px] overflow-y-auto">
                            {generatedSchedule?.length != 0 ? (
                                generatedSchedule?.map((schedule, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white p-2 flex border-2 border-gray-500 rounded-xl relative items-center justify-between"
                                    >
                                        <p className="ps-5 text-gray-500 flex items-center justify-center">
                                            <span>{schedule.repo_name}</span>
                                        </p>
                                        <div className="flex gap-2 pr-4 pl-2">
                                            <button
                                                className="border-2 border-gray-500 text-gray-500 hover:border-gray-200 hover:text-gray-200 rounded-xl p-2"
                                                onClick={async () => {
                                                    const confirmDelete =
                                                        window.confirm(
                                                            "Are you sure you want to delete this schedule?"
                                                        );
                                                    if (!confirmDelete) {
                                                        return;
                                                    }
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
                                                className="border-2 border-gray-500 text-gray-500 hover:border-gray-200 hover:text-gray-200 rounded-xl p-2"
                                            >
                                                <View size={24} />
                                            </button>
                                            <button
                                                className="border-2 border-gray-500 text-gray-500 hover:border-gray-200 hover:text-gray-200 rounded-xl p-2"
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
                            className="mt-10 py-2 px-4 rounded-lg "
                        >
                            Generate New Class Schedule
                        </PrimaryButton>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-500">
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
                                            className="w-full h-[55px] hover:bg-gray-100 bg-white text-gray-700 p-2 rounded-xl flex relative items-center justify-between border-2 border-gray-500"
                                        >
                                            <div className="pl-5 flex items-center  truncate text-nowrap ">
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
                            <PrimaryButton className="mt-10 py-2 px-4 rounded-lg ">
                                View Curriculums
                            </PrimaryButton>
                        </a>
                    </div>
                    <div className="mt-4 mb-4 bg-white p-4 rounded-xl border-2 border-gray-500 col-span-2  ">
                        <h2 className="font-semibold text-lg mb-4">Faculty</h2>
                        <div className="relative">
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
                                {instructors?.length === 0 ? (
                                    <div className="text-center text-gray-500 col-span-5 mt-10">
                                        No instructors available.
                                    </div>
                                ) : (
                                    instructors?.map((instructor) => (
                                        <PrimaryButton
                                            key={instructor.id}
                                            className="p-6 rounded-lg shadow flex flex-col items-center justify-center h-[10rem]"
                                        >
                                            <div className="text-6xl text-gray-500 font-bold mb-2">
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
                                <PrimaryButton className="mt-10 py-2 px-4 rounded-lg ">
                                    View All
                                </PrimaryButton>
                            </a>
                        </div>
                    </div>

                </div>
                {viewFile && selectedSchedule && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
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
                                    className="mt-1 block w-full border border-gray-500 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">All Sections</option>
                                    {Array.from(
                                        new Set(
                                            generatedSchedule?.flatMap(
                                                (schedule) =>
                                                    schedule.schedules.map(
                                                        (item) =>
                                                            item.section_name
                                                    )
                                            )
                                        )
                                    ).map((sectionName, idx) => (
                                        <option key={idx} value={sectionName}>
                                            {sectionName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Schedule Table */}

                            <div className="overflow-x-auto max-h-[50vh]">
                                <h3 className="text-lg font-bold mb-2">
                                    Section: {selectedSection || "All Sections"}
                                </h3>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            {Object.values(DAY_MAPPING).map(
                                                (day) => (
                                                    <th
                                                        key={day}
                                                        className="border border-gray-500 px-4 py-2 text-center"
                                                    >
                                                        {day}
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {Object.keys(DAY_MAPPING).map(
                                                (day, idx) => (
                                                    <td
                                                        key={idx}
                                                        className="border border-gray-500 px-4 py-2 align-top"
                                                    >
                                                        {scheduleFileView[day]
                                                            ?.length > 0 ? (
                                                            scheduleFileView[
                                                                day
                                                            ].map(
                                                                (schedule) => (
                                                                    <div
                                                                        key={
                                                                            schedule.id
                                                                        }
                                                                        className="mb-2 border border-gray-500 p-2 rounded-lg shadow text-center"
                                                                    >
                                                                        <p className="font-semibold">
                                                                            {
                                                                                schedule.subject_code
                                                                            }
                                                                        </p>
                                                                        <p className="font-semibold text-blue-500">
                                                                            {
                                                                                schedule.room_number
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-600 underline">
                                                                            {
                                                                                schedule.time_start
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                schedule.time_end
                                                                            }{" "}
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            {instructors?.find(
                                                                                (
                                                                                    instructor
                                                                                ) =>
                                                                                    instructor.id ===
                                                                                    schedule.instructor_id
                                                                            )
                                                                                ?.name ||
                                                                                genEdInstructors?.find(
                                                                                    (
                                                                                        instructor
                                                                                    ) =>
                                                                                        instructor.id ===
                                                                                        schedule.instructor_id
                                                                                )
                                                                                    ?.name ||
                                                                                "Unknown"}
                                                                        </p>
                                                                    </div>
                                                                )
                                                            )
                                                        ) : (
                                                            <p className="text-sm text-gray-500">
                                                                No schedules
                                                            </p>
                                                        )}
                                                    </td>
                                                )
                                            )}
                                        </tr>
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
                            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[95vh]">
                                <div className="flex justify-between mb-4">
                                    <h2 className="text-xl font-semibold mb-4">
                                        Generated Schedule
                                    </h2>
                                    <button
                                        onClick={() => setGenerateTab(false)}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

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
                                        className="mt-1 block w-full border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="" disabled>
                                            Select a section
                                        </option>
                                        {Array.from(
                                            new Set(
                                                viewGeneratedSchedule.map(
                                                    (item) => item.section_name
                                                )
                                            )
                                        ).map((sectionName, idx) => (
                                            <option
                                                key={idx}
                                                value={sectionName}
                                            >
                                                {sectionName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Schedule Table */}
                                {selectedSection && (
                                    <div className="overflow-x-auto max-h-[50vh]">
                                        <h3 className="text-lg font-bold mb-2">
                                            Section: {selectedSection}
                                        </h3>
                                        <table className="w-full border-collapse border border-gray-300">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    {Object.values(
                                                        DAY_MAPPING
                                                    ).map((day) => (
                                                        <th
                                                            key={day}
                                                            className="border border-gray-500 px-4 py-2 text-center"
                                                        >
                                                            {day}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {Object.keys(
                                                        DAY_MAPPING
                                                    ).map((day, idx) => (
                                                        <td
                                                            key={idx}
                                                            className="border border-gray-500 px-4 py-2 align-top"
                                                        >
                                                            {groupedSchedules[
                                                                day
                                                            ]?.length > 0 ? (
                                                                groupedSchedules[
                                                                    day
                                                                ].map(
                                                                    (
                                                                        schedule
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                schedule.id
                                                                            }
                                                                            className="mb-2 w-full border-gray-500 border-2 p-2 rounded-lg shadow text-center"
                                                                        >
                                                                            <p className="font-semibold">
                                                                                {
                                                                                    schedule.subject_code
                                                                                }
                                                                            </p>
                                                                            <p className="font-semibold text-blue-500">
                                                                                {
                                                                                    schedule.room_number
                                                                                }
                                                                            </p>
                                                                            <p className="text-sm text-gray-600 underline">
                                                                                {
                                                                                    schedule.time_start
                                                                                }{" "}
                                                                                -{" "}
                                                                                {
                                                                                    schedule.time_end
                                                                                }{" "}
                                                                            </p>
                                                                            <p className="text-sm text-gray-600">
                                                                                {instructors?.find(
                                                                                    (
                                                                                        instructor
                                                                                    ) =>
                                                                                        instructor.id ===
                                                                                        schedule.instructor_id
                                                                                )
                                                                                    ?.name ||
                                                                                    genEdInstructors?.find(
                                                                                        (
                                                                                            instructor
                                                                                        ) =>
                                                                                            instructor.id ===
                                                                                            schedule.instructor_id
                                                                                    )
                                                                                        ?.name ||
                                                                                    "Unknown"}
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                )
                                                            ) : (
                                                                <p className="text-sm text-gray-500">
                                                                    No schedules
                                                                </p>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {/* Close Button */}
                                <div className="flex justify-end mt-4">
                                    <PrimaryButton
                                        onClick={handleGenerateScheduleClick}
                                        className="bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded-lg"
                                    >
                                        Close
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-2xl w-[90vw] shadow-full">
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
                                        required
                                        onChange={handleSchoolYearChange}
                                        className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm focus:ring-gray-300 focus:border-gray-200 sm:text-sm"
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
                                        className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm focus:ring-gray-300 focus:border-gray-200 sm:text-sm"
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
                                            onClick={
                                                handleGenerateScheduleClick
                                            }
                                            className="flex justify-center rounded-lg"
                                        >
                                            Cancel
                                        </PrimaryButton>
                                        <PrimaryButton
                                            onClick={handleGenerateSchedule}
                                            disabled={isLoading}
                                            className="flex justify-center rounded-lg"
                                        >
                                            Generate Schedule
                                        </PrimaryButton>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="mt-5 flex items-center justify-center">
                                        {retrievedFeedback.length > 0 && (
                                            <PrimaryButton
                                                onClick={async () => {
                                                    try {
                                                        setIsLoading(true);
                                                        const response =
                                                            await axios.get(
                                                                "/api/schedules/generate-from-feedback"
                                                            );
                                                        console.log(
                                                            "Generated schedule from feedback:",
                                                            response.data.data
                                                        );
                                                        setViewGeneratedSchedule(
                                                            response.data.data
                                                        );
                                                        setGenerateTab(true);
                                                        setViewFile(false);
                                                        fetchGeneratedSchedule();
                                                    } catch (error) {
                                                        console.error(
                                                            "Error generating schedule from feedback:",
                                                            error
                                                        );
                                                    } finally {
                                                        setIsLoading(false);
                                                    }
                                                }}
                                                disabled={
                                                    isLoading ? true : false
                                                }
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
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-30">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-100"></div>
                    </div>
                )}
            </main>
        </Layout>
    );
};

export default DepAdminDashboard;
