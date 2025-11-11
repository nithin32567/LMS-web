import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/authcontext";
import { useState } from "react";

export function ProfileDropDown() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div
          onMouseEnter={() => setOpen(true)}
          className="w-10 h-10 rounded-full overflow-hidden"
        >
          <img
            src={user.avatar}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
