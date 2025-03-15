import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/Components/nav-main"
import { NavProjects } from "@/Components/nav-projects"
import { NavUser } from "@/Components/nav-user"
import { TeamSwitcher } from "@/Components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/Components/ui/sidebar"
import { ScrollArea } from "./ui/scroll-area"

// This is sample data.
const data = {
  user: {
    id: 1,
    name: "Kyoto",
    email: "Kyoto@gmail.com",
    avatar: "/logo.png",
  },
  teams: [
    {
      name: "Super Admin",
      logo: GalleryVerticalEnd,
      plan: "Super Admin",
    },
    {
      name: "Admin",
      logo: AudioWaveform,
      plan: "Admin",
    },
    {
      name: "Teacher",
      logo: Command,
      plan: "Teacher",
    },
    {
      name: "Student",
      logo: Command,
      plan: "Student",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "1",
          url: "#",
        },
        {
          title: "2",
          url: "#",
        },
        {
          title: "3",
          url: "#",
        },
      ],
    },
    {
      title: "Department",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "1",
          url: "#",
        },
        {
          title: "2",
          url: "#",
        },
        {
          title: "3",
          url: "#",
        },
      ],
    },
    {
      title: "Feedback",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "1",
          url: "feedback",
        },
        {
          title: "2",
          url: "#",
        },
        {
          title: "3",
          url: "#",
        },

      ],
    },
    {
      title: "Schedules",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "1",
          url: "#",
        },
        {
          title: "2",
          url: "#",
        },
        {
          title: "3",
          url: "#",
        },
        
      ],
    },
    {
      title: "Train A.I.",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "1",
          url: "#",
        },
        {
          title: "2",
          url: "#",
        },
        {
          title: "3",
          url: "#",
        },
        
      ],
    },
    {
      title: "Help",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "1",
          url: "#",
        },
        {
          title: "2",
          url: "#",
        },
        {
          title: "3",
          url: "#",
        },
        
      ],
    },
    {
      title: "About",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "1",
          url: "#",
        },
        {
          title: "2",
          url: "#",
        },
        {
          title: "3",
          url: "#",
        },
        
      ],
    },
  ],
  projects: [
    {
      name: "-",
      url: "#",
      icon: Frame,
    },
    {
      name: "-",
      url: "#",
      icon: PieChart,
    },
    {
      name: "-",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
          <ScrollArea>
            <NavMain items={data.navMain} />
            <NavProjects projects={data.projects} />
          </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
