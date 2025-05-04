import Layout from "@/Components/ui/layout";
import { useCallback, useEffect, useState } from "react";
import { Bell, CalendarArrowDown, CalendarArrowUp, CalendarSyncIcon, House, Network, Users, type LucideIcon } from "lucide-react";
import axios from "axios";
import React from "react";

interface News {
    id: number;
    name: string;
    content: string;
}


interface SuperAdminDashboardProps {
    children?: React.ReactNode;
    className?: string;
    [key: string]: any;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = (
    {
        children,
        className,
        ...props
    }
) => {

    const [news, setNews] = useState<News[]>([
        {
            id: 1,
            name: "Computer Science",
            content: "Approved Schedule for CICT",
        },
        {
            id: 2,
            name: "Information Technology",
            content: "New schedule request from CAS",
        },
        {
            id: 3,
            name: "Civil Engineering",
            content: "Approved Schedule for CAMS",
        },
        {
            id: 4,
            name: "Electrical Engineering",
            content: "New schedule request from CICT",
        },
    ]);



    return (
        <div className={`bg-white border-2 border-gray-500 rounded-xl flex flex-col gap-5 md:row-start-3 col-start-1 w-1/2 h-[300px] overflow-y-auto ${className}`} >
                <h2 className="pl-6 pt-6 font-semibold text-lg">News</h2>
                <div className="h-[200px] overflow-y-auto">
                    {news.map((news, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-500 p-4 ml-5 mr-5 mb-2 rounded-xl flex justify-between items-center shadow relative"
                        >
                            <div className="flex items-center">
                                <Bell className="mr-5 text-gray-500"/>
                                <span>{news.content}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    );
};
export default SuperAdminDashboard;
