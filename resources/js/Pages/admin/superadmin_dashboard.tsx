import Layout from "@/Components/ui/layout";
import { useCallback, useEffect, useState } from "react";
import { Bell, CalendarArrowDown, CalendarArrowUp, CalendarSyncIcon, House, Network, Users, type LucideIcon } from "lucide-react";
import axios from "axios";
import React from "react";
import News from "@/Components/news";
import PrimaryButton from "@/Components/PrimaryButton";

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
    logo_img_path: string;
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
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");

    const fetchDepartments = async () => {
        try {
            const response = await axios.get("/admin/get-departments");
            setDepartment(response.data.data);
            console.log("fetched data", response.data.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const [roomCount, setRoomCount] = useState<number>(0);
    const [departmentCount, setDepartmentCount] = useState<number>(0);
    const [scheduleForApprovalCount, setScheduleForApprovalCount] = useState<number>(0);

    const fetchRoomCount = async () => {
        try {
            const response = await axios.get("/admin/getDashboardCount");
            console.log("fetched data", response.data);
            setRoomCount(response.data.classrooms);
            setDepartmentCount(response.data.departments);
            setScheduleForApprovalCount(response.data.schedules);
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
        {
            id: 3,
            icon: CalendarArrowUp,
            count: scheduleForApprovalCount,
            desc: "Class Schedules Approval",
            url: "/admin/schedules",
        }
    ];

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
                            className="bg-white p-4 border-2 border-gray-500 rounded-xl md:row-start-1 s:h-70"
                        >
                            <div className="flex items-center justify-center">
                                <count.icon className="h-20 w-20" />
                            </div>
                            <div>
                                <p className="text-lg overflow-hidden truncate text-ellipsis">{count.desc}</p>
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


                
                <div className="bg-white p-4 rounded-2xl border-2 border-gray-500 col-span-1 ">
                    <div className="p-5 grid grid-cols-4 md:grid-cols-3 lg:grid-cols-5  gap-4 max-h-[300px] overflow-y-auto">
                        {department?.map((dept, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-500 p-4 rounded-xl flex flex-col items-center h-full"
                            >
                                <img 
                                    src={dept.logo_img_path ?? "/blankicon.png"}
                                    alt="Department Logo"
                                    className="h-[7rem] w-[7rem] rounded-full mb-2"/>
                                <span>{dept.department_short_name}</span>
                            </div>
                        ))}
                    </div>
                    <a href="departments">
                        <PrimaryButton className="mt-4 py-2 px-4 rounded-lg">
                            View All Departments
                        </PrimaryButton>
                    </a>
                </div>
                <News />
            </main>
        </Layout>
    );
};
export default SuperAdminDashboard;
