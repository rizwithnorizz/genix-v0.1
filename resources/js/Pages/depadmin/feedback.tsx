import React, { useEffect, useState } from "react";
import Layout from "@/Components/ui/layout";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import { Check, FileQuestion, X } from "lucide-react";

interface studentFeedback {
    id: number;
    section_name: string;
    subject_code: string;
    feedback: string;
    status: boolean;
}
interface instructorFeedback {
    id: number;
    name: string;
    subject_code: string;
    feedback: string;
    status: boolean;
}

const Feedback: React.FC = () => {
    const [studentFeedbacks, setStudentFeedbacks] = useState<
        studentFeedback[] | null
    >(null);
    const [instructorFeedbacks, setInstructorFeedbacks] = useState<
        instructorFeedback[] | null
    >(null);

    const fetchStudentFeedbacks = async () => {
        try {
            const response = await axios.get("/api/feedback/student");
            setStudentFeedbacks(response.data.data);
        } catch (error) {
            console.error("Error fetching student feedbacks:", error);
        }
    };

    const fetchInstructorFeedbacks = async () => {
        try {
            const response = await axios.get("/api/feedback/instructor");
            setInstructorFeedbacks(response.data.data);
        } catch (error) {
            console.error("Error fetching instructor feedbacks:", error);
        }
    };

    const toggleFeedbackStatus = async (
        type: "student" | "instructor",
        id: number
    ) => {
        const confirm = window.confirm(
            "Are you sure you want to approve this feedback?"
        );
        if (!confirm) {
            return;
        }
        try {
            const endpoint = `/api/feedback/${type}/approve`;
            await axios.post(endpoint, {
                feedback_id: id,
            });
            if (type === "student") {
                fetchStudentFeedbacks();
            } else {
                fetchInstructorFeedbacks();
            }
        } catch (error) {
            window.alert(error);
        }
    };
    const rejectFeedback = async (
        type: "student" | "instructor",
        id: number
    ) => {
        const confirm = window.confirm("Are you sure you want to reject this feedback?");
        if (!confirm){
            return;
        }
        try{
            const endpoint = `/api/feedback/${type}/reject`;
            await axios.post(endpoint, {
                feedback_id: id,
            });
            if (type === "student") {
                fetchStudentFeedbacks();
            } else {
                fetchInstructorFeedbacks();
            }
        }catch (error){
            window.alert(error);
        }
    }

    useEffect(() => {
        fetchStudentFeedbacks();
        fetchInstructorFeedbacks();
    }, []);

    // Navigation
    const [activeTab, setActiveTab] = useState<
        "Student Feedback" | "Instructor Feedback"
    >("Student Feedback");
    const handleSwitchTabs = (tabName: string) => {
        if (tabName === "Student Feedback") {
            setActiveTab("Student Feedback");
            fetchStudentFeedbacks();
        } else {
            setActiveTab("Instructor Feedback");
            fetchInstructorFeedbacks();
        }
    };
    const [searchTerm, setSearchTerm] = useState<string>("");
    const filteredStudentFeedbacks = studentFeedbacks?.filter((feedback) =>
        feedback.section_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredInstructorFeedbacks = instructorFeedbacks?.filter(
        (feedback) =>
            feedback.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <main className="col-span-3 space-y-4">
                <h1 className="font-bold text-2xl mb-4">Feedback Management</h1>

                <div className="bg-white p-4">
                    {/* Tabs */}
                    <div className="flex border-b mb-4">
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "Student Feedback"
                                    ? "border-b-2 border-blue-500 font-semibold"
                                    : ""
                            }`}
                            onClick={() => handleSwitchTabs("Student Feedback")}
                        >
                            Student Feedback
                        </button>
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "Instructor Feedback"
                                    ? "border-b-2 border-blue-500 font-semibold"
                                    : ""
                            }`}
                            onClick={() =>
                                handleSwitchTabs("Instructor Feedback")
                            }
                        >
                            Instructor Feedback
                        </button>
                    </div>

                    {/* Student Feedback Table */}
                    {activeTab === "Student Feedback" && (
                        <div className="bg-white p-4">
                            <div className="flex justify-between mb-4">
                                <input
                                    className="border border-gray-300 rounded-lg p-2"
                                    type="text"
                                    placeholder="Search section..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            {studentFeedbacks?.length !== 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-center border-l border-r border-t border-gray-500">
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Course Section
                                                </th>
                                                <th className="border border-gray-500 px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subject Code
                                                </th>
                                                <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Feedback
                                                </th>
                                                <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredStudentFeedbacks?.map(
                                                (feedback, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="divide-x divide-gray-500"
                                                    >
                                                        <td className="w-[10rem] px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                                                            {
                                                                feedback.section_name
                                                            }
                                                        </td>
                                                        <td className="w-[10rem] px-6 py-4 whitespace-nowrap text-red-500">
                                                            {
                                                                feedback.subject_code
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 text-left text-gray-900">
                                                            {feedback.feedback}
                                                        </td>
                                                        <td className="w-[10rem] px-6 py-4 whitespace-nowrap">
                                                            <div
                                                                className={`px-4 py-1 border-2 text-lg rounded font-bold ${
                                                                    feedback.status
                                                                        ? "border-green-500 text-green-500"
                                                                        : "border-red-600 text-red-600"
                                                                }`}
                                                            >
                                                                {feedback.status
                                                                    ? "Approved"
                                                                    : "Pending"}
                                                            </div>
                                                        </td>
                                                        <td className="w-[5rem] px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                disabled={feedback.status}
                                                                onClick={() =>
                                                                    toggleFeedbackStatus(
                                                                        "student",
                                                                        feedback.id
                                                                    )
                                                                }
                                                                className="text-lg px-4 py-1 rounded font-medium text-white bg-green-500 hover:bg-green-400 mr-2 disabled:bg-gray-100 disabled:border-transparent disabled:text-gray-500 disabled:cursor-not-allowed">
                                                                Approve
                                                                <Check size={20} className="inline ml-2" />
                                                            </button>
                                                            <button
                                                                disabled={!feedback.status}
                                                                onClick={() =>
                                                                    rejectFeedback(
                                                                        "student",
                                                                        feedback.id
                                                                    )
                                                                }
                                                                className="text-lg px-4 py-1 bg-red-500 text-white rounded font-medium hover:bg-red-400 disabled:bg-gray-100 disabled:border-transparent disabled:text-gray-500 disabled:cursor-not-allowed"
                                                            >
                                                                Reject 
                                                                <X size={20} className="inline ml-2" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-64">
                                    <p className="text-gray-500">
                                        No feedback available yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Instructor Feedback Table */}
                    {activeTab === "Instructor Feedback" && (
                        <div className="bg-white p-4">
                            <div className="flex justify-between mb-4">
                                <input
                                    className="border border-gray-300 rounded-lg p-2"
                                    type="text"
                                    placeholder="Search instructor..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            {instructorFeedbacks?.length !== 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 border-l border-r border-t border-gray-500 text-center">
                                        <thead>
                                            <tr>
                                                <th className="border-gray-500 border px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Instructor Name
                                                </th>
                                                <th className="border-gray-500 border px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subject Code
                                                </th>
                                                <th className="border-gray-500 border px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Feedback
                                                </th>
                                                <th className="border-gray-500 border px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredInstructorFeedbacks?.map(
                                                (feedback, idx) => (
                                                   <tr
                                                        key={idx}
                                                        className="divide-x divide-gray-500"
                                                    >
                                                        <td className="w-[10rem] px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                                                            {
                                                                feedback.name
                                                            }
                                                        </td>
                                                        <td className="w-[10rem] px-6 py-4 whitespace-nowrap text-red-500">
                                                            {
                                                                feedback.subject_code
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 text-left text-gray-900">
                                                            {feedback.feedback}
                                                        </td>
                                                        <td className="w-[10rem] px-6 py-4 whitespace-nowrap">
                                                            <div
                                                                className={`px-4 py-1 border-2 text-lg rounded font-bold ${
                                                                    feedback.status
                                                                        ? "border-green-500 text-green-500"
                                                                        : "border-red-600 text-red-600"
                                                                }`}
                                                            >
                                                                {feedback.status
                                                                    ? "Approved"
                                                                    : "Pending"}
                                                            </div>
                                                        </td>
                                                        <td className="w-[5rem] px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                disabled={feedback.status}
                                                                onClick={() =>
                                                                    toggleFeedbackStatus(
                                                                        "instructor",
                                                                        feedback.id
                                                                    )
                                                                }
                                                                className="text-lg px-4 py-1 rounded font-medium text-white bg-green-500 hover:bg-green-400 mr-2 disabled:bg-gray-100 disabled:border-transparent disabled:text-gray-500 disabled:cursor-not-allowed">
                                                                Approve
                                                                <Check size={20} className="inline ml-2" />
                                                            </button>
                                                            <button
                                                                disabled={!feedback.status}
                                                                onClick={() =>
                                                                    rejectFeedback(
                                                                        "instructor",
                                                                        feedback.id
                                                                    )
                                                                }
                                                                className="text-lg px-4 py-1 bg-red-500 text-white rounded font-medium hover:bg-red-400 disabled:bg-gray-100 disabled:border-transparent disabled:text-gray-500 disabled:cursor-not-allowed"
                                                            >
                                                                Reject 
                                                                <X size={20} className="inline ml-2" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-64">
                                    <p className="text-gray-500">
                                        No feedback available yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </Layout>
    );
};

export default Feedback;
