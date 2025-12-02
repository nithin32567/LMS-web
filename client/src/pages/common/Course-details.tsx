import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { VideoSection } from '@/components/course/course-details/video-section';
import { ModuleLessonSection } from '@/components/course/course-details/module-section';
import { useCourse, type CourseDetails, type Lesson, type Module } from '@/contexts/coursecontext';

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { fetchCourseById, loading, error } = useCourse();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) return;

    try {
      const courseData = await fetchCourseById(courseId);
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
    } catch (err) {
      console.log('Error fetching course details:', err);
    }
  }, [courseId, fetchCourseById]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, fetchCourseDetails]);

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
    <div className="min-h-screen">
      <div className=" mx-auto px-4">
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
            {typeof course.category === 'object' && (
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {course.category.name}
              </span>
            )}
          </div>
          <p className="text-base text-foreground/70 leading-relaxed">{course.heading}</p>
        </div>

        <div className="flex w-full justify-between gap-2">
          <div className="w-[70%]">
            <VideoSection selectedLesson={selectedLesson} />
          </div>

          <div className="w-[30%]">
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

