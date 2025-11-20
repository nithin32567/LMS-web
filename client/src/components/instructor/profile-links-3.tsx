import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileLinks3Props {
  onFinish?: (data: {
    website: string;
    youtube: string;
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    github: string;
  }) => void;
}

const ProfileLinks3: React.FC<ProfileLinks3Props> = ({ onFinish }) => {
  const [website, setWebsite] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [github, setGithub] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFinish) {
      onFinish({
        website,
        youtube,
        twitter,
        facebook,
        instagram,
        linkedin,
        github,
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2">
          <label htmlFor="website" className="block text-sm font-medium">
            Website
          </label>
          <input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="youtube" className="block text-sm font-medium">
            YouTube
          </label>
          <input
            id="youtube"
            type="url"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="https://youtube.com/@yourchannel"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="twitter" className="block text-sm font-medium">
            Twitter
          </label>
          <input
            id="twitter"
            type="url"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="https://twitter.com/yourhandle"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="facebook" className="block text-sm font-medium">
            Facebook
          </label>
          <input
            id="facebook"
            type="url"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="https://facebook.com/yourprofile"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="instagram" className="block text-sm font-medium">
            Instagram
          </label>
          <input
            id="instagram"
            type="url"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="https://instagram.com/yourhandle"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedin" className="block text-sm font-medium">
            LinkedIn
          </label>
          <input
            id="linkedin"
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="github" className="block text-sm font-medium">
            GitHub
          </label>
          <input
            id="github"
            type="url"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 border border-border rounded-md",
              "transition-all duration-200",
              "placeholder:text-muted-foreground"
            )}
            placeholder="https://github.com/yourusername"
          />
        </div>

        <Button
          variant="default"
          type="submit"
          className="w-full text-base py-2.5 mt-4"
        >
          Finish
        </Button>
      </form>
    </div>
  );
};

export default ProfileLinks3;