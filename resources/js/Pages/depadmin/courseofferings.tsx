import React, { useEffect, useState } from "react";
import Layout from "@/Components/ui/layout";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import { Upload, Edit, Trash, Trash2, X } from "lucide-react";

interface Curriculum {
    id: number;
    department_short_name: string;
    curriculum_name: string;
    program_name: string;
    program_short_name: string;
}

interface Section {
    id: number;
    section_name: string;
    program_short_name: string;
    year_level: number;
    semester: string;
}

interface CourseSubject {
    id: number;
    name: string;
    program_short_name: string;
    subject_code: string;
    semester: string;
    year_level: number;
    lec: number;
    lab: number;
}

interface Subject {
    name: string;
    prof_sub: boolean;
    room_req: number;
    lec: number;
    lab: number;
    semester: string;
    subject_code: string;
    year_level: number;
}

interface uploadedCurriculum {
    curriculum_name: string;
    department_short_name: string;
    program_name: string;
    program_short_name: string;
    subjects: Subject[];
}
const CourseOfferingsPage: React.FC = () => {
    const [openSectionMenu, setOpenSectionMenu] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"Course Offerings" | "Sections">(
        "Course Offerings"
    );
    const handleSwitchTabs = (tabName: string) => {
        setOpenSectionMenu(null);
        if (tabName == "Course Offerings") {
            setActiveTab("Course Offerings");
        } else {
            setActiveTab("Sections");
            fetchSections();
        }
    };

    const [showCurriculumCourses, setShowCurriculumCourses] =
        useState<boolean>(false);
    const [selectedCurriculum, setSelectedCurriculum] =
        useState<Curriculum | null>(null);
    const handleShowCurriculumCourses = (curriculum: Curriculum) => {
        setSelectedCurriculum(curriculum);
        setShowCurriculumCourses(true);
        fetchCourseSubjects(curriculum);
    };

    const handleCloseCurriculum = () => {
        setSelectedCurriculum(null);
        setShowCurriculumCourses(false);
        setCourseSubjects([]);
    };

    const [curriculum, setCurriculum] = useState<Curriculum[]>([]);
    const fetchCurriculum = async () => {
        try {
            const response = await axios.get("/api/curriculum");
            console.log("Curriculum: ", response.data.data);
            setCurriculum(response.data.data);
        } catch (error) {
            console.error("Error fetching curriculum:", error);
        }
    };

    const [sections, setSections] = useState<Section[]>([]);
    const fetchSections = async () => {
        try {
            const response = await axios.get("/api/section");
            setSections(response.data.data);
            console.log("Sections: ", response.data.data);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };

    const [courseSubjects, setCourseSubjects] = useState<CourseSubject[]>([]);
    const fetchCourseSubjects = async (request: Curriculum) => {
        try {
            const response = await axios.post("/api/course-subject", {
                program_short_name: request.program_short_name,
                curriculum_name: request.curriculum_name,
            });
            setCourseSubjects(response.data.data);
            console.log("Course Subjects: ", response.data.data);
        } catch (error) {
            console.error("Error fetching course subjects:", error);
        }
    };
    const [selectedYearLevel, setSelectedYearLevel] =
        useState<string>("Year Level");
    const [selectedSemester, setSelectedSemester] =
        useState<string>("First Semester");
    {
        /*course subjects api*/
    }

    {
        /*add curriculum pop up*/
    }
    const [showAddCurriculum, setShowAddCurriculum] = useState<boolean>(false);
    const handleToggleCurriculumPopup = () => {
        setShowAddCurriculum(!showAddCurriculum);
        setCurriculumUploaded(null);
        setUploadSuccess(false);
    };

    const handleCreateCurriculum = (curriculum: uploadedCurriculum) => {
        try {
            const response = axios.post("/api/curriculum/create", curriculum);
            console.log("Curriculum added: ", response);
            window.alert("Curriculum added!");
        } catch (error) {
            console.error("Error adding curriculum:", error);
            window.alert("Curriculum added failed!");
        }
    };

    useEffect(() => {
        fetchCurriculum();
        fetchSections();
    }, []);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

    const [curriculumUploaded, setCurriculumUploaded] =
        useState<uploadedCurriculum | null>(null);
    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
            setUploadError(null);
        }
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!uploadedFile) {
            setUploadError("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        const formData = new FormData();
        formData.append("curriculum_file", uploadedFile);

        try {
            const response = await axios.post(
                "/api/curriculum/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const uploadedCurriculum = response.data.data.curriculum;
            setCurriculumUploaded(uploadedCurriculum);
        } catch (error) {
            console.error("Error uploading curriculum:", error);
            setUploadError("Failed to upload curriculum. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };
    const handleEditCurriculum = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurriculumUploaded(
            (prevCurriculum) =>
            ({
                ...prevCurriculum,
                [name]: value || "", // Ensure the value is never undefined
            } as uploadedCurriculum)
        );
    };
    {
        /*add section pop up*/
    }
    const [sectionName, setSectionName] = useState<string>("");
    const [addSectionPopup, setAddSectionPopup] = useState<boolean>(false);
    const handleAddSection = () => {
        setAddSectionPopup(!addSectionPopup);
        try {
            const yearLevelMap: { [key: string]: number } = {
                "First Year": 1,
                "Second Year": 2,
                "Third Year": 3,
                "Fourth Year": 4,
            };
            const response = axios.post("/api/section/create", {
                section_name: sectionName,
                program_short_name: selectedCurriculum?.program_short_name,
                curriculum_name: selectedCurriculum?.curriculum_name,
                year_level: yearLevelMap[yearLevelCourse],
            });
            fetchSections();
        } catch (error) {
            console.log("Error in creating section: ", error);
        }
    };

    const handleSelectCurriculum = (request: Curriculum) => {
        setSelectedCurriculum(request);
        fetchCourseSubjects(request);
        console.log("curriculum set success");
    };
    const handleToggleAddSection = () => {
        setAddSectionPopup(!addSectionPopup);
        setSelectedCurriculum(null);
        setCourseSubjects([]);
        setYearLevelCourse("Year Level");
        setSelectedSemester("First Semester");
        setSectionName("");
    };
    const [yearLevelCourse, setYearLevelCourse] =
        useState<string>("Year Level");

    const handleDeleteSection = async (sectionID: number) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this section? This action cannot be undone."
        );

        if (!confirmDelete) {
            return; // Exit if the user cancels the action
        }

        try {
            const response = await axios.delete(
                `/api/section/delete/${sectionID}`
            );
            console.log("Section deleted: ", response);
            fetchSections(); // Refresh the sections list
        } catch (error) {
            console.error("Error deleting section:", error);
        }
    };
    const handleEditUploadedCurriculum = (subject: Subject) => {
        setCurriculumUploaded((prevCurriculum) => {
            if (!prevCurriculum) return null; // Handle case where prevCurriculum is null

            const updatedSubjects = prevCurriculum.subjects.map((sub) => {
                if (sub.subject_code === subject.subject_code) {

                    console.log("Modified subject", sub);
                    return { ...sub, prof_sub: !sub.prof_sub };
                }
                return sub;
            });

            return {
                ...prevCurriculum,
                subjects: updatedSubjects,
            } as uploadedCurriculum;
        }
        );
    };

    return (
        <Layout>
            <h1 className="font-bold text-2xl mb-4">Curriculum</h1>
            <main className="col-span-3 space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-lg">
                    {/* Tabs */}
                    <div className="flex border-b mb-4">
                        <button
                            className={`px-4 py-2 ${activeTab === "Course Offerings"
                                ? "border-b-2 border-blue-500 font-semibold"
                                : ""
                                }`}
                            onClick={() => handleSwitchTabs("Course Offerings")}
                        >
                            Course Offerings
                        </button>
                        <button
                            className={`px-4 py-2 ${activeTab === "Sections"
                                ? "border-b-2 border-blue-500 font-semibold"
                                : ""
                                }`}
                            onClick={() => handleSwitchTabs("Sections")}
                        >
                            Sections
                        </button>
                    </div>

                    {/* Course Offerings Tab */}
                    {activeTab === "Course Offerings" && (
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
                            <div className="flex justify-between mb-4">
                                <PrimaryButton
                                    onClick={handleToggleCurriculumPopup}
                                    className="bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg"
                                >
                                    New Curriculum
                                </PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                {curriculum.length === 0 ? (
                                    <div className="flex justify-center items-center h-64">
                                        <p className="text-gray-500">
                                            No curriculum added yet.
                                        </p>
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Curriculum
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Program
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Department
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {curriculum.map((curr, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {curr.curriculum_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {curr.program_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {curr.department_short_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button
                                                            onClick={() =>
                                                                handleShowCurriculumCourses(
                                                                    curr
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View Curriculum
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                            </div>
                        </div>
                    )}
                    {showCurriculumCourses && selectedCurriculum && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl shadow-full">
                                <h2 className="text-2xl font-semibold mb-4">
                                    {selectedCurriculum.program_name}
                                </h2>
                                <h2 className="text-2xl font-semibold mb-4">
                                    {selectedCurriculum.curriculum_name}
                                </h2>

                                <h1 className="text-xl font-semibold mt-10">
                                    Subjects
                                </h1>
                                <div className="grid grid-cols-2 gap-4 mb-4 justify-end">
                                    <div className="w-1/2"></div>
                                    <div className="col-span-2">
                                        <button
                                            value="First Year"
                                            onClick={() =>
                                                setSelectedYearLevel(
                                                    "First Year"
                                                )
                                            }
                                            className={`px-4 py-2 ${selectedYearLevel ===
                                                "First Year"
                                                ? "border-b-2 border-blue-500 font-semibold"
                                                : ""
                                                }`}
                                        >
                                            First Year
                                        </button>
                                        <button
                                            value="Second Year"
                                            onClick={() =>
                                                setSelectedYearLevel(
                                                    "Second Year"
                                                )
                                            }
                                            className={`px-4 py-2 ${selectedYearLevel ===
                                                "Second Year"
                                                ? "border-b-2 border-blue-500 font-semibold"
                                                : ""
                                                }`}
                                        >
                                            Second Year
                                        </button>
                                        <button
                                            value="Third Year"
                                            onClick={() =>
                                                setSelectedYearLevel(
                                                    "Third Year"
                                                )
                                            }
                                            className={`px-4 py-2 ${selectedYearLevel ===
                                                "Third Year"
                                                ? "border-b-2 border-blue-500 font-semibold"
                                                : ""
                                                }`}
                                        >
                                            Third Year
                                        </button>
                                        <button
                                            value="Fourth Year"
                                            onClick={() =>
                                                setSelectedYearLevel(
                                                    "Fourth Year"
                                                )
                                            }
                                            className={`px-4 py-2 ${selectedYearLevel ===
                                                "Fourth Year"
                                                ? "border-b-2 border-blue-500 font-semibold"
                                                : ""
                                                }`}
                                        >
                                            Fourth Year
                                        </button>
                                        <select
                                            key="semester"
                                            className=" appearance-none bg-gray-200 rounded-lg w-1/4.5"
                                            value={selectedSemester}
                                            onChange={(e) =>
                                                setSelectedSemester(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option>First Semester</option>
                                            <option>Second Semester</option>
                                            <option>Summer</option>
                                        </select>
                                    </div>
                                </div>

                                <h3 className="font-semibold mb-2">Subjects</h3>
                                <div className="bg-gray-200 p-3 rounded-lg max-h-64 overflow-y-auto">
                                    {courseSubjects
                                        .filter((subject) => {
                                            const yearLevelMap: {
                                                [key: string]: number;
                                            } = {
                                                "First Year": 1,
                                                "Second Year": 2,
                                                "Third Year": 3,
                                                "Fourth Year": 4,
                                            };
                                            const semesterMap: {
                                                [key: string]: string;
                                            } = {
                                                "First Semester": "1st",
                                                "Second Semester": "2nd",
                                                Summer: "summer",
                                            };

                                            return (
                                                subject.year_level ===
                                                yearLevelMap[
                                                selectedYearLevel
                                                ] &&
                                                subject.semester ===
                                                semesterMap[
                                                selectedSemester
                                                ]
                                            );
                                        })
                                        .map((subject) => (
                                            <div
                                                key={subject.id}
                                                className="bg-gray-700 text-white p-3 rounded-full mb-2 grid grid-cols-4"
                                            >
                                                <label className="text-xl font-bold flex items-center justify-center">
                                                    {subject.subject_code}
                                                </label>
                                                <label className="p-4 truncate overflow-hidden whitespace-nowrap col-span-1">
                                                    {subject.name}
                                                </label>
                                                <label className="p-4">
                                                    Lec Hr: {subject.lec}
                                                </label>
                                                <label className="p-4">
                                                    Lab Hr: {subject.lab}
                                                </label>
                                            </div>
                                        ))}
                                </div>

                                <div className="flex justify-start space-x-2 mt-4">
                                    <button
                                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                        onClick={handleCloseCurriculum}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/*adding curriculum pop up*/}
                    {showAddCurriculum && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Add Curriculum
                                </h2>

                                <div className="flex flex-col items-center justify-center mb-4">
                                    <label
                                        className={`bg-blue-500 hover:bg-blue-400 h-[200px] w-[350px] rounded-lg flex flex-col items-center justify-center text-white font-semibold mb-4 cursor-pointer transition-all ${uploadedFile
                                            ? "bg-green-500 hover:bg-green-400"
                                            : ""
                                            }`}
                                    >
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                                        />
                                        <Upload size={48} />
                                        {uploadedFile ? (
                                            <span className="mt-2">
                                                {uploadedFile.name}
                                            </span>
                                        ) : (
                                            <span className="mt-2">
                                                Upload Curriculum
                                            </span>
                                        )}
                                    </label>

                                    {uploadError && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {uploadError}
                                        </p>
                                    )}

                                    {uploadSuccess && (
                                        <p className="text-green-500 text-sm mt-1">
                                            Upload successful!
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-center items-center">
                                    <PrimaryButton
                                        className="bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg disabled:bg-red"
                                        onClick={handleFileUpload}
                                        disabled={isUploading || !uploadedFile}
                                    >
                                        {isUploading
                                            ? "Uploading..."
                                            : "Upload Curriculum"}
                                    </PrimaryButton>
                                </div>

                                <div></div>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                    onClick={handleToggleCurriculumPopup}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                    {/*adding curriculum pop up*/}
                    {/*adding curriculum pop up*/}
                    {showAddCurriculum &&
                        (curriculumUploaded ? (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 ">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 shadow-full max-h-[850px] h-[90vh] overflow-y-auto">
                                    <h2>Curriculum Name</h2>
                                    <input
                                        className="text-2xl font-semibold mb-4 border border-gray-300 rounded-lg p-2 w-full"
                                        value={
                                            curriculumUploaded.curriculum_name
                                        }
                                        name="curriculum_name"
                                        type="text"
                                        onChange={handleEditCurriculum}
                                    />
                                    <h2>Program Name</h2>
                                    <input
                                        className="text-2xl font-semibold mb-4 border border-gray-300 rounded-lg p-2 w-full"
                                        value={curriculumUploaded.program_name}
                                        name="program_name"
                                        type="text"
                                        onChange={handleEditCurriculum}
                                    />
                                    <h2>Program Short Name</h2>
                                    <input
                                        className="text-2xl font-semibold mb-4 border border-gray-300 rounded-lg p-2 w-full"
                                        value={
                                            curriculumUploaded.program_short_name
                                        }
                                        name="program_short_name"
                                        type="text"
                                        onChange={handleEditCurriculum}
                                    />
                                    <h1 className="text-xl font-semibold mt-10">
                                        Subjects
                                    </h1>
                                    <div className="grid grid-cols-2 gap-4 mb-4 justify-end">
                                        <div className="w-1/2"></div>
                                        <div className="col-span-2">
                                            <button
                                                value="First Year"
                                                onClick={() =>
                                                    setSelectedYearLevel(
                                                        "First Year"
                                                    )
                                                }
                                                className={`px-4 py-2 ${selectedYearLevel ===
                                                    "First Year"
                                                    ? "border-b-2 border-blue-500 font-semibold"
                                                    : ""
                                                    }`}
                                            >
                                                First Year
                                            </button>
                                            <button
                                                value="Second Year"
                                                onClick={() =>
                                                    setSelectedYearLevel(
                                                        "Second Year"
                                                    )
                                                }
                                                className={`px-4 py-2 ${selectedYearLevel ===
                                                    "Second Year"
                                                    ? "border-b-2 border-blue-500 font-semibold"
                                                    : ""
                                                    }`}
                                            >
                                                Second Year
                                            </button>
                                            <button
                                                value="Third Year"
                                                onClick={() =>
                                                    setSelectedYearLevel(
                                                        "Third Year"
                                                    )
                                                }
                                                className={`px-4 py-2 ${selectedYearLevel ===
                                                    "Third Year"
                                                    ? "border-b-2 border-blue-500 font-semibold"
                                                    : ""
                                                    }`}
                                            >
                                                Third Year
                                            </button>
                                            <button
                                                value="Fourth Year"
                                                onClick={() =>
                                                    setSelectedYearLevel(
                                                        "Fourth Year"
                                                    )
                                                }
                                                className={`px-4 py-2 ${selectedYearLevel ===
                                                    "Fourth Year"
                                                    ? "border-b-2 border-blue-500 font-semibold"
                                                    : ""
                                                    }`}
                                            >
                                                Fourth Year
                                            </button>
                                            <select
                                                key="semester"
                                                className=" appearance-none bg-gray-200 rounded-lg w-1/4.5"
                                                value={selectedSemester}
                                                onChange={(e) =>
                                                    setSelectedSemester(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option>First Semester</option>
                                                <option>Second Semester</option>
                                                <option>Summer</option>
                                            </select>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold mb-2">
                                        Subjects
                                    </h3>
                                    <div className="bg-gray-200 p-3 rounded-lg max-h-64 overflow-y-auto">
                                        {curriculumUploaded?.subjects &&
                                            curriculumUploaded.subjects
                                                .filter((subject) => {
                                                    const yearLevelMap: {
                                                        [key: string]: number;
                                                    } = {
                                                        "First Year": 1,
                                                        "Second Year": 2,
                                                        "Third Year": 3,
                                                        "Fourth Year": 4,
                                                    };
                                                    const semesterMap: {
                                                        [key: string]: string;
                                                    } = {
                                                        "First Semester": "1st",
                                                        "Second Semester":
                                                            "2nd",
                                                        Summer: "summer",
                                                    };

                                                    return (
                                                        subject.year_level ===
                                                        yearLevelMap[
                                                        selectedYearLevel
                                                        ] &&
                                                        subject.semester ===
                                                        semesterMap[
                                                        selectedSemester
                                                        ]
                                                    );
                                                })
                                                .map((subject) => (
                                                    <div
                                                        key={
                                                            subject.subject_code
                                                        }
                                                        className="bg-gray-700 text-white p-3 rounded-full mb-2 grid grid-cols-5"
                                                    >
                                                        <div className="grid grid-cols-2 pl-5 flex items-center justify-center">
                                                            <h2>Prof. Sub?</h2>
                                                            <input type="checkbox"
                                                                name="prof_sub"
                                                                className="h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                checked={
                                                                    subject.prof_sub
                                                                }
                                                                onChange={() => handleEditUploadedCurriculum(subject)}
                                                            />
                                                        </div>
                                                        <label className="text-xl font-bold flex items-center justify-center">
                                                            {
                                                                subject.subject_code
                                                            }
                                                        </label>
                                                        <label className="p-4 truncate overflow-hidden whitespace-nowrap col-span-1">
                                                            {subject.name}
                                                        </label>
                                                        <label className="p-4">
                                                            Lec Hr:{" "}
                                                            {subject.lec}
                                                        </label>
                                                        <label className="p-4">
                                                            Lab Hr:{" "}
                                                            {subject.lab}
                                                        </label>
                                                    </div>
                                                ))}
                                    </div>

                                    <div className="flex justify-between space-x-2 mt-4">
                                        <button
                                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                            onClick={() =>
                                                handleCreateCurriculum(
                                                    curriculumUploaded
                                                )
                                            }
                                        >
                                            Add Curriculum
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                            onClick={
                                                handleToggleCurriculumPopup
                                            }
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        Add Curriculum
                                    </h2>

                                    <div className="flex flex-col items-center justify-center mb-4">
                                        <label
                                            className={`bg-blue-500 hover:bg-blue-400 h-[200px] w-[350px] rounded-lg flex flex-col items-center justify-center text-white font-semibold mb-4 cursor-pointer transition-all ${uploadedFile
                                                ? "bg-green-500 hover:bg-green-400"
                                                : ""
                                                }`}
                                        >
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                                            />
                                            <Upload size={48} />
                                            {uploadedFile ? (
                                                <span className="mt-2">
                                                    {uploadedFile.name}
                                                </span>
                                            ) : (
                                                <span className="mt-2">
                                                    Upload Curriculum
                                                </span>
                                            )}
                                        </label>

                                        {uploadError && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {uploadError}
                                            </p>
                                        )}

                                        {uploadSuccess && (
                                            <p className="text-green-500 text-sm mt-1">
                                                Upload successful!
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-center items-center">
                                        <PrimaryButton
                                            className="bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg disabled:bg-red"
                                            onClick={handleFileUpload}
                                            disabled={
                                                isUploading || !uploadedFile
                                            }
                                        >
                                            {isUploading
                                                ? "Uploading..."
                                                : "Upload Curriculum"}
                                        </PrimaryButton>
                                    </div>

                                    <div></div>
                                    <button
                                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                        onClick={handleToggleCurriculumPopup}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ))}
                    {/* Sections Tab */}
                    {activeTab === "Sections" && (
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
                            <div className="flex grid grid-cols-2 mb-4">

                                <div>
                                    <PrimaryButton
                                        onClick={handleToggleAddSection}
                                        className="ml-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                    >
                                        Add Section
                                    </PrimaryButton>
                                </div>
                                {sections.length === 0 ? (
                                    <div className="text-center text-gray-500 row-start-2 flex items-center justify-center w-full col-span-2 my-20"> 
                                    No Sections created yet.
                                </div>
                                ) : (
                                    <>
                                        <div className="flex w-full justify-end gap-10">
                                            <select
                                                className="border border-gray-300 rounded-lg p-2 w-1/3"
                                                value={selectedYearLevel}
                                                onChange={(e) =>
                                                    setSelectedYearLevel(e.target.value)
                                                }
                                            >
                                                <option value="">
                                                    All Year Levels
                                                </option>
                                                <option value="First Year">
                                                    First Year
                                                </option>
                                                <option value="Second Year">
                                                    Second Year
                                                </option>
                                                <option value="Third Year">
                                                    Third Year
                                                </option>
                                                <option value="Fourth Year">
                                                    Fourth Year
                                                </option>
                                            </select>
                                            <select
                                                className="border border-gray-300 rounded-lg p-2 w-1/3"
                                                onChange={(e) =>
                                                    setSelectedCurriculum(
                                                        curriculum.find(
                                                            (curr) =>
                                                                curr.program_short_name ===
                                                                e.target.value
                                                        ) || null
                                                    )
                                                }
                                            >
                                                <option value="">All Programs</option>
                                                {curriculum
                                                    .filter(
                                                        (curr, index, self) =>
                                                            self.findIndex(
                                                                (item) =>
                                                                    item.program_short_name ===
                                                                    curr.program_short_name
                                                            ) === index
                                                    )
                                                    .map((curr) => (
                                                        <option
                                                            key={curr.id}
                                                            value={
                                                                curr.program_short_name
                                                            }
                                                        >
                                                            {curr.program_short_name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="overflow-x-auto col-span-2">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Section
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Program
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Year Level
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {sections
                                                        .filter((section) => {
                                                            const yearLevelMap: {
                                                                [key: string]: number;
                                                            } = {
                                                                "First Year": 1,
                                                                "Second Year": 2,
                                                                "Third Year": 3,
                                                                "Fourth Year": 4,
                                                            };

                                                            if (
                                                                selectedYearLevel ==
                                                                "Year Level" &&
                                                                selectedCurriculum === null
                                                            ) {
                                                                return true;
                                                            } else if (
                                                                selectedCurriculum !==
                                                                null &&
                                                                selectedYearLevel ==
                                                                "Year Level"
                                                            ) {
                                                                return (
                                                                    section.program_short_name ===
                                                                    selectedCurriculum?.program_short_name
                                                                );
                                                            }
                                                            return (
                                                                (!selectedCurriculum ||
                                                                    section.program_short_name ===
                                                                    selectedCurriculum?.program_short_name) &&
                                                                (!selectedYearLevel ||
                                                                    section.year_level ===
                                                                    yearLevelMap[
                                                                    selectedYearLevel
                                                                    ])
                                                            );
                                                        })
                                                        .map((section) => (
                                                            <tr
                                                                key={section.id}
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {section.section_name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {
                                                                        section.program_short_name
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {section.year_level}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    <button
                                                                        className="text-red-500 hover:text-red-700 ml-4"
                                                                        onClick={() =>
                                                                            handleDeleteSection(
                                                                                section.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        </>
                                )}

                            </div>


                        </div>
                    )}
                </div>
                {addSectionPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    Add Section
                                </h2>
                            </div>
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Section Name"
                                    value={sectionName}
                                    onChange={(e) =>
                                        setSectionName(e.target.value)
                                    }
                                    className="p-3 bg-gray-200 rounded-lg mb-4 w-full"
                                />
                                <select
                                    onChange={(e) => {
                                        const selectedCurriculum =
                                            curriculum.find(
                                                (curr) =>
                                                    curr.curriculum_name ===
                                                    e.target.value
                                            );
                                        if (selectedCurriculum) {
                                            handleSelectCurriculum(
                                                selectedCurriculum
                                            );
                                        }
                                    }}
                                    className="appearance-none bg-gray-200 p-3 rounded-lg w-full"
                                >
                                    <option>Curriculum</option>
                                    {curriculum.map((curriculum, idx) => (
                                        <option
                                            key={idx}
                                            value={curriculum.curriculum_name}
                                        >
                                            {curriculum.curriculum_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 justify-end">
                                <select
                                    onChange={(e) =>
                                        setYearLevelCourse(e.target.value)
                                    }
                                    className="appearance-none bg-gray-200 rounded-lg"
                                >
                                    <option>Year Level</option>
                                    <option value="First Year">
                                        First Year
                                    </option>
                                    <option value="Second Year">
                                        Second Year
                                    </option>
                                    <option value="Third Year">
                                        Third Year
                                    </option>
                                    <option value="Fourth Year">
                                        Fourth Year
                                    </option>
                                </select>
                                <select
                                    key="semester"
                                    className="appearance-none bg-gray-200 rounded-lg"
                                    value={selectedSemester}
                                    onChange={(e) =>
                                        setSelectedSemester(e.target.value)
                                    }
                                >
                                    <option>First Semester</option>
                                    <option>Second Semester</option>
                                    <option>Summer</option>
                                </select>
                            </div>
                            <h3 className="font-semibold mb-2">Subjects</h3>
                            <div className="bg-gray-200 p-3 rounded-lg max-h-48 overflow-y-auto mb-4">
                                {courseSubjects
                                    .filter((subject) => {
                                        const yearLevelMap: {
                                            [key: string]: number;
                                        } = {
                                            "First Year": 1,
                                            "Second Year": 2,
                                            "Third Year": 3,
                                            "Fourth Year": 4,
                                        };
                                        const semesterMap: {
                                            [key: string]: string;
                                        } = {
                                            "First Semester": "1st",
                                            "Second Semester": "2nd",
                                            Summer: "summer",
                                        };

                                        return (
                                            subject.year_level ===
                                            yearLevelMap[yearLevelCourse] &&
                                            subject.semester ===
                                            semesterMap[selectedSemester]
                                        );
                                    })
                                    .map((subject, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-700 text-white p-3 rounded-full mb-2 grid grid-cols-4"
                                        >
                                            <label className="text-xl font-bold flex items-center justify-center">
                                                {subject.subject_code}
                                            </label>
                                            <label className="p-4 truncate overflow-hidden whitespace-nowrap col-span-1">
                                                {subject.name}
                                            </label>
                                            <label className="p-4">
                                                Lec Hr: {subject.lec}
                                            </label>
                                            <label className="p-4">
                                                Lab Hr: {subject.lab}
                                            </label>
                                        </div>
                                    ))}
                            </div>

                            <div className="space-x-2">
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                    onClick={handleAddSection}
                                >
                                    Add Section
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                    onClick={handleToggleAddSection}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </Layout>
    );
};

export default CourseOfferingsPage;
