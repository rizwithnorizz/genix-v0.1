"use client"
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

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/Components/ui/sidebar"
import { Link } from "react-router-dom"
import ApplicationLogo from "./ApplicationLogo"

const iconMap: Record<string, LucideIcon> = {
  SquareTerminal,
  BoxesIcon,
  DoorOpenIcon,
  CalendarPlus2Icon,
  BadgeHelpIcon,
  UserPenIcon,
  BookOpen,
  User2,
  PenIcon,
  GroupIcon,
  NotebookPen,
  AppleIcon,
  KeySquareIcon,
};


export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string; // Icon is now a string
    isActive?: boolean;
    isCollapsible?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const active = location.pathname.includes(item.url);
          const IconComponent = item.icon ? iconMap[item.icon] : null; // Map icon name to component

          return (
            <a href={item.url} key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`py-5 flex gap-5 h-1/2 ${
                    active ? "bg-blue-100 font-semibold" : "text-gray-700"
                  }`}
                >
                  <span className="text-xl">
                    {IconComponent && <IconComponent />} {/* Render the icon */}
                  </span>
                  <span className="text-xl">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </a>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}