import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authcontext";
import { Button } from "@/components/ui/button";

const CommonNavbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading || user) return null;

  return (
    <nav className="w-full h-16 bg-primary-background-color text-primary-foreground flex items-center justify-between px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <Button variant="default" onClick={() => navigate("/auth")}>
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default CommonNavbar;
