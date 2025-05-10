import React, { useState, useEffect, ChangeEventHandler } from "react";
import axios from "axios";
import Layout from "@/Components/ui/layout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Edit, Trash2 } from "lucide-react";

// Types
interface Instructor {
    id: number;
    name: string;
    initials: string;
    prof_subject_instructor: boolean;
    subjects: Subject[];
}

interface Subject {
    id: number;
    name: string;
    subject_code: string;
    prof_subject: boolean;
    year_level: number;
    semester: string;
}

interface InstructorCount {
    instructor_count: number;
    subject_code: number;
}
const InstructorsPage: React.FC = () => {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [selectedInstructor, setSelectedInstructor] =
        useState<Instructor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [newInstructor, setNewInstructor] = useState<Instructor>({
        id: 0,
        name: "",
        initials: "",
        prof_subject_instructor: false,
        subjects: [],
    });

    const fetchInstructors = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/instructors-with-subjects");
            const instructorsData = response.data.data;

            const processed = instructorsData.map((instructor: Instructor) => {
                const nameParts = instructor.name.split(" ");
                const initials = nameParts
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase();
                return { ...instructor, initials };
            });

            setInstructors(processed);
        } catch (error) {
            console.error("Error fetching instructors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllSubjects = async () => {
        try {
            const response = await axios.get("/api/subjects");
            console.log("All subjects response:", response.data.data);
            setAllSubjects(response.data.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    useEffect(() => {
        fetchInstructors();
        fetchAllSubjects();
        fetchInstructorCounts();
    }, []);

    const filteredInstructors = instructors.filter((i) =>
        i.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInstructorClick = (instructor: Instructor) => {
        setSelectedInstructor(instructor);
        setIsModalOpen(true);
    };

    const addSubjectToInstructor = async (
        instructorId: number,
        subjectId: number
    ) => {
        try {
            setIsLoading(true);
            await axios.post("/api/instructor-subjects", {
                instructor_id: instructorId,
                subject_id: subjectId,
            });

            const addedSubject = allSubjects.find((s) => s.id === subjectId);
            if (addedSubject && selectedInstructor) {
                const updated = {
                    ...selectedInstructor,
                    subjects: [...selectedInstructor.subjects, addedSubject],
                };
                setSelectedInstructor(updated);
                setInstructors((prev) =>
                    prev.map((inst) =>
                        inst.id === instructorId ? updated : inst
                    )
                );
            }
        } catch (error) {
            console.error("Add subject error:", error);
        } finally {
            setIsLoading(false);
            fetchInstructorCounts();
        }
    };

    const removeSubjectFromInstructor = async (
        instructorId: number,
        subjectId: number
    ) => {
        try {
            setIsLoading(true);
            await axios.delete("/api/instructor-subjects", {
                data: { instructor_id: instructorId, subject_id: subjectId },
            });

            const updatedSubjects =
                selectedInstructor?.subjects.filter(
                    (s) => s.id !== subjectId
                ) || [];
            setSelectedInstructor((prev) =>
                prev ? { ...prev, subjects: updatedSubjects } : null
            );
            setInstructors((prev) =>
                prev.map((inst) =>
                    inst.id === instructorId
                        ? { ...inst, subjects: updatedSubjects }
                        : inst
                )
            );
        } catch (error) {
            console.error("Remove subject error:", error);
        } finally {
            setIsLoading(false);
        }
        fetchInstructorCounts();
    };

    const isSubjectAssigned = (subjectId: number) =>
        selectedInstructor?.subjects.some((s) => s.id === subjectId) ?? false;

    const handleCreateInstructor = async () => {
        setYearLevel(null);
        setSemester(null);
        try {
            if (!newInstructor?.name.trim()) return;

            setIsLoading(true);
            const response = await axios.post("/api/instructor/create", {
                name: newInstructor.name,
                prof_subject_instructor: newInstructor.prof_subject_instructor,
                subjects: newInstructor.subjects,
            });

            console.log("Create instructor response:", response.data);

            const createdInstructor = response.data.data;
            console.log("test : ", createdInstructor);
            // Generate initials for the new instructor
            const initials = createdInstructor?.name
                ? createdInstructor.name
                    .split(" ")
                    .map((part: string) => part[0])
                    .join("")
                    .toUpperCase()
                : "";

            // Format the new instructor object
            const formatted = { ...createdInstructor, initials, subjects: [] };

            // Update the instructors list in real-time
            setInstructors((prev) => [...prev, formatted]);

            // Reset modal and input state
            setIsCreateModalOpen(false);
            setNewInstructor({
                id: 0,
                name: "",
                initials: "",
                prof_subject_instructor: false,
                subjects: [],
            });
            setTab("Professional Subjects");
            fetchInstructors();
        } catch (error) {
            console.error("Create instructor error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteInstructor = async (instructorId: number) => {
        if (!confirm("Are you sure you want to delete this instructor?"))
            return;

        try {
            setIsLoading(true);
            await axios.delete(`/api/instructor/${instructorId}`);
            setInstructors((prev) => prev.filter((i) => i.id !== instructorId));
        } catch (error) {
            console.error("Delete instructor error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [tab, setTab] = useState<string>("Professional Subjects");
    const handleTabChange = (newTab: string) => {
        setTab(newTab);
    };

    const [instructorCounts, setInstructorCounts] = useState<
        InstructorCount[] | null
    >(null);
    const fetchInstructorCounts = async () => {
        try {
            const response = await axios.get("/api/instructor-counts");
            const counts = response.data.data; // Assuming the API returns an object with subjectID as keys and counts as values
            setInstructorCounts(counts);
            console.log("Instructor Counts: ", counts);
        } catch (error) {
            console.error("Error fetching instructor counts:", error);
        }
    };

    const [yearLevel, setYearLevel] = useState<number | null>(null);
    const [semester, setSemester] = useState<string | null>(null);

    const filteredSubjects = allSubjects.filter((subject) => {
        const matchesYearLevel = yearLevel ? subject.year_level === yearLevel : true;
        const matchesSemester = semester ? subject.semester === semester : true;
        return matchesYearLevel && matchesSemester;
    });

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6">Instructors</h1>
            <div className="p-6">
                <div className="flex flex-col mb-6">
                    <input
                        type="text"
                        placeholder="Search instructors..."
                        className="mb-4 w-full max-w-xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <PrimaryButton
                        className="px-4 py-2 w-[10rem] rounded-md font-medium"
                        onClick={() => {
                            setIsCreateModalOpen(true);
                            setTab("Professional Subjects");
                        }}
                    >
                        Add Instructor
                    </PrimaryButton>
                </div>
                {filteredInstructors.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        No instructors added yet.
                    </div>
                ) : (
                    <table className="bg-white border-t border-l border-r border-gray-500 w-full">
                        <thead>
                            <tr>
                                <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subjects Assigned
                                </th>
                                <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 ">
                            {filteredInstructors.map((instructor) => (
                                <tr
                                    key={instructor.id}
                                    className="border-t border-gray-200 divide-x divide-gray-500"
                                >
                                    <td className="h-full bg-white flex items-center m-2 p-2 rounded    ">
                                        <h2 className="w-10 h-10 border border-gray-500 rounded-md flex items-center justify-center font-bold mr-3">
                                            {instructor.initials}
                                        </h2>
                                        <span>{instructor.name}</span>
                                    </td>
                                    <td className="bg-white w-[60rem]">
                                        <div className="flex flex-wrap gap-2 m-2 p-2 rounded">
                                            {instructor.subjects.map(
                                                (subject) => (
                                                    <span
                                                        key={subject.id}
                                                        className="border border-gray-500 px-2 py-1 text-xs rounded-md"
                                                    >
                                                        {subject.subject_code ||
                                                            subject.name}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </td>
                                    <td className="bg-white text-center gap-3">
                                        <button
                                            className="text-blue-600 p-2"
                                            onClick={() =>
                                                handleInstructorClick(
                                                    instructor
                                                )
                                            }
                                        >
                                            <Edit size={24} />
                                        </button>
                                        <button
                                            className="text-red-600 p-2"
                                            onClick={() =>
                                                handleDeleteInstructor(
                                                    instructor.id
                                                )
                                            }
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Create Instructor Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 w-[60rem]">
                            <h2 className="text-lg font-semibold mb-4">
                                Create New Instructor
                            </h2>
                            <input
                                type="text"
                                name="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                                placeholder="Enter instructor name"
                                value={newInstructor?.name}
                                onChange={(e) =>
                                    setNewInstructor((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                            />
                            <div className="flex items-center gap-4 mb-4">
                                <input
                                    type="checkbox"
                                    name="prof_subject_instructor"
                                    className=""
                                    checked={
                                        newInstructor?.prof_subject_instructor
                                    }
                                    onChange={(e) => {
                                        setNewInstructor((prev) => ({
                                            ...prev,
                                            prof_subject_instructor:
                                                e.target.checked,
                                        }));
                                        setTab("Professional Subjects");
                                    }}
                                />
                                <h2 className="font-semibold text-md underline">
                                    General Education Instructor?
                                </h2>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-medium mb-2">
                                    Current Subjects:
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {newInstructor.subjects.length > 0 ? (
                                        newInstructor.subjects.map(
                                            (subject) => (
                                                <div
                                                    key={subject.id}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md flex items-center"
                                                >
                                                    <span>
                                                        {subject.subject_code ||
                                                            subject.name}
                                                    </span>
                                                    <button
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                        onClick={() =>
                                                            setNewInstructor(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    subjects:
                                                                        prev.subjects.filter(
                                                                            (
                                                                                s
                                                                            ) =>
                                                                                s.id !==
                                                                                subject.id
                                                                        ),
                                                                })
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-500">
                                            No subjects assigned
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">
                                    Available Subjects:
                                </h3>
                                <div className="flex justify-between">
                                    <div>
                                        {newInstructor.prof_subject_instructor && (
                                            <button
                                                value="General Education"
                                                onClick={() =>
                                                    handleTabChange(
                                                        "General Education"
                                                    )
                                                }
                                                className={`${tab === "General Education"
                                                        ? "border-b-2 border-blue-500 font-semibold"
                                                        : ""
                                                    } px-4 py-2`}
                                            >
                                                {" "}
                                                General Education
                                            </button>
                                        )}
                                        <button
                                            value="Professional Subjects"
                                            onClick={() =>
                                                handleTabChange(
                                                    "Professional Subjects"
                                                )
                                            }
                                            className={`${tab === "Professional Subjects"
                                                    ? "border-b-2 border-blue-500 font-semibold"
                                                    : ""
                                                } px-4 py-2`}
                                        >
                                            Professional Subjects
                                        </button>
                                    </div>
                                    {tab !== "General Education" && (
                                        <div>
                                            <select
                                                onChange={(e) =>
                                                    setSemester(e.target.value)
                                                }
                                            >
                                                <option value="">
                                                    Select Semester
                                                </option>
                                                <option value="1st">
                                                    1st Semester
                                                </option>
                                                <option value="2nd">
                                                    2nd Semester
                                                </option>
                                                <option value="summer">
                                                    Summer
                                                </option>
                                            </select>
                                            <select
                                                onChange={(e) =>
                                                    setYearLevel(
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                            >
                                                <option value="">Select Year Level</option>
                                                <option value="1">1st Year</option>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                                <option value="4">4th Year</option>
                                            </select>
                                        </div>
                                    )}

                                </div>

                                {tab === "Professional Subjects" ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[40rem] overflow-y-auto">
                                        {filteredSubjects
                                            .filter(
                                                (subject) =>
                                                    subject.prof_subject
                                            )
                                            .map((subject) => (
                                                <button
                                                    key={subject.id}
                                                    className={`px-3 py-2 rounded-md text-left ${newInstructor.subjects.some(
                                                        (s) =>
                                                            s.id ===
                                                            subject.id
                                                    )
                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            : "bg-gray-100 hover:bg-gray-200"
                                                        }`}
                                                    onClick={() => {
                                                        if (
                                                            !newInstructor.subjects.some(
                                                                (s) =>
                                                                    s.id ===
                                                                    subject.id
                                                            )
                                                        ) {
                                                            setNewInstructor(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    subjects: [
                                                                        ...prev.subjects,
                                                                        subject,
                                                                    ],
                                                                })
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        newInstructor.subjects.some(
                                                            (s) =>
                                                                s.id ===
                                                                subject.id
                                                        ) || isLoading
                                                    }
                                                >
                                                    <div className="font-medium">
                                                        {subject.subject_code}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {subject.name}
                                                    </div>
                                                </button>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[40rem] overflow-y-auto">
                                        {filteredSubjects
                                            .filter(
                                                (subject) =>
                                                    !subject.prof_subject
                                            )
                                            .map((subject) => (
                                                <button
                                                    key={subject.id}
                                                    className={`px-3 py-2 rounded-md text-left ${newInstructor.subjects.some(
                                                        (s) =>
                                                            s.id ===
                                                            subject.id
                                                    )
                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            : "bg-gray-100 hover:bg-gray-200"
                                                        }`}
                                                    onClick={() => {
                                                        if (
                                                            !newInstructor.subjects.some(
                                                                (s) =>
                                                                    s.id ===
                                                                    subject.id
                                                            )
                                                        ) {
                                                            setNewInstructor(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    subjects: [
                                                                        ...prev.subjects,
                                                                        subject,
                                                                    ],
                                                                })
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        newInstructor.subjects.some(
                                                            (s) =>
                                                                s.id ===
                                                                subject.id
                                                        ) || isLoading
                                                    }
                                                >
                                                    <div className="font-medium">
                                                        {subject.subject_code}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {subject.name}
                                                    </div>
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(false)
                                        setYearLevel(null)
                                        setSemester(null)
                                    }}
                                    className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateInstructor}
                                    disabled={isLoading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    {isLoading ? "Saving..." : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subject Management Modal */}
                {isModalOpen && selectedInstructor && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-[60rem]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    Manage Subjects for{" "}
                                    {selectedInstructor.name}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-medium mb-2">
                                    Current Subjects:
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedInstructor.subjects.length > 0 ? (
                                        selectedInstructor.subjects.map(
                                            (subject) => (
                                                <div
                                                    key={subject.id}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md flex items-center"
                                                >
                                                    <span>
                                                        {subject.subject_code ||
                                                            subject.name}
                                                    </span>
                                                    <button
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                        onClick={() =>
                                                            removeSubjectFromInstructor(
                                                                selectedInstructor.id,
                                                                subject.id
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-500">
                                            No subjects assigned
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">
                                    Available Subjects:
                                </h3>
                                <div className="flex justify-between">
                                    <div>
                                        {!selectedInstructor.prof_subject_instructor && (
                                            <button
                                                value="General Education"
                                                onClick={() =>
                                                    handleTabChange(
                                                        "General Education"
                                                    )
                                                }
                                                className={`${tab === "General Education"
                                                        ? "border-b-2 border-blue-500 font-semibold"
                                                        : ""
                                                    } px-4 py-2`}
                                            >
                                                {" "}
                                                General Education
                                            </button>
                                        )}
                                        <button
                                            value="Professional Subjects"
                                            onClick={() =>
                                                handleTabChange(
                                                    "Professional Subjects"
                                                )
                                            }
                                            className={`${tab === "Professional Subjects"
                                                    ? "border-b-2 border-blue-500 font-semibold"
                                                    : ""
                                                } px-4 py-2`}
                                        >
                                            Professional Subjects
                                        </button>
                                    </div>
                                    <div>
                                        <select
                                            onChange={(e) =>
                                                setSemester(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Select Semester
                                            </option>
                                            <option value="1st">
                                                1st Semester
                                            </option>
                                            <option value="2nd">
                                                2nd Semester
                                            </option>
                                            <option value="summer">
                                                Summer
                                            </option>
                                        </select>
                                        <select
                                            onChange={(e) =>
                                                setYearLevel(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        >
                                            <option value="">Select Year Level</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                </div>

                                {tab === "Professional Subjects" ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[40rem] overflow-y-auto">
                                        {filteredSubjects
                                            .filter(
                                                (subject) =>
                                                    subject.prof_subject
                                            )
                                            .map((subject) => (
                                                <button
                                                    key={subject.id}
                                                    className={`px-3 py-2 rounded-md text-left ${isSubjectAssigned(
                                                        subject.id
                                                    )
                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            : "bg-gray-100 hover:bg-gray-200"
                                                        }`}
                                                    onClick={() => {
                                                        if (
                                                            !isSubjectAssigned(
                                                                subject.id
                                                            )
                                                        ) {
                                                            addSubjectToInstructor(
                                                                selectedInstructor.id,
                                                                subject.id
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        isSubjectAssigned(
                                                            subject.id
                                                        ) || isLoading
                                                    }
                                                >
                                                    <div className="font-medium">
                                                        {subject.subject_code}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {subject.name}
                                                    </div>
                                                    <label className="justify-end flex">
                                                        {instructorCounts?.filter(
                                                            (count) =>
                                                                count.subject_code ===
                                                                subject.id
                                                        )[0]
                                                            ?.instructor_count ||
                                                            0}
                                                    </label>
                                                </button>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[40rem] overflow-y-auto">
                                        {filteredSubjects
                                            .filter(
                                                (subject) =>
                                                    !subject.prof_subject
                                            )
                                            .map((subject) => (
                                                <button
                                                    key={subject.id}
                                                    className={`px-3 py-2 rounded-md text-left ${isSubjectAssigned(
                                                        subject.id
                                                    )
                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            : "bg-gray-100 hover:bg-gray-200"
                                                        }`}
                                                    onClick={() => {
                                                        if (
                                                            !isSubjectAssigned(
                                                                subject.id
                                                            )
                                                        ) {
                                                            addSubjectToInstructor(
                                                                selectedInstructor.id,
                                                                subject.id
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        isSubjectAssigned(
                                                            subject.id
                                                        ) || isLoading
                                                    }
                                                >
                                                    <div className="font-medium">
                                                        {subject.subject_code}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {subject.name}
                                                    </div>
                                                    <label className="justify-end flex">
                                                        {instructorCounts?.filter(
                                                            (count) =>
                                                                count.subject_code ===
                                                                subject.id
                                                        )[0]
                                                            ?.instructor_count ||
                                                            0}
                                                    </label>
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setYearLevel(null)
                                        setSemester(null)
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default InstructorsPage;
