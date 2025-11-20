import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileExpertise2Props {
  onNext?: (data: {
    skills: string[];
    experience: string[];
    domainOfExpertise: string;
    teachingExperience: number;
  }) => void;
}

const MAX_SKILLS = 7;

const ProfileExpertise2: React.FC<ProfileExpertise2Props> = ({ onNext }) => {
  const [skills, setSkills] = useState<string[]>([""]);
  const [experience, setExperience] = useState<string[]>([""]);
  const [domainOfExpertise, setDomainOfExpertise] = useState<string>("");
  const [teachingExperience, setTeachingExperience] = useState<string>("");

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    if (skills.length < MAX_SKILLS) {
      setSkills([...skills, ""]);
    }
  };

  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      const newSkills = skills.filter((_, i) => i !== index);
      setSkills(newSkills);
    }
  };

  const handleExperienceChange = (index: number, value: string) => {
    const newExperience = [...experience];
    newExperience[index] = value;
    setExperience(newExperience);
  };

  const addExperience = () => {
    setExperience([...experience, ""]);
  };

  const removeExperience = (index: number) => {
    if (experience.length > 1) {
      const newExperience = experience.filter((_, i) => i !== index);
      setExperience(newExperience);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredSkills = skills.filter((skill) => skill.trim() !== "");
    const filteredExperience = experience.filter((exp) => exp.trim() !== "");
    const teachingExpNum = parseInt(teachingExperience, 10);

    if (onNext) {
      onNext({
        skills: filteredSkills,
        experience: filteredExperience,
        domainOfExpertise,
        teachingExperience: teachingExpNum,
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2">
          <label htmlFor="domainOfExpertise" className="block text-sm font-medium">
            Domain of Expertise
          </label>
          <input
            id="domainOfExpertise"
            type="text"
            value={domainOfExpertise}
            onChange={(e) => setDomainOfExpertise(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="Enter your domain of expertise"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="teachingExperience" className="block text-sm font-medium">
            Teaching Experience (Years)
          </label>
          <input
            id="teachingExperience"
            type="number"
            min="0"
            value={teachingExperience}
            onChange={(e) => setTeachingExperience(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="Enter years of teaching experience"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Skills {skills.length > 0 && (
              <span className="text-xs text-muted-foreground font-normal">
                ({skills.filter((s) => s.trim() !== "").length}/{MAX_SKILLS})
              </span>
            )}
          </label>
          {skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className={cn(
                  "flex-1 px-4 py-2.5 border border-border rounded-md",
                  "transition-all duration-200",
                  "placeholder:text-muted-foreground"
                )}
                placeholder={`Skill ${index + 1}`}
                required={index === 0}
              />
              {skills.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeSkill(index)}
                  className="px-4"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addSkill}
            className="w-full"
            disabled={skills.length >= MAX_SKILLS}
          >
            {skills.length >= MAX_SKILLS ? `Maximum ${MAX_SKILLS} skills allowed` : "Add Skill"}
          </Button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Experience</label>
          {experience.map((exp, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={exp}
                onChange={(e) => handleExperienceChange(index, e.target.value)}
                className={cn(
                  "flex-1 px-4 py-2.5 border border-border rounded-md",
                  "transition-all duration-200",
                  "placeholder:text-muted-foreground"
                )}
                placeholder={`Experience ${index + 1}`}
                required={index === 0}
              />
              {experience.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeExperience(index)}
                  className="px-4"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="w-full"
          >
            Add Experience
          </Button>
        </div>

        <Button
          variant="default"
          type="submit"
          className="w-full text-base py-2.5 mt-4"
        >
          Next
        </Button>
      </form>
    </div>
  );
};

export default ProfileExpertise2;
