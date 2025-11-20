import { useState } from "react";
import { lazy } from "react";
const ProfileTitle1 = lazy(
  () => import("@/components/instructor/profile-title-1")
);
const ProfileExpertise2 = lazy(
  () => import("@/components/instructor/profile-expertise-2")
);
const ProfileLinks3 = lazy(
  () => import("@/components/instructor/profile-links-3")
);
const InstructorDashboard = () => {
  const [step, setStep] = useState<number>(1);
  const handleFinish = () => {
    setStep(4);
  };
  return (
    <div>
      {step === 1 && <ProfileTitle1 onNext={() => setStep(2)} />}
      {step === 2 && <ProfileExpertise2 onNext={() => setStep(3)} />}
      {step === 3 && <ProfileLinks3 onFinish={() => handleFinish()} />}
    </div>
  );
};

export default InstructorDashboard;
