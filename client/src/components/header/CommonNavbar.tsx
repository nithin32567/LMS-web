import React from "react";
import { useAuth } from "@/contexts/authcontext";
import { Link, useNavigate } from "react-router-dom";
import { ProfileDropDown } from "../dropdown/profile-drop-down";

const CommonNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  interface NavLink {
    label: string;
    to: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  }

  const commonLinks: NavLink[] = [
    {
      label: "Courses",
      to: "/courses",
    },
    {
      label: "About",
      to: "/about",
    },
    {
      label: "Blog",
      to: "/blog",
    },
    {
      label: "Dashboard",
      to:
        user?.role === "student"
          ? "/student/dashboard"
          : user?.role === "instructor"
          ? "/instructor/dashboard"
          : "/admin/dashboard",
    },
  ];

  let links = user ? [...commonLinks] : commonLinks;

  return (
    <nav className="w-full h-16 bg-primary-background-color text-primary-foreground flex items-center justify-between px-4">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <div className="flex items-center gap-6">
            {links.map((link, index) => (
              <Link
                className=""
                key={`${link.label}-${index}`}
                to={link.to}
                onClick={link.onClick}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <ProfileDropDown />
      </div>
    </nav>
  );
};

export default CommonNavbar;
