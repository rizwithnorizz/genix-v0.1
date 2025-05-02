"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

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

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    isCollapsible?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
           <a href = {item.url}
           key = {item.title}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title} className="py-5 text-md flex gap-5 ">
                
                <span className="text-2xl">{item.icon && <item.icon />}</span>
                
                <span className="text-2xl">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </a>))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
