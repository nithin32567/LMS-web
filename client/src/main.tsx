import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/authcontext";
import { UserProvider } from "./contexts/usercontext";
import { CourseProvider } from "./contexts/coursecontext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <UserProvider>
        <CourseProvider>
          <App />
        </CourseProvider>
      </UserProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
