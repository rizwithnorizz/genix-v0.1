import React, { useEffect, useState } from "react";
import Layout from "@/Components/ui/layout";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";

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
        const confirm = window.confirm("Are you sure you want to approve this feedback?");
        if (!confirm){
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
            console.error("Error toggling feedback status:", error);
        }
    };

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

    const filteredInstructorFeedbacks = instructorFeedbacks?.filter((feedback) =>
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
                                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-center border-l border-r border-t border-gray-500">
                                    <thead >
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
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {studentFeedbacks?.map(
                                            (feedback, idx) => (
                                                <tr key={idx} className="divide-x divide-gray-500">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {feedback.section_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {feedback.subject_code}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {feedback.feedback}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <button
                                                            onClick={() =>
                                                                toggleFeedbackStatus(
                                                                    "student",
                                                                    feedback.id
                                                                )
                                                            }
                                                            className={`px-4 py-1 border border-gray-500 rounded text-xs font-medium ${
                                                                feedback.status
                                                                    ? "bg-green-300 text-green-800 hover:bg-green-200"
                                                                    : "text-red-800 hover:bg-red-300"
                                                            }`}
                                                        >
                                                            {feedback.status
                                                                ? "Approved"
                                                                : "Pending"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
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
                                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                                />
                            </div>

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
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredInstructorFeedbacks?.map(
                                            (feedback, idx) => (
                                                <tr key={idx} className="divide-x divide-gray-500">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {feedback.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {feedback.subject_code}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {feedback.feedback}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <button
                                                            onClick={() =>
                                                                toggleFeedbackStatus(
                                                                    "instructor",
                                                                    feedback.id
                                                                )
                                                            }
                                                            className={`px-4 py-1 border border-gray-500 rounded text-xs font-medium ${
                                                                feedback.status
                                                                    ? "bg-green-300 text-green-800 hover:bg-green-200"
                                                                    : "text-red-800 hover:bg-red-300"
                                                            }`}
                                                        >
                                                            {feedback.status
                                                                ? "Approved"
                                                                : "Pending"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </Layout>
    );
};

export default Feedback;
