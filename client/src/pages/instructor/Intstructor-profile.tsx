import { useEffect, useState } from "react";
import { api } from "@/api/axiosInstance";
import { useAuth } from "@/contexts/authcontext";
import {
    Github,
    Twitter,
    Linkedin,
    Globe,
    Youtube,
    Facebook,
    Instagram,
    Briefcase,
    GraduationCap,
    Languages,
    Mail,
    ExternalLink,
    Award,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstructorData {
    headline: string;
    language: string;
    bio: string;
    skills: string[];
    experience: string;
    website?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    domainOfExpertise: string;
    teachingExperience: number;
}

const InstructorProfile = () => {
    const { user } = useAuth();
    const [instructor, setInstructor] = useState<InstructorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/instructor/profile");
                if (response.data?.instructor) {
                    setInstructor(response.data.instructor);
                }
            } catch (err: any) {
                console.error("Error fetching instructor profile:", err);
                setError("Failed to load instructor profile details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !instructor) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold text-destructive mb-4">Profile Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    {error || "We couldn't find your instructor profile information."}
                </p>
                <Button onClick={() => window.location.href = "/instructor/dashboard"}>
                    Complete Your Profile
                </Button>
            </div>
        );
    }

    const socialLinks = [
        { icon: Globe, url: instructor.website, label: "Website" },
        { icon: Github, url: instructor.github, label: "GitHub" },
        { icon: Linkedin, url: instructor.linkedin, label: "LinkedIn" },
        { icon: Twitter, url: instructor.twitter, label: "Twitter" },
        { icon: Youtube, url: instructor.youtube, label: "YouTube" },
        { icon: Facebook, url: instructor.facebook, label: "Facebook" },
        { icon: Instagram, url: instructor.instagram, label: "Instagram" },
    ].filter(link => link.url);

    return (
        <div className="min-h-screen bg-background/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <section className="bg-card rounded-3xl p-8 border border-border shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img
                                src={user?.avatar || "https://github.com/shadcn.png"}
                                alt={user?.name}
                                className="relative w-32 h-32 rounded-full object-cover border-4 border-card"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                                        {user?.name}
                                    </h1>
                                    <p className="text-xl text-primary font-medium mt-1">
                                        {instructor.headline}
                                    </p>
                                </div>
                                <Button variant="outline" className="rounded-full px-6" onClick={() => window.location.href = "/instructor/dashboard"}>
                                    Edit Profile
                                </Button>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground pt-2">
                                <span className="flex items-center gap-1.5">
                                    <Mail size={16} />
                                    {user?.email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Languages size={16} />
                                    {instructor.language}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Briefcase size={16} />
                                    {instructor.domainOfExpertise}
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
                                {socialLinks.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                                        title={link.label}
                                    >
                                        <link.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-card rounded-2xl p-7 border border-border shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Award className="text-primary" />
                                About Me
                            </h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {instructor.bio}
                            </div>
                        </section>

                        <section className="bg-card rounded-2xl p-7 border border-border shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen className="text-primary" />
                                Experience
                            </h2>
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {instructor.experience}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <section className="bg-card rounded-2xl p-7 border border-border shadow-sm">
                            <h2 className="text-xl font-bold mb-6">Expertise</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                        <GraduationCap size={16} />
                                        Teaching
                                    </h3>
                                    <p className="text-2xl font-bold text-foreground">
                                        {instructor.teachingExperience} Years
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        of educational experience
                                    </p>
                                </div>

                                <hr className="border-border/50" />

                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                        Core Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {instructor.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Quick Stats or Call to Action */}
                        <section className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-7 text-primary-foreground shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Want to learn?</h3>
                            <p className="text-primary-foreground/80 mb-6 text-sm">
                                Explore my courses and start your learning journey today with expert guidance.
                            </p>
                            <Button
                                variant="secondary"
                                className="w-full font-bold group"
                                onClick={() => window.location.href = "/instructor/my-courses"}
                            >
                                View My Courses
                                <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorProfile;
