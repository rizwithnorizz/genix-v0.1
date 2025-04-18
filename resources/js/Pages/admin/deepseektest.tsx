import Layout from "@/Components/ui/layout";
import axios from "axios";
import { useState } from "react";

interface schedule {
    subject_code: string;
    subject_name: string;
    time_slot: string;
    day_slot: string;
    room_number: string;
    section_name: string;
    instructor: string;
    department: string;
}

const DeepSeekTest = () => {
    const [jsonResponse, setJsonResponse] = useState<schedule[] | null>(null);
    const [selectedSection, setSelectedSection] = useState<string>(""); // State for the selected section

    const handleSubmit = async () => {
        try {
            const response = await axios.get("/admin/chat/send");
            if (response.data.success) {
                setJsonResponse(response.data.message.schedule);
                console.log("Response:", response.data.message);
                alert(response.data.message);
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error invoking DeepSeekController:", error);
            alert("Failed to invoke DeepSeekController. " + error);
        }
    };

    // Filter schedules based on the selected section
    const filteredSchedules = jsonResponse?.filter(
        (schedule) =>
            selectedSection === "" || schedule.section_name === selectedSection
    );

    // Get all unique section names for the filter dropdown
    const sections = jsonResponse
        ? Array.from(
              new Set(jsonResponse.map((schedule) => schedule.section_name))
          )
        : [];

    return (
        <Layout>
            <div>
                <button
                    className="rounded shadow p-5 bg-white hover:bg-blue-200"
                    onClick={handleSubmit}
                >
                    Invoke DeepSeekController
                </button>
            </div>

            {/* Filter Dropdown */}
            <div className="my-4">
                <select
                    className="p-2 pr-10 border rounded"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                >
                    <option value="">All Sections</option>
                    {sections.map((section, index) => (
                        <option key={index} value={section}>
                            {section}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display filtered schedules */}
            <div className="flex flex-wrap overflow-y-auto shadow-xl p-5 gap-1">
                {filteredSchedules?.map((json, index) => (
                    <div
                        key={index}
                        className="m-2 bg-white shadow w-full grid grid-cols-7 rounded-xl p-5"
                    >
                        <div className="text-sm break-words">
                            {json.department}
                        </div>
                        <div className="text-sm break-words">
                            {json.section_name}
                        </div>
                        <div className="text-sm break-words">
                            {json.subject_code}
                        </div>
                        <div className="text-sm break-words">
                            {json.time_slot}
                        </div>
                        <div className="text-sm break-words">
                            {json.day_slot}
                        </div>
                        <div className="text-sm break-words">
                            {json.instructor}
                        </div>
                        <div className="text-sm break-words">
                            {json.room_number}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default DeepSeekTest;
