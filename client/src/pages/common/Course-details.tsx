import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/api/axiosInstance';
import { VideoSection } from '@/components/course/course-details/video-section';
import { ModuleLessonSection } from '@/components/course/course-details/module-section';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  duration?: number;
  videoUrl?: string;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  heading: string;
  description: string;
  average_duration: number;
  imageurl?: string;
  category: Category | string;
  modules: Module[];
  lessons: Lesson[];
  createdAt: string;
}

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/courses/${courseId}`);
      const courseData = response.data.course;
      setCourse(courseData);

      if (courseData.modules && Array.isArray(courseData.modules)) {
        const lessonsMap = new Map<string, Lesson>();
        if (courseData.lessons && Array.isArray(courseData.lessons)) {
          courseData.lessons.forEach((lesson: Lesson) => {
            lessonsMap.set(lesson._id, lesson);
          });
        }

        const sortedModules = courseData.modules
          .map((module: any) => {
            const moduleLessons = (module.lessons || [])
              .map((lessonId: string | Lesson) => {
                if (typeof lessonId === 'string') {
                  return lessonsMap.get(lessonId);
                }
                return lessonId;
              })
              .filter((lesson: Lesson | undefined): lesson is Lesson => lesson !== undefined)
              .sort((a: Lesson, b: Lesson) => (a.order || 0) - (b.order || 0));

            return {
              ...module,
              lessons: moduleLessons,
            };
          })
          .sort((a: Module, b: Module) => (a.order || 0) - (b.order || 0));
        setModules(sortedModules);

        const firstLesson = sortedModules
          .flatMap((m: Module) => m.lessons)
          .find((l: Lesson) => l.videoUrl);
        if (firstLesson) {
          setSelectedLesson(firstLesson);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch course details');
      console.log('Error fetching course details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">{error || 'Course not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
          <p className="text-lg text-foreground/70 mb-4">{course.heading}</p>
          {typeof course.category === 'object' && (
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {course.category.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoSection selectedLesson={selectedLesson} />
          </div>

          <div className="lg:col-span-1">
            <ModuleLessonSection
              modules={modules}
              selectedLesson={selectedLesson}
              onLessonClick={handleLessonClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

