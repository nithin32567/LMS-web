import { useState } from "react";
import { Navigate } from "react-router-dom";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/authcontext";
import useSignupWithEmailAndOtp from "@/hooks/signup-with-email-and-otp";

export default function Signup() {
  const { user } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const {
    handleSignupWithEmailAndOtp,
    handleVerifyOtp,
    loading,
    error,
    otpSent,
  } = useSignupWithEmailAndOtp(email, name);

  console.log("otpSent in signup", otpSent);

  const [otp, setOtp] = useState<string>("");
  if (user) {
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "student")
      return <Navigate to="/student/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpSent) {
      handleVerifyOtp(otp);
    } else {
      handleSignupWithEmailAndOtp();
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row md:h-screen md:justify-center items-center justify-center md:items-center gap-0">
      <div className="w-full  md:w-1/2  flex justify-center items-center md:items-center flex-col gap-1 md:gap-2 bg-primary-background-color py-3 md:py-0 px-4 md:px-0">
        <h1 className="text-xl md:text-4xl text-primary-background  font-light text-center mb-1 md:mb-2 text-primary-button p-2 md:p-4">
          Welcome to our LMS
        </h1>
        <p className="text-xs md:text-sm text-center w-2/3  px-2">
          Welcome to our platform. Please enter your email and name to sign up.
        </p>
      </div>
      <div className="w-full  md:w-1/2   flex justify-center items-center overflow-y-auto py-3 md:py-0 px-4 md:px-0">
        <div className="max-w-md w-full  px-4 md:px-8 rounded-lg p-4 md:p-8 flex flex-col gap-3 md:gap-4">
          <h1 className="text-xl md:text-4xl text-primary-background font-light text-center mb-1 md:mb-2 text-primary-button">
            Sign Up with email
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 md:gap-8"
          >
            <div className="space-y-1 md:space-y-2">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 md:px-4 md:py-2.5 border border-border rounded-md",
                  "transition-all duration-200",
                  "placeholder:text-muted-foreground"
                )}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-1 md:space-y-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 md:px-4 md:py-2.5 border border-border rounded-md",
                  "transition-all duration-200",
                  "placeholder:text-muted-foreground"
                )}
                placeholder="Enter your email"
                required
              />
            </div>
            {otpSent && (
              <>
                <div className="space-y-1 md:space-y-2">
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 md:px-4 md:py-2.5 border border-border rounded-md",
                      "transition-all duration-200",
                      "placeholder:text-muted-foreground"
                    )}
                    placeholder="Enter your OTP"
                    required
                  />
                </div>
              </>
            )}
            <Button
              variant="default"
              type="submit"
              className="w-full text-sm md:text-base py-2 md:py-2.5"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </Button>
          </form>

          {error && <p className="text-red-500 text-xs md:text-sm">{error}</p>}

          <div className="flex items-center justify-center gap-2">
            <span className="w-full h-px bg-border"></span>
            <span className="text-xs md:text-sm text-border whitespace-nowrap px-2">
              Or continue with
            </span>
            <span className="w-full h-px bg-border"></span>
          </div>

          <div className="flex justify-center items-center w-full">
            <GoogleAuthButton className="w-full" />
          </div>
          <p className="mt-4 md:mt-6 text-center text-xs md:text-sm">
            Don't have an account?{" "}
            <a href="/auth" className="hover:underline font-medium">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
