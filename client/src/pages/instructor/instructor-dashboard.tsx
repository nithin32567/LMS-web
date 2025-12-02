import { useEffect, useState, lazy } from "react";
import { api } from "@/api/axiosInstance";
const ProfileTitle1 = lazy(
  () => import("@/components/instructor/profile-title-1")
);
const ProfileExpertise2 = lazy(
  () => import("@/components/instructor/profile-expertise-2")
);
const ProfileLinks3 = lazy(
  () => import("@/components/instructor/profile-links-3")
);
interface ProfileTitleData {
  headline: string;
  language: string;
  bio: string;
}
interface ProfileExpertiseData {
  skills: string[];
  experience: string[];
  domainOfExpertise: string;
  teachingExperience: number;
}
interface ProfileLinksData {
  website: string;
  youtube: string;
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  github: string;
}
const InstructorDashboard = () => {
  const [step, setStep] = useState<number>(1);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [titleData, setTitleData] = useState<ProfileTitleData | null>(null);
  const [expertiseData, setExpertiseData] = useState<ProfileExpertiseData | null>(null);
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await api.get("/instructor/profile");
        if (response.status === 200 && response.data?.instructor) {
          setProfileCompleted(true);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setProfileCompleted(false);
        }
      } finally {
        setLoading(false);
      }
    };
    checkProfile();
  }, []);
  const handleFinish = async (linksData: ProfileLinksData) => {
    if (!titleData || !expertiseData) {
      return;
    }
    try {
      const payload = {
        ...titleData,
        ...expertiseData,
        ...linksData,
      };
      await api.post("/instructor/profile", payload);
      setProfileCompleted(true);
    } catch (error) {
      console.log("error in handleFinish", error);
    }
  };
  if (loading) {
    return null;
  }
  if (profileCompleted) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-2">Instructor profile</h1>
        <p className="text-sm text-muted-foreground">
          Your instructor profile is already completed.
        </p>
      </div>
    );
  }
  return (
    <div>
      {step === 1 && (
        <ProfileTitle1
          onNext={(data) => {
            setTitleData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <ProfileExpertise2
          onNext={(data) => {
            setExpertiseData(data);
            setStep(3);
          }}
        />
      )}
      {step === 3 && <ProfileLinks3 onFinish={handleFinish} />}
    </div>
  );
};

export default InstructorDashboard;
