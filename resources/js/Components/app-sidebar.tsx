import React, { useEffect, useState } from 'react';
import axios from "axios";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LucideIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/Components/nav-main";
import { NavProjects } from "@/Components/nav-projects";
import { NavUser } from "@/Components/nav-user";
import { TeamSwitcher } from "@/Components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/Components/ui/sidebar";
import { ScrollArea } from "./ui/scroll-area";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
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
    name: "Kyoto",
    email: "Kyoto@gmail.com",
    avatar: "/logo.png",
    role: 2, // Default role
  },
  navMain: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [data, setData] = useState<Data>(initialData);

  useEffect(() => {
    axios.get('/getusersidebar') // Update the endpoint to fetch user data
      .then(response => {
        const user: User = response.data;
        let navMainItems: NavItem[] = [];

        switch (user.role) {
          case 0: //Super Admin
            navMainItems = [
              {
                title: "Dashboard",
                url: "dashboard-sa",
                icon: SquareTerminal,
                isActive: true,
                isCollapsible: false,
              },
              {
                title: "Department",
                url: "departments",
                icon: Bot,
                isCollapsible: false,
              },
              {
                title: "Rooms",
                url: "#",
                icon: Settings2,  
                isCollapsible: false,
              },
              {
                title: "Feedback",
                url: "feedback",
                icon: BookOpen,
              },
              {
                title: "Schedules",
                url: "schedules",
                icon: Settings2,
                isCollapsible: false,
              },
              {
                title: "Help",
                url: "help",
                icon: Settings2,
                isCollapsible: false,
              },
              {
                title: "About",
                url: "about",
                icon: Settings2,
                isCollapsible: false,
              },
            ];
            break;
          case 1: //Department Admin
            navMainItems = [
              {
                title: "Dashboard",
                url: "#",
                icon: SquareTerminal,
                isActive: true,
                isCollapsible: false,
              },
              {
                title: "Course Sections",
                url: "#",
                icon: SquareTerminal,
                isActive: true,
                isCollapsible: false,
              },
              {
                title: "Subjects",
                url: "#",
                icon: Bot,
                isCollapsible: false,
                items: [],
              },
              {
                title: "Feedback",
                url: "#",
                icon: BookOpen,
                isCollapsible: false,
              },
              {
                title: "Help",
                url: "#",
                icon: Settings2,
                isCollapsible: false,
              },
              {
                title: "About",
                url: "#",
                icon: Settings2,
                isCollapsible: false
              }
            ];
            break;
          case 2: //Guest User
            navMainItems = [
              {
                title: "Student Schedule",
                url: "#",
                icon: Settings2,
                isCollapsible: false,
              },
              {
                title: "Instructor Schedule",
                url: "#",
                icon: Settings2,
                isCollapsible: false,
              },
              {
                title: "Help",
                url: "#",
                icon: Settings2,
                isCollapsible: false,
              },
              {
                title: "About",
                url: "#",
                icon: Settings2,
                isCollapsible: false
              }
            ];
            break;
          default:
            navMainItems = [];
        }

        setData(prevData => ({
          ...prevData,
          user,
          navMain: navMainItems,
        }));
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <NavMain items={data.navMain} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
