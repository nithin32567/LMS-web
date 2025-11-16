import { api } from "@/api/axiosInstance";
import { useState } from "react";
import { useAuth } from "@/contexts/authcontext";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  name: string;
  email: string;
  avatar: string;
}

export default function useSignupWithEmailAndOtp(email: string, name: string) {
  const { setAuthData } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const handleSignupWithEmailAndOtp = async () => {
    setLoading(true);
    setError("");
    setOtpSent(false);
    try {
      const response = await api.post("/auth/signup-with-email-and-otp", {
        email,
        name,
      });
      console.log("response in handleSignupWithEmailAndOtp", response);
      setOtpSent(true);
    } catch (error: any) {
      setOtpSent(false);    
      console.log("error in handleSignupWithEmailAndOtp", error);
      setError(error.response?.data?.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });
      console.log("response in handleVerifyOtp", response);
      if (response.data.accessToken) {
        const decoded: DecodedToken = jwtDecode(response.data.accessToken);
        setAuthData(response.data.accessToken, decoded);
      }
    } catch (error: any) {
      console.log("error in handleVerifyOtp", error);
      setError(error.response?.data?.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  return {
    handleSignupWithEmailAndOtp,
    handleVerifyOtp,
    loading,
    error,
    otpSent,
  };
}
