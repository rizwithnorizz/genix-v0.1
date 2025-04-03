import { NavMain } from "@/Components/nav-main";
import { NavUser } from "@/Components/nav-user";
import Layout from "@/Components/ui/layout";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, Sidebar } from "@/Components/ui/sidebar";
import { LucideIcon, Users } from "lucide-react";
import * as React from "react";
import { useState } from "react";

interface sidebarData { 
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  isCollapsible?: boolean;
  items?: sidebarData[];
}
const student = () => {
  const [data, setData] = useState<sidebarData[]>([
    {title: "Student Schedule", url: "#", icon: Users, isActive: true, isCollapsible: false},
    {title: "Instructor Schedule", url: "#", icon: Users, isActive: true, isCollapsible: false},
    {title: "Student Schedule", url: "#", icon: Users, isActive: true, isCollapsible: false},
    {title: "Student Schedule", url: "#", icon: Users, isActive: true, isCollapsible: false},
  ]);
  return (
    <Layout>
      <main>
        <label>
          hello
        </label>
        </main>
    </Layout>
  );
};

export default student;