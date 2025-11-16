import { useNavigate } from "react-router-dom";
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
          className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-gray-600 font-semibold text-sm">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="pl-6" align="end">
        <DropdownMenuGroup className="w-full">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="w-full">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            Start teaching
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem
          className="cursor-pointer justify-end"
          onClick={() => logout()}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
