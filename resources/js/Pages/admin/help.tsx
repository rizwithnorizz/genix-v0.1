import Layout from "@/Components/ui/layout";
import { useState } from "react";

export default function Help() {
    const [visibility, setVisibility] = useState<{
        value: boolean;
        name: string;
    }>({ value: false, name: "" });

    const toggleVisibility = (name: string) => {
        setVisibility((prev) => ({
            name,
            value: prev.name === name ? !prev.value : true,
        }));
    };

    return (
        <Layout>
            <h1 className="font-bold text-2xl mb-4">Help</h1>

            {/* Where to begin */}
            <button
                onClick={() => toggleVisibility("begin")}
                className="text-xl bg-gray-200 p-3 rounded-xl mb-2"
            >
                Where to begin?
            </button>
            {visibility.name === "begin" && visibility.value && (
                <div className="ml-4">
                    <h2 className="font-bold text-lg">Adding instructors</h2>
                    <ul className="list-disc ml-6">
                        <li>Instructor name</li>
                        <li>
                            General Education Instructor?: basically the instructor will be recognized outside of the department scope for assignment of subjects.
                        </li>
                        <li>
                            Subjects: Professional and General Education Subjects are available depending on the general education's checkbox.
                        </li>
                    </ul>

                    <h2 className="font-bold text-lg mt-4">Adding curriculums</h2>
                    <ul className="list-disc ml-6">
                        <li>Upload curriculum (docx file)</li>
                        <li>Review the details. Make sure the subjects have the correct information (Most specially for Professional Subjects checkbox).</li>
                        <li>Review the subjects per year level and per semester.</li>
                    </ul>

                    <h2 className="font-bold text-lg mt-4">Adding sections</h2>
                    <ul className="list-disc ml-6">
                        <li>Input the section's information (name and population).</li>
                        <li>Select which curriculum they are enrolled in.</li>
                        <li>Select which year level.</li>
                        <li>Review the subjects.</li>
                    </ul>
                </div>
            )}

            {/* Generating class schedules */}
            <button
                onClick={() => toggleVisibility("schedules")}
                className="text-xl bg-gray-200 p-3 rounded-xl mb-2"
            >
                Generating class schedules
            </button>
            {visibility.name === "schedules" && visibility.value && (
                <div className="ml-4">
                    <h2 className="font-bold text-lg">On department admin dashboard</h2>
                    <ul className="list-disc ml-6">
                        <li>Click "Generate New Class Schedule" button.</li>
                        <li>Input school year and semester.</li>
                        <li>Click "Generate Schedule".</li>
                        <li>Once generated, review the schedule.</li>
                    </ul>

                    <h2 className="font-bold text-lg mt-4">Common issues</h2>
                    <ul className="list-disc ml-6">
                        <li>If subjects do not appear on the generated schedule, this is more likely because there are no instructors set for that yet.</li>
                        <li>
                            If the generating schedules result in an error, more likely it has to do with the balance of the entities (classrooms to subjects ratio, instructors to subject ratio).
                        </li>
                    </ul>

                    <h2 className="font-bold text-lg mt-4">Error encountered</h2>
                    <ul className="list-disc ml-6">
                        <li>Double check Instructor-to-Subject assignment.</li>
                        <li>Contact Super Admin for the list of classrooms and their exclusiveness to departments.</li>
                    </ul>
                </div>
            )}
        </Layout>
    );
}