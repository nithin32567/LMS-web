import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/api/axiosInstance';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Play } from 'lucide-react';

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

const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

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
        const sortedModules = courseData.modules
          .map((module: any) => ({
            ...module,
            lessons: (module.lessons || [])
              .filter((lesson: any) => lesson && typeof lesson === 'object')
              .sort((a: Lesson, b: Lesson) => (a.order || 0) - (b.order || 0)),
          }))
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

  const videoId = selectedLesson?.videoUrl ? extractYouTubeVideoId(selectedLesson.videoUrl) : null;
  const videoEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

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
            <div className="bg-[#1f1f1f] border border-border rounded-lg overflow-hidden">
              {videoEmbedUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={videoEmbedUrl}
                    title={selectedLesson?.title || 'Video Player'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center bg-muted/30">
                  <div className="text-center">
                    <Play className="size-12 text-foreground/40 mx-auto mb-2" />
                    <p className="text-foreground/60">
                      {selectedLesson ? 'No video available for this lesson' : 'Select a lesson to view video'}
                    </p>
                  </div>
                </div>
              )}
              {selectedLesson && (
                <div className="p-6 border-t border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {selectedLesson.title}
                  </h2>
                  <p className="text-sm text-foreground/70 mb-3">
                    {selectedLesson.description}
                  </p>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                      {selectedLesson.content}
                    </p>
                  </div>
                  {selectedLesson.duration && (
                    <div className="mt-4 text-xs text-foreground/60">
                      Duration: {selectedLesson.duration} minutes
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1f1f1f] border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Course Content</h2>
              {modules.length === 0 ? (
                <p className="text-foreground/60 text-sm">No modules available</p>
              ) : (
                <Accordion>
                  {modules.map((module) => (
                    <AccordionItem
                      key={module._id}
                      title={`${module.title} (${module.lessons.length} lessons)`}
                    >
                      <div className="space-y-2">
                        {module.lessons.length === 0 ? (
                          <p className="text-xs text-foreground/60">No lessons in this module</p>
                        ) : (
                          module.lessons.map((lesson) => (
                            <button
                              key={lesson._id}
                              type="button"
                              onClick={() => handleLessonClick(lesson)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                selectedLesson?._id === lesson._id
                                  ? 'bg-primary/20 text-primary border border-primary/30'
                                  : 'bg-background hover:bg-accent text-foreground border border-border'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <Play className="size-3 mt-1 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{lesson.title}</p>
                                  {lesson.duration && (
                                    <p className="text-xs text-foreground/60 mt-1">
                                      {lesson.duration} min
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

