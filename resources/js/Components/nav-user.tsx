"use client"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import Dropdown from '@/Components/Dropdown';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/Components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/Components/ui/sidebar"
import { User } from '@/types'
import { cn } from "@/lib/utils"

type Props ={
  user: User;
  btnClassName?: string;
  isNavbar?: boolean;
};

export function NavUser({ user, isNavbar, btnClassName }: Props) {
  const { isMobile } = useSidebar()
  
  return(
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn("data-[state=open]:bg-sidebar-accent-data-[state-open]:text-sidebar-accent-foreground", btnClassName
                
              )}
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-xl">{user.name}</span>
                <span className="truncate text-lg">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile || isNavbar ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {isNavbar && (
              <><DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            </>
          )}
            <DropdownMenuGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Dropdown.Link
                href={route('logout')}
                method="post"
                as="button"
                onClick={(e) => {
                  localStorage.removeItem("sidebarData");
                  
                }
              }
                > 
              <LogOut />
                  Log Out
            </Dropdown.Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
