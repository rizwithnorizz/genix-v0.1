import React, { useEffect, useState } from "react";
import Layout from "@/Components/ui/layout";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import { Upload, Edit, Trash, Trash2, X, PlusCircle, Plus } from "lucide-react";

interface Curriculum {
    id: number;
    curriculum_name: string;
    curriculumID: number;
    programID: number;
    program_name: string;
    program_short_name: string;
}

interface Section {
    id: number;
    section_name: string;
    population: number;
    programID: number;
    program_short_name: string;
    year_level: number;
    semester: string;
}

interface CourseSubject {
    id: number;
    name: string;
    programID: number;
    subjectID: number;
    subject_code: string;
    semester: string;
    year_level: number;
    lec: number;
    lab: number;
}

interface Subject {
    id: number;
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

    {
        /*fetch section information*/
    }
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

    const [selectedYearLevel, setSelectedYearLevel] =
        useState<string>("Year Level");
    const [selectedSemester, setSelectedSemester] =
        useState<string>("First Semester");
    const filteredSections = sections.filter((section) => {
        const yearLevelMap: {
            [key: string]: number;
        } = {
            "First Year": 1,
            "Second Year": 2,
            "Third Year": 3,
            "Fourth Year": 4,
        };
        const yearLevelMatch = yearLevelMap[selectedYearLevel]
            ? section.year_level === yearLevelMap[selectedYearLevel]
            : true;
        const programMatch = selectedCurriculum?.programID
            ? section.programID === selectedCurriculum.programID
            : true;
        return yearLevelMatch && programMatch;
    });
    {
        /*fetch course subjects*/
    }
    const [courseSubjects, setCourseSubjects] = useState<CourseSubject[]>([]);
    const fetchCourseSubjects = async (request: Curriculum) => {
        try {
            const response = await axios.put("/api/course-subject", {
                programID: request.programID,
                curriculumID: request.curriculumID,
            });
            setCourseSubjects(response.data.data);
            console.log("Course Subjects: ", response.data.data);
        } catch (error) {
            console.error("Error fetching course subjects:", error);
        }
    };
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
            handleToggleCurriculumPopup();
            fetchCurriculum();
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
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
            setUploadError(null);
        }
    };

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
            setLoading(true);
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
            setLoading(false);
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
    const [population, setPopulation] = useState<number>(0);
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
                programID: selectedCurriculum?.programID,
                curriculumID: selectedCurriculum?.curriculumID,
                year_level: yearLevelMap[yearLevelCourse],
                population: population,
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
        });
    };
    const [isLoading, setLoading] = useState<boolean>(false);
    return (
        <Layout>
            <h1 className="font-bold text-2xl mb-4">Curriculum</h1>
            <main className="pace-y-4">
                <div className="bg-white p-4 overflow-y-auto">
                    {/* Tabs */}
                    <div className="flex border-b mb-4">
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "Course Offerings"
                                    ? "border-b-2 border-blue-500 font-semibold"
                                    : ""
                            }`}
                            onClick={() => handleSwitchTabs("Course Offerings")}
                        >
                            Course Offerings
                        </button>
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "Sections"
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
                        <div className="bg-white p-4">
                            <div className="flex justify-between mb-4">
                                <PrimaryButton
                                    title="New Curriculum"
                                    onClick={handleToggleCurriculumPopup}
                                    className="bg-white py-2 px-4 rounded-lg"
                                >
                                    New Curriculum
                                </PrimaryButton>
                            </div>
                            {curriculum.length === 0 ? (
                                <div className="text-center text-gray-500 row-start-2 flex items-center justify-center w-full col-span-2 my-20">
                                    No Sections created yet.
                                </div>
                            ) : (
                                <>
                                    <div className="col-span-2">
                                        <table className="min-w-full divide-y divide-gray-200 border-l border-r border-t border-gray-500">
                                            <thead className="text-center">
                                                <tr>
                                                    <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Curriculum name
                                                    </th>
                                                    <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Program
                                                    </th>
                                                    <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {curriculum.map((curr, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="hover:bg-gray-50 text-center divide-x divide-gray-500"
                                                    >
                                                        <td className="max-w-40 md:max-w-full truncate px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                                            {
                                                                curr.curriculum_name
                                                            }
                                                        </td>
                                                        <td className="max-w-40 md:max-w-full truncate px-6 py-4 whitespace-nowrap text-red-500 font-semibold uppercase">
                                                            {curr.program_name}
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
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {showCurriculumCourses && selectedCurriculum && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 ">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between mb-4">
                                    <h2 className="text-2xl text-red-500">
                                        {selectedCurriculum.curriculum_name}
                                    </h2>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={handleCloseCurriculum}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-semibold mb-4">
                                    {selectedCurriculum.program_name}
                                </h2>
                                <div className="mb-4 justify-end">
                                    <div className="grid grid-cols-5 gap-4 mb-4 justify-end">
                                        <button
                                            value="First Year"
                                            onClick={() =>
                                                setSelectedYearLevel(
                                                    "First Year"
                                                )
                                            }
                                            className={`px-4 py-2 ${
                                                selectedYearLevel ===
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
                                            className={`px-4 py-2 ${
                                                selectedYearLevel ===
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
                                            className={`px-4 py-2 ${
                                                selectedYearLevel ===
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
                                            className={`px-4 py-2 ${
                                                selectedYearLevel ===
                                                "Fourth Year"
                                                    ? "border-b-2 border-blue-500 font-semibold"
                                                    : ""
                                            }`}
                                        >
                                            Fourth Year
                                        </button>
                                    </div>
                                    <select
                                        key="semester"
                                        className="border border-gray-500 rounded-lg "
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
                                <div className="border-2 border-gray-500 p-5 rounded-lg max-h-[70vh] overflow-y-auto">
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
                                                className="p-3 border border-gray-500 rounded mb-3 grid md:grid-cols-5 grid-cols-3 flex items-center"
                                            >
                                                <label className="truncate overflow-hidden whitespace-nowrap col-span-2 hidden md:block">
                                                    {subject.name}
                                                </label>
                                                <label className="truncate text-xl font-bold truncate overflow-hidden w-4/5">
                                                    {subject.subject_code}
                                                </label>
                                                <label>
                                                    Lec Hr: {subject.lec}
                                                </label>
                                                <label>
                                                    Lab Hr: {subject.lab}
                                                </label>
                                            </div>
                                        ))}
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <PrimaryButton
                                        className="py-2 px-4 rounded-md hover:bg-red-600"
                                        onClick={handleCloseCurriculum}
                                    >
                                        Close
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    )}
                    {/*adding curriculum pop up*/}
                    {showAddCurriculum &&
                        (curriculumUploaded ? (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 ">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
                                    <div className="flex justify-between mb-4">
                                        <h2 className="text-2xl font-bold">
                                            Uploaded Curriculum:{" "}
                                            <p className="text-red-500 inline">
                                                {
                                                    curriculumUploaded.curriculum_name
                                                }
                                            </p>
                                        </h2>
                                        <button>
                                            <X
                                                size={24}
                                                className="text-red-500"
                                            />
                                        </button>
                                    </div>
                                    <h2>Curriculum Name</h2>
                                    <input
                                        className="text-xl font-semibold mb-4 border border-gray-500 rounded-lg p-2 w-full"
                                        value={
                                            curriculumUploaded.curriculum_name
                                        }
                                        name="curriculum_name"
                                        type="text"
                                        onChange={handleEditCurriculum}
                                    />
                                    <h2>Program Name</h2>
                                    <input
                                        className="text-xl font-semibold mb-4 border border-gray-500 rounded-lg p-2 w-full"
                                        value={curriculumUploaded.program_name}
                                        name="program_name"
                                        type="text"
                                        onChange={handleEditCurriculum}
                                    />
                                    <h2>Program Short Name</h2>
                                    <input
                                        className="text-xl font-semibold mb-4 border border-gray-500 rounded-lg p-2 w-full"
                                        value={
                                            curriculumUploaded.program_short_name
                                        }
                                        name="program_short_name"
                                        type="text"
                                        onChange={handleEditCurriculum}
                                    />
                                    <div className="flex justify-center mb-4">
                                        <PrimaryButton
                                            className="py-2 px-4 rounded-md hover:bg-red-600 flex gap-2"
                                            onClick={() =>
                                                handleCreateCurriculum(
                                                    curriculumUploaded
                                                )
                                            }
                                        >
                                            <Plus size={18} />
                                            Add Curriculum
                                        </PrimaryButton>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 mb-4 justify-end">
                                        <button
                                            value="First Year"
                                            onClick={() =>
                                                setSelectedYearLevel(
                                                    "First Year"
                                                )
                                            }
                                            className={`px-4 py-2 ${
                                                selectedYearLevel ===
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
                                            className={`px-4 py-2 ${
                                                selectedYearLevel ===
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
                                            className={`px-4 py-2 ${
                                                selectedYearLevel ===
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
                                            className={`px-4 py-2 ${
                                                selectedYearLevel ===
                                                "Fourth Year"
                                                    ? "border-b-2 border-blue-500 font-semibold"
                                                    : ""
                                            }`}
                                        >
                                            Fourth Year
                                        </button>
                                    </div>
                                    <select
                                        key="semester"
                                        className="border border-gray-500 rounded-lg w-1/4.5"
                                        value={selectedSemester}
                                        onChange={(e) =>
                                            setSelectedSemester(e.target.value)
                                        }
                                    >
                                        <option>First Semester</option>
                                        <option>Second Semester</option>
                                        <option>Summer</option>
                                    </select>
                                    <div className=" p-3 rounded-lg max-h-[60vh] overflow-y-auto">
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
                                                        className="border border-gray-500 rounded mb-2 grid md:grid-cols-7 grid-cols-5"
                                                    >
                                                        <div className="pl-5 flex items-center  gap-4 border-r border-gray-500 m-2">
                                                            <h2 className="hidden md:block">
                                                                Prof. Sub?
                                                            </h2>
                                                            <input
                                                                type="checkbox"
                                                                name="prof_sub"
                                                                className="h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                checked={
                                                                    subject.prof_sub
                                                                }
                                                                onChange={() =>
                                                                    handleEditUploadedCurriculum(
                                                                        subject
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <label className="p-4 truncate whitespace-nowrap col-span-2 hidden md:block">
                                                            {subject.name}
                                                        </label>
                                                        <label className="text-xl truncate overflow-hidden whitespace-nowrap font-bold flex items-center">
                                                            {
                                                                subject.subject_code
                                                            }
                                                        </label>
                                                        <div className="grid grid-cols-2 col-span-3">
                                                            <label className="p-4">
                                                                Lec Hr:{" "}
                                                                {subject.lec}
                                                            </label>
                                                            <label className="p-4">
                                                                Lab Hr:{" "}
                                                                {subject.lab}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                    </div>

                                    <div className="flex justify-end space-x-2 mt-4">
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
                                <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
                                    <div className="flex justify-between">
                                        <h2 className="text-2xl font-semibold mb-4">
                                            Add Curriculum
                                        </h2>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={
                                                handleToggleCurriculumPopup
                                            }
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center justify-center mb-4">
                                        <label
                                            className={`border border-gray-500 bg-white hover:bg-blue-400 h-[30vh] w-2/3 rounded-lg flex flex-col items-center justify-center font-semibold mb-4 cursor-pointer transition-all ${
                                                uploadedFile
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
                                            className="py-2 px-4 rounded-lg disabled:bg-red"
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
                                </div>
                            </div>
                        ))}
                    {/* Sections Tab */}
                    {activeTab === "Sections" && (
                        <div className="bg-white p-4">
                            <div className="flex justify-between mb-4">
                                <PrimaryButton 
                                    title="Add Section" 
                                    onClick={handleToggleAddSection}>
                                    Add Section
                                </PrimaryButton>
                            </div>

                            {filteredSections.length > 0 && (
                                <div className="flex grid grid-cols-1 md:grid-cols-2 gap-2 w-1/2 mb-4">
                                    <select
                                        className="border border-gray-500 rounded p-2 pr-10"
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
                                        className="border border-gray-500 rounded p-2 pr-10"
                                        onChange={(e) =>
                                            setSelectedCurriculum(
                                                curriculum.find(
                                                    (curr) =>
                                                        curr.programID ===
                                                        parseInt(e.target.value)
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
                                                            item.programID ===
                                                            curr.programID
                                                    ) === index
                                            )
                                            .map((curr, idx) => (
                                                <option
                                                    key={idx}
                                                    value={curr.programID}
                                                >
                                                    {curr.program_short_name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}
                            {sections.length === 0 ? (
                                <div className="text-center text-gray-500 row-start-2 flex items-center justify-center w-full col-span-2 my-20">
                                    No Sections created yet.
                                </div>
                            ) : (
                                <>
                                    <div className="col-span-2">
                                        <table className="min-w-full divide-y divide-gray-200 border-l border-r border-t border-gray-500">
                                            <thead className="text-center">
                                                <tr>
                                                    <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Section
                                                    </th>
                                                    <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Program
                                                    </th>
                                                    <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Year Level
                                                    </th>
                                                    <th className="border border-gray-500 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredSections.map(
                                                    (section) => (
                                                        <tr
                                                            key={section.id}
                                                            className="hover:bg-gray-50 text-center divide-x divide-gray-500"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                                {
                                                                    section.section_name
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-red-500 font-semibold">
                                                                {
                                                                    section.program_short_name
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {
                                                                    section.year_level
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <button
                                                                    className="text-red-500 hover:text-red-700 ml-4"
                                                                    onClick={() =>
                                                                        handleDeleteSection(
                                                                            section.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {addSectionPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    Add Section
                                </h2>
                                <button 
                                    title="Close"
                                    className="text-red-500">
                                    <X
                                        size={24}
                                        onClick={handleToggleAddSection}
                                    />
                                </button>
                            </div>
                            <div className="flex mb-4 grid md:grid-cols-2 grid-cols-1 gap-2">
                                <div className="md:col-span-1 col-span-2">
                                    <h2>Section Name</h2>
                                    <input
                                        type="text"
                                        placeholder="Section Name"
                                        value={sectionName}
                                        onChange={(e) =>
                                            setSectionName(e.target.value)
                                        }
                                        className="p-3 rounded-lg w-full"
                                    />
                                </div>
                                <div className="md:col-span-1 col-span-2">
                                    <h2>Population</h2>
                                    <input
                                        type="text"
                                        placeholder="Population"
                                        value={population}
                                        onChange={(e) => {
                                            const value = parseInt(
                                                e.target.value
                                            );
                                            setPopulation(
                                                isNaN(value) ? 0 : value
                                            );
                                        }}
                                        className="p-3 rounded-lg w-full"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <h2>Curriculum</h2>
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
                                        className="appearance-none p-3 rounded-lg w-full"
                                    >
                                        <option>Curriculum</option>
                                        {curriculum.map((curriculum) => (
                                            <option
                                                key={curriculum.curriculumID}
                                                value={
                                                    curriculum.curriculum_name
                                                }
                                            >
                                                {curriculum.curriculum_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 justify-between">
                                <select
                                    onChange={(e) =>
                                        setYearLevelCourse(e.target.value)
                                    }
                                    className="appearance-none rounded-lg"
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
                                    className="appearance-none rounded-lg"
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
                            <div className="flex justify-center mb-4">
                                <PrimaryButton
                                    title="Add Section"
                                    className="py-2 rounded-md hover:bg-green-600 hover:text-white"
                                    onClick={handleAddSection}
                                >
                                    <Plus size={18} className="mr-2" />
                                    Add Section
                                </PrimaryButton>
                            </div>
                            <div className="p-3 max-h-[70vh] overflow-y-auto mb-4">
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
                                            className="border border-gray-500 rounded mb-2 grid grid-cols-3"
                                        >
                                            <label className="p-4 truncate overflow-hidden hidden md:block whitespace-nowrap">
                                                {subject.name}
                                            </label>
                                            <label className="text-xl font-bold flex items-center justify-center">
                                                {subject.subject_code}
                                            </label>
                                            <div className="grid grid-cols-2 md:col-span-1 col-span-2 flex justify-center">
                                                <label className="p-4">
                                                    Lec Hr: {subject.lec}
                                                </label>
                                                <label className="p-4">
                                                    Lab Hr: {subject.lab}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="flex justify-end">
                                <PrimaryButton
                                    title="Cancel"
                                    className="py-2 px-4 rounded-md hover:bg-red-600 flex justify-end"
                                    onClick={handleToggleAddSection}
                                >
                                    Cancel
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-30">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-100"></div>
                </div>
            )}
        </Layout>
    );
};

export default CourseOfferingsPage;
