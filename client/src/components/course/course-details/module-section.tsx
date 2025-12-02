import { useState } from 'react';
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
    const [openModuleId, setOpenModuleId] = useState<string | null>(
        modules.length > 0 ? modules[0]._id : null
    );

    return (
        <div className="bg-[#121212] border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Course Content</h2>
            {modules.length === 0 ? (
                <p className="text-foreground/60 text-sm">No modules available</p>
            ) : (
                <Accordion>
                    {modules.map((module) => (
                        <AccordionItem
                            key={module._id}
                            title={`${module.title} (${module.lessons?.length || 0} lessons)`}
                            isOpen={openModuleId === module._id}
                            onToggle={() => setOpenModuleId(openModuleId === module._id ? null : module._id)}
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
                                            className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${selectedLesson?._id === lesson._id
                                                ? 'bg-primary/20 text-primary border border-primary/30'
                                                : 'bg-background hover:bg-accent text-foreground border border-border'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between gap-2 w-full">
                                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                                    <Play className="size-4 mt-1 flex-shrink-0" />
                                                    <p className="font-medium truncate">{lesson.title}</p>
                                                </div>
                                                {lesson.duration && (
                                                    <p className="text-xs text-foreground/60 flex-shrink-0">
                                                        {lesson.duration} min
                                                    </p>
                                                )}
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

