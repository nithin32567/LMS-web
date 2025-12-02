import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
    description?: string;
}

interface Course {
    _id: string;
    title: string;
    heading: string;
    description: string;
    average_duration: number;
    imageurl?: string;
    category: Category | string;
    modules: string[];
    lessons: string[];
    modulesCount?: number;
    lessonsCount?: number;
    createdAt: string;
}

interface CourseCardProps {
    course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#1f1f1f] border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow max-w-sm">
            {course.imageurl && (
                <div className="px-4 pt-4">
                    <img
                        src={course.imageurl}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-md"
                    />
                </div>
            )}
            <div className="p-6">
                <div className="mb-2">
                    {typeof course.category === 'object' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {course.category.name}
                        </span>
                    )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    {course.title}
                </h3>
                <p className="text-sm text-foreground/70 mb-2">
                    {course.heading}
                </p>
                <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                    {course.description}
                </p>
                <div className="flex items-center justify-between text-sm text-foreground/60">
                    <span>{course.average_duration} months</span>
                    <span>
                        {course.modulesCount || course.modules?.length || 0} modules · {course.lessonsCount || course.lessons?.length || 0} lessons
                    </span>
                </div>
                <div className="mt-4 space-y-2">
                    <Button
                        onClick={() => navigate(`/course/${course._id}`)}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        View Details
                    </Button>
                    <Button
                        onClick={() => navigate(`/instructor/course/${course._id}/modules-lessons`)}
                        className="w-full flex items-center justify-center gap-2"
                        variant="outline"
                    >
                        <BookOpen className="size-4" />
                        Manage Modules & Lessons
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;

