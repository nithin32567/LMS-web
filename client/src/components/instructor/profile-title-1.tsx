import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileTitle1Props {
  onNext?: (data: { headline: string; language: string; bio: string }) => void;
}

const ProfileTitle1: React.FC<ProfileTitle1Props> = ({ onNext }) => {
  const [headline, setHeadline] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) {
      onNext({ headline, language, bio });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2">
          <label htmlFor="headline" className="block text-sm font-medium">
            Headline
          </label>
          <input
            id="headline"
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="Enter your professional headline"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="language" className="block text-sm font-medium">
            Language
          </label>
          <input
            id="language"
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="Enter your preferred language"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={6}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground",
              "resize-none"
            )}
            placeholder="Tell us about yourself"
            required
          />
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

export default ProfileTitle1;
