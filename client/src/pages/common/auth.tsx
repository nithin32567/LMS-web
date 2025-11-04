import { useState } from "react";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full h-full justify-center items-center flex">
        <div className="max-w-md w-full px-8 border border-border rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-primary-button">
            Welcome Back
          </h1>
          <p className="text-center  mb-8">
            Sign in to your account to continue
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full ",

                  "transition-all duration-200",
                  "placeholder:"
                )}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "w-full ",

                  "transition-all duration-200",
                  "placeholder:"
                )}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <a href="#" className=" hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <Button
              variant="default"
              type="submit"
              className="w-full "
            >
              Sign In
            </Button>
          </form>

          <div className="flex justify-center items-center w-full my-8">
            <GoogleAuthButton className="w-full" />
          </div>
          <p className="mt-6 text-center text-sm ">
            Don't have an account?{" "}
            <a href="#" className=" hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
