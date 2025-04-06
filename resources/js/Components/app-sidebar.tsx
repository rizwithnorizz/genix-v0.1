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
    name: "Guest",
    email: "Guest",
    avatar: "#",
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
                url: "rooms",
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
                url: "dashboard",
                icon: SquareTerminal,
                isActive: true,
                isCollapsible: false,
              },
              {
                title: "Programs and Sections",
                url: "courseOfferings",
                icon: SquareTerminal,
                isActive: true,
                isCollapsible: false,
              },
              {
                title: "Curriculum",
                url: "#",
                icon: SquareTerminal,
                isActive: true,
                isCollapsible: false,
              },
              {
                title: "Instructors",
                url: "instructors",
                icon: SquareTerminal,
                isActive: true,
                isCollapsible: false,
              },
              {
                title: "Feedback",
                url: "#",
                icon: BookOpen,
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
                isCollapsible: false
              }
            ];
            break;
          default: //Guest User
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
                url: "help",
                icon: Settings2,
                isCollapsible: false,
              },
              {
                title: "About",
                url: "about",
                icon: Settings2,
                isCollapsible: false
              }
            ];
            break;
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
