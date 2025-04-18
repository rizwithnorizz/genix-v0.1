import Layout from "@/Components/ui/layout";
import { useEffect, useState } from "react";
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
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
    const handleGenerateSchedule = async () => {
        try {
            const response = await axios.post("/api/schedules/generate", {
                semester: "1st",
            });
            console.log("Schedule generated:", response.data);
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
    const [showCurriculumCourses, setShowCurriculumCourses] =
        useState<boolean>(false);
    const [selectedCurriculum, setSelectedCurriculum] =
        useState<Curriculum | null>(null);

    const handleShowCurriculumCourses = (curriculum: Curriculum) => {
        console.log("Curriculum:", curriculum);
        setSelectedCurriculum(curriculum);
        setShowCurriculumCourses(true);
    };
    const closeCurriculumCourses = () => {
        setShowCurriculumCourses(false);
        setSelectedCurriculum(null);
    };

    useState(() => {
        fetchCurriculum();
        fetchGeneratedSchedule();
        fetchInstructors();
    });

    return (
        <Layout>
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
                        {generatedSchedule?.map((schedule, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-800 text-white p-2 rounded-full flex shadow relative items-center justify-between"
                            >
                                <div className="pl-5 flex items-center">
                                    <span>{schedule.repo_name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="bg-green-500 hover:bg-green-400 text-white rounded-3xl p-2">
                                        View File
                                    </button>
                                    <button className="bg-red-800 hover:bg-red-700 text-white rounded-3xl p-2">
                                        Delete File
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <PrimaryButton
                        onClick={handleGenerateSchedule}
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
                    <div className="mt-5 space-y-4 h-[139px] overflow-y-auto">
                        {curriculum.map((Curriculum, idx) => (
                            <button
                                key={idx}
                                className="w-full h-[55px] hover:bg-gray-700 bg-gray-800 text-white p-2 rounded-full flex shadow relative items-center justify-between"
                            >
                                <div className="pl-5 flex items-center">
                                    <span>{Curriculum.curriculum_name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
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
                            {instructors?.map((instructor) => (
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
                            ))}
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
                                className="bg-gray-800 text-white p-4 rounded-full flex justify-between items-center shadow relative"
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
        </Layout>
    );
};

export default DepAdminDashboard;
