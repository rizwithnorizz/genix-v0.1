import Layout from "@/Components/ui/layout";
import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Calendar, Users, FileUp, Settings, AlertTriangle, HelpCircle, Send, MessageSquare } from "lucide-react";

export default function Help() {
    const [visibility, setVisibility] = useState<{
        value: boolean;
        name: string;
        subsection?: string;
    }>({ value: false, name: "" });

    const toggleVisibility = (name: string) => {
        setVisibility((prev) => ({
            name,
            value: prev.name === name ? !prev.value : true,
        }));
    };

    const toggleSubsection = (name: string, subsection: string) => {
        setVisibility((prev) => ({
            name,
            subsection,
            value: prev.name === name && prev.subsection === subsection ? !prev.value : true,
        }));
    };

    return (
        <Layout>
            <div className="max-w-4xl">
                <h1 className="font-bold text-3xl mb-8 text-gray-800 flex items-center">
                    <HelpCircle className="mr-2 text-blue-600" />
                    Frequently Asked Questions
                </h1>
                
                <div className="space-y-6 border border-gray-500 rounded-xl p-6 bg-white shadow-md">
                    {/* Where to begin */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow transition-all duration-200">
                        <button
                            onClick={() => toggleVisibility("begin")}
                            className={`w-full text-xl p-4 flex justify-between items-center transition-colors duration-200 ${
                                visibility.name === "begin" && visibility.value 
                                ? "bg-blue-50 text-blue-700" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <span className="flex items-center font-medium">
                                <BookOpen className="mr-3 h-5 w-5" />
                                Where to begin?
                            </span>
                            {visibility.name === "begin" && visibility.value 
                                ? <ChevronDown className="h-5 w-5" /> 
                                : <ChevronRight className="h-5 w-5" />
                            }
                        </button>
                        
                        {visibility.name === "begin" && visibility.value && (
                            <div className="p-5 space-y-4 bg-gray-50">
                                {/* Adding instructors */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                    <button
                                        onClick={() => toggleSubsection("begin", "instructors")}
                                        className={`w-full text-lg p-3 flex justify-between items-center transition-colors duration-200 ${
                                            visibility.name === "begin" && visibility.subsection === "instructors" && visibility.value 
                                            ? "bg-blue-50 text-blue-600" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="flex items-center">
                                            <Users className="mr-2 h-4 w-4" />
                                            Adding instructors
                                        </span>
                                        {visibility.name === "begin" && visibility.subsection === "instructors" && visibility.value 
                                            ? <ChevronDown className="h-4 w-4" /> 
                                            : <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>
                                    
                                    {visibility.name === "begin" && visibility.subsection === "instructors" && visibility.value && (
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                                <li>Instructor name</li>
                                                <li>
                                                    <span className="font-medium">General Education Instructor?:</span> basically the instructor will be recognized outside of the department scope for assignment of subjects.
                                                </li>
                                                <li>
                                                    <span className="font-medium">Subjects:</span> Professional and General Education Subjects are available depending on the general education's checkbox.
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Adding curriculums */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                    <button
                                        onClick={() => toggleSubsection("begin", "curriculums")}
                                        className={`w-full text-lg p-3 flex justify-between items-center transition-colors duration-200 ${
                                            visibility.name === "begin" && visibility.subsection === "curriculums" && visibility.value 
                                            ? "bg-blue-50 text-blue-600" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="flex items-center">
                                            <FileUp className="mr-2 h-4 w-4" />
                                            Adding curriculums
                                        </span>
                                        {visibility.name === "begin" && visibility.subsection === "curriculums" && visibility.value 
                                            ? <ChevronDown className="h-4 w-4" /> 
                                            : <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>
                                    
                                    {visibility.name === "begin" && visibility.subsection === "curriculums" && visibility.value && (
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                                <li>Upload curriculum (docx file)</li>
                                                <li>Review the details. Make sure the subjects have the correct information (Most specially for Professional Subjects checkbox).</li>
                                                <li>Review the subjects per year level and per semester.</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Adding sections */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                    <button
                                        onClick={() => toggleSubsection("begin", "sections")}
                                        className={`w-full text-lg p-3 flex justify-between items-center transition-colors duration-200 ${
                                            visibility.name === "begin" && visibility.subsection === "sections" && visibility.value 
                                            ? "bg-blue-50 text-blue-600" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="flex items-center">
                                            <Users className="mr-2 h-4 w-4" />
                                            Adding sections
                                        </span>
                                        {visibility.name === "begin" && visibility.subsection === "sections" && visibility.value 
                                            ? <ChevronDown className="h-4 w-4" /> 
                                            : <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>
                                    
                                    {visibility.name === "begin" && visibility.subsection === "sections" && visibility.value && (
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                                <li>Input the section's information (name and population).</li>
                                                <li>Select which curriculum they are enrolled in.</li>
                                                <li>Select which year level.</li>
                                                <li>Review the subjects.</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Publish Generated Schedule */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                    <button
                                        onClick={() => toggleSubsection("begin", "publish")}
                                        className={`w-full text-lg p-3 flex justify-between items-center transition-colors duration-200 ${
                                            visibility.name === "begin" && visibility.subsection === "publish" && visibility.value 
                                            ? "bg-blue-50 text-blue-600" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="flex items-center">
                                            <Send className="mr-2 h-4 w-4" />
                                            Publish Generated Schedule
                                        </span>
                                        {visibility.name === "begin" && visibility.subsection === "publish" && visibility.value 
                                            ? <ChevronDown className="h-4 w-4" /> 
                                            : <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>
                                    
                                    {visibility.name === "begin" && visibility.subsection === "publish" && visibility.value && (
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                                <li>On the generated schedule panel, select which class schedule is to be approved by the super admin.</li>
                                                <li>By clicking the Send Arrow, it will be sent to the Super Admin for approval.</li>
                                                <li>Once approved by the Super Admin, it will be available for viewing for both students and instructors.</li>
                                                <li>Once the class schedule has been made available for students and instructors, it will be available for viewing.</li>
                                                <li>Within the viewing, students and instructors are able to provide feedback for a certain subject on a certain schedule.</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Feedback */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                    <button
                                        onClick={() => toggleSubsection("begin", "feedback")}
                                        className={`w-full text-lg p-3 flex justify-between items-center transition-colors duration-200 ${
                                            visibility.name === "begin" && visibility.subsection === "feedback" && visibility.value 
                                            ? "bg-blue-50 text-blue-600" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="flex items-center">
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Feedback
                                        </span>
                                        {visibility.name === "begin" && visibility.subsection === "feedback" && visibility.value 
                                            ? <ChevronDown className="h-4 w-4" /> 
                                            : <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>
                                    
                                    {visibility.name === "begin" && visibility.subsection === "feedback" && visibility.value && (
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                                <li>Once the feedback transaction succeeded, it will be redirected to their corresponding department admin's feedback approval.</li>
                                                <li>In the Feedback page of the Department Admin, they can either approve it or leave it unapproved.</li>
                                                <li>{`Once the feedbacks have been approved by the Department Admin, they can then generate a class schedule as a response from the feedback by going to the Dashboard > Generate New Class Schedule > Generate Schedule from Feedback.`}</li>
                                                <li>Once the A.I has finished analyzing, it will give a response according to the needs of the accumulated approved feedback.</li>
                                                <li>Preview will be available once the A.I is done processing the class schedule.</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Generating class schedules */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow transition-all duration-200">
                        <button
                            onClick={() => toggleVisibility("schedules")}
                            className={`w-full text-xl p-4 flex justify-between items-center transition-colors duration-200 ${
                                visibility.name === "schedules" && visibility.value 
                                ? "bg-blue-50 text-blue-700" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <span className="flex items-center font-medium">
                                <Calendar className="mr-3 h-5 w-5" />
                                Generating class schedules
                            </span>
                            {visibility.name === "schedules" && visibility.value 
                                ? <ChevronDown className="h-5 w-5" /> 
                                : <ChevronRight className="h-5 w-5" />
                            }
                        </button>
                        
                        {visibility.name === "schedules" && visibility.value && (
                            <div className="p-5 space-y-4 bg-gray-50">
                                {/* On department admin dashboard */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                    <button
                                        onClick={() => toggleSubsection("schedules", "dashboard")}
                                        className={`w-full text-lg p-3 flex justify-between items-center transition-colors duration-200 ${
                                            visibility.name === "schedules" && visibility.subsection === "dashboard" && visibility.value 
                                            ? "bg-blue-50 text-blue-600" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="flex items-center">
                                            <Settings className="mr-2 h-4 w-4" />
                                            On department admin dashboard
                                        </span>
                                        {visibility.name === "schedules" && visibility.subsection === "dashboard" && visibility.value 
                                            ? <ChevronDown className="h-4 w-4" /> 
                                            : <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>
                                    
                                    {visibility.name === "schedules" && visibility.subsection === "dashboard" && visibility.value && (
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                                <li>Click "Generate New Class Schedule" button.</li>
                                                <li>Input school year and semester.</li>
                                                <li>Click "Generate Schedule".</li>
                                                <li>Once generated, review the schedule.</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Common issues */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                    <button
                                        onClick={() => toggleSubsection("schedules", "issues")}
                                        className={`w-full text-lg p-3 flex justify-between items-center transition-colors duration-200 ${
                                            visibility.name === "schedules" && visibility.subsection === "issues" && visibility.value 
                                            ? "bg-blue-50 text-blue-600" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="flex items-center">
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            Common issues
                                        </span>
                                        {visibility.name === "schedules" && visibility.subsection === "issues" && visibility.value 
                                            ? <ChevronDown className="h-4 w-4" /> 
                                            : <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>
                                    
                                    {visibility.name === "schedules" && visibility.subsection === "issues" && visibility.value && (
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                                <li>If subjects do not appear on the generated schedule, this is more likely because there are no instructors set for that yet.</li>
                                                <li>
                                                    If the generating schedules result in an error, more likely it has to do with the balance of the entities (classrooms to subjects ratio, instructors to subject ratio).
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Error encountered */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                    <button
                                        onClick={() => toggleSubsection("schedules", "errors")}
                                        className={`w-full text-lg p-3 flex justify-between items-center transition-colors duration-200 ${
                                            visibility.name === "schedules" && visibility.subsection === "errors" && visibility.value 
                                            ? "bg-blue-50 text-blue-600" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="flex items-center">
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            Error encountered
                                        </span>
                                        {visibility.name === "schedules" && visibility.subsection === "errors" && visibility.value 
                                            ? <ChevronDown className="h-4 w-4" /> 
                                            : <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>
                                    
                                    {visibility.name === "schedules" && visibility.subsection === "errors" && visibility.value && (
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                                <li>Double check Instructor-to-Subject assignment.</li>
                                                <li>Contact Super Admin for the list of classrooms and their exclusiveness to departments.</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}