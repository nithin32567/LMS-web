import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Play } from 'lucide-react';

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

interface ModuleLessonSectionProps {
  modules: Module[];
  selectedLesson: Lesson | null;
  onLessonClick: (lesson: Lesson) => void;
}

export const ModuleLessonSection = ({
  modules,
  selectedLesson,
  onLessonClick,
}: ModuleLessonSectionProps) => {
  return (
    <div className="bg-[#1f1f1f] border border-border rounded-lg p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">Course Content</h2>
      {modules.length === 0 ? (
        <p className="text-foreground/60 text-sm">No modules available</p>
      ) : (
        <Accordion>
          {modules.map((module, index) => (
            <AccordionItem
              key={module._id}
              title={`${module.title} (${module.lessons?.length || 0} lessons)`}
              defaultOpen={index === 0}
            >
              <div className="space-y-2">
                {!module.lessons || module.lessons.length === 0 ? (
                  <p className="text-xs text-foreground/60">No lessons in this module</p>
                ) : (
                  module.lessons.map((lesson) => (
                    <button
                      key={lesson._id}
                      type="button"
                      onClick={() => onLessonClick(lesson)}
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
  );
};

