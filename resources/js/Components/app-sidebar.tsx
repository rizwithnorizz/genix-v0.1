import React, { useEffect, useState } from 'react';
import axios from "axios";
import {
  AppleIcon,
  AudioWaveform,
  BadgeHelpIcon,
  BookOpen,
  Bot,
  BoxesIcon,
  BriefcaseBusiness,
  CalendarCheck2,
  CalendarPlus2Icon,
  Command,
  DoorOpenIcon,
  Frame,
  GalleryVerticalEnd,
  GroupIcon,
  HelpCircleIcon,
  KeySquareIcon,
  LucideCalendarSync,
  LucideIcon,
  Map,
  MessageCircleQuestionIcon,
  NotebookPen,
  PenIcon,
  PenToolIcon,
  PieChart,
  Settings2,
  SquareTerminal,
  Table2Icon,
  User2,
  UserPenIcon,
} from "lucide-react";

import { NavMain } from "@/Components/nav-main";
import { NavProjects } from "@/Components/nav-projects";
import { NavUser } from "@/Components/nav-user";
import { TeamSwitcher } from "@/Components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/Components/ui/sidebar";
import { ScrollArea } from "./ui/scroll-area";
import ApplicationLogo from './ApplicationLogo';

type NavItem = {
  title: string;
  url: string;
  icon: string;
  isActive?: boolean;
  isCollapsible?: boolean;
  items?: NavItem[];
};

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: number; // Add the role attribute
};

type Data = {
  user: User;
  navMain: NavItem[];
};

const initialData: Data = {
  user: {
    id: 1,
    name: "Guest",
    email: "Guest",
    avatar: "#",
    role: 2, // Default role
  },
  navMain: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [data, setData] = useState<Data>(initialData);
  const [logged, setLogged] = useState<boolean>(false);


  useEffect(() => {
    const cachedData = localStorage.getItem("sidebarData");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      console.log(parsedData);
      setData(parsedData);
      setLogged(true);
      return; // Use cached data and skip the API request
    }

    // Fetch data from the server if not cached
    axios
      .get("/getusersidebar")
      .then((response) => {
        const user: User = response.data;
        let navMainItems: NavItem[] = [];

        switch (user.role) {
          case 0: // Super Admin
            navMainItems = [
              { title: "Dashboard", url: "dashboard-sa", icon: "SquareTerminal", isCollapsible: false },
              { title: "Department", url: "departments", icon: "BoxesIcon", isCollapsible: false },
              { title: "Rooms", url: "rooms", icon: "DoorOpenIcon", isCollapsible: false },
              { title: "Schedules Approval", url: "schedules", icon: "CalendarPlus2Icon", isCollapsible: false },
              { title: "About", url: "about", icon: "UserPenIcon", isCollapsible: false },
            ];
            break;
          case 1: // Department Admin
            navMainItems = [
              { title: "Dashboard", url: "dashboard", icon: "SquareTerminal", isCollapsible: false },
              { title: "Curriculum", url: "courseOfferings", icon: "BookOpen", isCollapsible: false },
              { title: "Instructors", url: "instructors", icon: "User2", isCollapsible: false },
              { title: "Feedback", url: "feedback", icon: "PenIcon", isCollapsible: false },
              { title: "Help", url: "help", icon: "BadgeHelpIcon", isCollapsible: false },
              { title: "About", url: "about", icon: "GroupIcon", isCollapsible: false },
            ];
            break;
        }

        const sidebarData = {
          user,
          navMain: navMainItems,
          logged: true,
        };
        setLogged(true);
        // Cache the data in localStorage
        localStorage.setItem("sidebarData", JSON.stringify(sidebarData));
        setData(sidebarData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);

        if (!logged) {
          const navMainItems: NavItem[] = [
            { title: "Student Schedule", url: "student", icon: "NotebookPen", isCollapsible: false },
            { title: "Instructor Schedule", url: "instructor", icon: "AppleIcon", isCollapsible: false },
            { title: "Login", url: "/login", icon: "KeySquareIcon", isCollapsible: false },
            { title: "About", url: "about", icon: "BadgeHelpIcon", isCollapsible: false },
          ];

          const sidebarData = {
            user: initialData.user,
            navMain: navMainItems,
          };
          setData(sidebarData);
        }
      });

  }, []); 

  return (
    <Sidebar collapsible="icon" {...props} className="h-[80vh] rounded-xl border-2 border-gray-500 py-2 my-5 ml-2 ">
      <SidebarHeader className="flex items-center justify-center ">
      </SidebarHeader>
    
      <SidebarContent className="flex flex-col items-center justify-center">
        <ScrollArea >
          <NavMain items={data.navMain} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        {logged && (
          <NavUser user={data.user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
