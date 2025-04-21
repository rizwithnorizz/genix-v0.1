import Layout from "@/Components/ui/layout";
import { useCallback, useEffect, useState } from "react";
import { Bell, House, Network, Users, type LucideIcon } from "lucide-react";
import axios from "axios";
import React from "react";

interface News {
    id: number;
    name: string;
    content: string;
}

interface Schedule {
    id: number;
    name: string;
    content: string;
}

interface HeaderCount {
    id: number;
    icon: LucideIcon;
    desc: string;
    count: number;
    url: string;
}

interface Department {
    id: number;
    department_short_name: string;
}

interface Feedback {
    feedback: string;
    sender: string;
    feedback_date: string;
    department_short_name: string;
}

interface FeedbackData {
    department_short_name: string;
    feedbackData: Feedback[];
}

const SuperAdminDashboard: React.FC = () => {
    const [department, setDepartment] = useState<Department[] | null>(null);
    const fetchDepartments = async () => {
        try {
            const response = await axios.get("/admin/get-departments");
            setDepartment(response.data.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
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
        {
            id: 5,
            name: "Mechanical Engineering",
            content: "Newly added department CEM",
        },
        {
            id: 6,
            name: "Electronics Engineering",
            content: "Newly added department COE",
        },
        {
            id: 7,
            name: "Information Systems",
            content: "Newly added department CIS",
        },
        {
            id: 8,
            name: "Software Engineering",
            content: "Newly added department CSE",
        },
    ]);

    const [roomCount, setRoomCount] = useState<number>(0);
    const [departmentCount, setDepartmentCount] = useState<number>(0);

    const fetchRoomCount = async () => {
        try {
            const response = await axios.get("/admin/getDashboardCount");
            console.log("fetched data", response.data);
            setRoomCount(response.data.classrooms);
            setDepartmentCount(response.data.departments);
        } catch (error) {
            console.error("Error fetching room count:", error);
        }
    };

    const [feedbackCompile, setFeedback] = useState<FeedbackData[]>([]);
    const fetchFeedback = async () => {
        try {
            const response = await axios.get("/admin/getFeedback");
            setFeedback(response.data.data);
            console.log("fetched data", response.data.data);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    useEffect(() => {
        fetchFeedback();
        fetchRoomCount();
        fetchDepartments();
    }, [console.log(feedbackCompile)]);

    const headerCount: HeaderCount[] = [
        {
            id: 1,
            icon: House,
            desc: "Rooms",
            count: roomCount,
            url: "/admin/rooms",

        },
        {
            id: 2,
            icon: Network,
            desc: "Departments",
            count: departmentCount,
            url: "/admin/departments",
        },
    ];

    const [isModal, setIsModal] = useState<boolean>(false);
    const [feeedbackModal, setFeedbackModal] = useState<boolean>(false);

    const [selectedFeedback, setSelectedFeedback] = useState<Feedback[]>([]);
    const handleViewFeedback = (feedback: Feedback[]) => {
        setFeedbackModal(true);
        setSelectedFeedback(feedback);
        console.log("Viewing feedback:", feedback);
    };

    const handleApproveFeedback = (feedback: FeedbackData) => {
        // Handle approving feedback
        console.log("Approving feedback:", feedback);
        // You can add your approval logic here
    };
    const handleRejectFeedback = async (department: string) => {
        try{
            const response = await axios.delete(`/admin/deleteFeedback/${department}`);
            console.log("Rejecting feedback:", department);
            console.log(response.data);
            const updatedFeedback = feedbackCompile.filter( 
                (f) => f.department_short_name !== department
            );
            setFeedback(updatedFeedback);   
        } catch (error) {
            console.error("Error rejecting feedback:", error);
        }
    };

    return (
        <Layout>
            <main className="col-span-3 space-y-4">
                <h1 className="font-bold text-2xl mb-4">
                    Super Admin Dashboard
                </h1>
                <div className="grid md:grid-cols-5 grid-cols-2 gap-4">
                    {headerCount.map((count, idx) => (
                        <a href={count.url} key={idx}>
                        <div
                            key={idx}
                            className="bg-white p-4 rounded-2xl shadow-lg md:row-start-1 s:h-70"
                        >
                            <div className="flex items-center justify-center">
                                <count.icon className="h-20 w-20" />
                            </div>
                            <div>
                                <label className="text-lg">{count.desc}</label>
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

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-lg col-span-1">
                        <h2 className="font-semibold text-lg mb-2">
                            Schedule-Change Requests
                        </h2>
                        <div className="h-[300px] overflow-y-auto">
                            <table className="w-full text-center">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2">Department</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                {feedbackCompile.map((feedback, idx) => (
                                    <tbody key={idx}>
                                        <tr className="border-b">
                                            <td className="p-2">
                                                {feedback.department_short_name}
                                            </td>
                                            <td className="p-2 flex gap-4 flex justify-center">
                                                <button
                                                    onClick={() =>
                                                        handleViewFeedback(
                                                            feedback.feedbackData
                                                        )
                                                    }
                                                    className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleApproveFeedback(
                                                            feedback
                                                        )
                                                    }
                                                    className="bg-green-500 text-white py-1 px-3 rounded-lg"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRejectFeedback(
                                                            feedback.department_short_name
                                                        )
                                                    }
                                                    className="bg-red-500 text-white py-1 px-3 rounded-lg"
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-lg">
                        <h2 className="font-semibold text-lg">News</h2>
                        <div className=" h-[300px] overflow-y-auto">
                            <div className="mt-5 space-y-4 h-[200px] s:h-70 ove rflow-y-auto">
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
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg col-span-1 ">
                    <div className="p-5 grid grid-cols-4 md:grid-cols-5  gap-4 h-[200px] overflow-y-auto">
                        {department?.map((dept, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 p-4 rounded-xl flex flex-col items-center shadow h-30"
                            >
                                <div className="bg-gray-200 w-16 h-16 rounded-full mb-2"></div>
                                <span>{dept.department_short_name}</span>
                            </div>
                        ))}
                    </div>
                    <a href="departments">
                        <button className="mt-4 bg-black text-white py-2 px-4 rounded-lg">
                            View All Departments
                        </button>
                    </a>
                </div>
                {feeedbackModal && selectedFeedback && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                            <h2 className="text-xl font-semibold mb-4">
                                Feedback Details
                            </h2>
                            <div className="overflow-y-auto max-h-[400px]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2">Sender</th>
                                            <th className="p-2">Feedback</th>
                                            <th className="p-2">Date</th>
                                            <th className="p-2">Department</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedFeedback.map(
                                            (feedback, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="border-b"
                                                >
                                                    <td className="p-2">
                                                        {feedback.sender}
                                                    </td>
                                                    <td className="p-2">
                                                        {feedback.feedback}
                                                    </td>
                                                    <td className="p-2">
                                                        {new Date(
                                                            feedback.feedback_date
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-2">
                                                        {
                                                            feedback.department_short_name
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <button
                                onClick={() => setFeedbackModal(false)}
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </Layout>
    );
};
export default SuperAdminDashboard;
