import * as React from "react";
import { BadgeCheck, LogOut } from "lucide-react";
import Dropdown from '@/Components/Dropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

const AccountDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-2 bg-gray-200 rounded-md">
          <BadgeCheck />
          Account
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-lg">
        <DropdownMenuGroup>
          <Dropdown.Link
            href={route('account')}
            method="get"
            as="button"
          >
            <BadgeCheck />
            Account
          </Dropdown.Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Dropdown.Link
          href={route('logout')}
          method="post"
          as="button"
        >
          <LogOut />
          Log Out
        </Dropdown.Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;