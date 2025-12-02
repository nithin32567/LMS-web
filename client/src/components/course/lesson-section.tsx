import { useState } from 'react';
import { Plus, GripVertical, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  order: number;
  duration?: number;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: (string | Lesson)[];
}

interface LessonSectionProps {
  modules: Module[];
  loading: boolean;
  showLessonForm: boolean;
  editingLessonId: string | null;
  selectedModule: string;
  lessonForm: {
    title: string;
    description: string;
    content: string;
    order: number;
    duration: string;
    videoUrl: string;
  };
  onToggleForm: () => void;
  onModuleChange: (moduleId: string) => void;
  onFormChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onEdit: (lessonId: string, moduleId: string) => void;
  onReassignLesson: (lessonId: string, newModuleId: string) => void;
  onReorderLessons: (moduleId: string, lessonOrders: { lessonId: string; order: number }[]) => void;
}

export const LessonSection = ({
  modules,
  loading,
  showLessonForm,
  editingLessonId,
  selectedModule,
  lessonForm,
  onToggleForm,
  onModuleChange,
  onFormChange,
  onSubmit,
  onCancel,
  onEdit,
  onReassignLesson,
  onReorderLessons,
}: LessonSectionProps) => {
  const [draggedLessonId, setDraggedLessonId] = useState<string | null>(null);
  const [dragOverLessonId, setDragOverLessonId] = useState<string | null>(null);
  const [draggedModuleId, setDraggedModuleId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, lessonId: string, moduleId: string) => {
    setDraggedLessonId(lessonId);
    setDraggedModuleId(moduleId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', lessonId);
  };

  const handleDragOver = (e: React.DragEvent, lessonId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedLessonId && draggedLessonId !== lessonId) {
      setDragOverLessonId(lessonId);
    }
  };

  const handleDragLeave = () => {
    setDragOverLessonId(null);
  };

  const handleDrop = (e: React.DragEvent, targetLessonId: string, moduleId: string) => {
    e.preventDefault();
    setDragOverLessonId(null);

    if (!draggedLessonId || !draggedModuleId || draggedModuleId !== moduleId) {
      setDraggedLessonId(null);
      setDraggedModuleId(null);
      return;
    }

    if (draggedLessonId === targetLessonId) {
      setDraggedLessonId(null);
      setDraggedModuleId(null);
      return;
    }

    const module = modules.find((m) => m._id === moduleId);
    if (!module) {
      setDraggedLessonId(null);
      setDraggedModuleId(null);
      return;
    }

    const lessons = module.lessons
      .filter((lesson): lesson is Lesson => typeof lesson !== 'string')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const draggedIndex = lessons.findIndex((l) => l._id === draggedLessonId);
    const targetIndex = lessons.findIndex((l) => l._id === targetLessonId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedLessonId(null);
      setDraggedModuleId(null);
      return;
    }

    const reorderedLessons = [...lessons];
    const [removed] = reorderedLessons.splice(draggedIndex, 1);
    reorderedLessons.splice(targetIndex, 0, removed);

    const lessonOrders = reorderedLessons.map((lesson, index) => ({
      lessonId: lesson._id,
      order: index,
    }));

    onReorderLessons(moduleId, lessonOrders);
    setDraggedLessonId(null);
    setDraggedModuleId(null);
  };

  const handleDragEnd = () => {
    setDraggedLessonId(null);
    setDragOverLessonId(null);
    setDraggedModuleId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Lessons</h2>
        <Button
          type="button"
          onClick={onToggleForm}
          disabled={modules.length === 0}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          {showLessonForm ? 'Cancel' : 'Add Lesson'}
        </Button>
      </div>

      {modules.length === 0 && (
        <p className="text-foreground/60 text-center py-8">
          Create at least one module before adding lessons.
        </p>
      )}

      {showLessonForm && (
        <div className="bg-background border border-border rounded-lg p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="lessonModule" className="block text-sm font-medium mb-2 text-foreground">
                Module <span className="text-red-500">*</span>
              </label>
              <select
                id="lessonModule"
                value={selectedModule}
                onChange={(e) => onModuleChange(e.target.value)}
                required
                disabled={!!editingLessonId}
                className="w-full h-11 px-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a module</option>
                {modules.map((module) => (
                  <option key={module._id} value={module._id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lessonTitle" className="block text-sm font-medium mb-2 text-foreground">
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="lessonTitle"
                value={lessonForm.title}
                onChange={(e) => onFormChange('title', e.target.value)}
                required
                placeholder="Enter lesson title"
              />
            </div>

            <div>
              <label htmlFor="lessonDescription" className="block text-sm font-medium mb-2 text-foreground">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="lessonDescription"
                value={lessonForm.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                required
                rows={3}
                placeholder="Enter lesson description"
              />
            </div>

            <div>
              <label htmlFor="lessonContent" className="block text-sm font-medium mb-2 text-foreground">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="lessonContent"
                value={lessonForm.content}
                onChange={(e) => onFormChange('content', e.target.value)}
                required
                rows={6}
                placeholder="Enter lesson content"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lessonOrder" className="block text-sm font-medium mb-2 text-foreground">
                  Order
                </label>
                <Input
                  type="number"
                  id="lessonOrder"
                  value={lessonForm.order}
                  onChange={(e) => onFormChange('order', Number(e.target.value))}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="lessonDuration" className="block text-sm font-medium mb-2 text-foreground">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  id="lessonDuration"
                  value={lessonForm.duration}
                  onChange={(e) => onFormChange('duration', e.target.value)}
                  min="0"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lessonVideoUrl" className="block text-sm font-medium mb-2 text-foreground">
                Video URL
              </label>
              <Input
                type="url"
                id="lessonVideoUrl"
                value={lessonForm.videoUrl}
                onChange={(e) => onFormChange('videoUrl', e.target.value)}
                placeholder="https://example.com/video"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? (editingLessonId ? 'Updating...' : 'Creating...') : (editingLessonId ? 'Update Lesson' : 'Create Lesson')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {modules.map((module) => {
          const moduleLessons = module.lessons || [];
          if (moduleLessons.length === 0) return null;

          const sortedLessons = moduleLessons
            .filter((lesson): lesson is Lesson => typeof lesson !== 'string')
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          if (sortedLessons.length === 0) return null;

          return (
            <div key={module._id} className="bg-background border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">{module.title}</h3>
              <div className="space-y-2">
                {sortedLessons.map((lesson) => {
                  const lessonId = lesson._id;
                  const lessonTitle = lesson.title;
                  const lessonDescription = lesson.description;
                  const lessonOrder = lesson.order;
                  const lessonDuration = lesson.duration;
                  const currentModuleId = module._id;
                  const isDragging = draggedLessonId === lessonId;
                  const isDragOver = dragOverLessonId === lessonId;
                  
                  return (
                    <div
                      key={lessonId}
                      draggable={!loading}
                      onDragStart={(e) => handleDragStart(e, lessonId, currentModuleId)}
                      onDragOver={(e) => handleDragOver(e, lessonId)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, lessonId, currentModuleId)}
                      onDragEnd={handleDragEnd}
                      className={`bg-muted/30 rounded p-3 transition-all ${
                        isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
                      } ${
                        isDragOver ? 'border-2 border-primary border-dashed bg-primary/10' : 'border border-transparent'
                      } ${loading ? 'cursor-not-allowed' : 'hover:bg-muted/50'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2 flex-1">
                          <GripVertical className="size-4 text-foreground/40 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{lessonTitle}</p>
                            {lessonDescription && (
                              <p className="text-xs text-foreground/60 mt-1">{lessonDescription}</p>
                            )}
                            <div className="flex gap-4 mt-2 text-xs text-foreground/50">
                              {lessonOrder !== undefined && (
                                <span>Order: {lessonOrder}</span>
                              )}
                              {lessonDuration !== undefined && (
                                <span>Duration: {lessonDuration} min</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(lessonId, currentModuleId)}
                            disabled={loading || showLessonForm}
                            className="flex items-center gap-1 h-8 px-2"
                          >
                            <Pencil className="size-3" />
                            Edit
                          </Button>
                          <select
                            value={currentModuleId}
                            onChange={(e) => onReassignLesson(lessonId, e.target.value)}
                            disabled={loading}
                            className="text-xs h-8 px-2 py-1 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {modules.map((mod) => (
                              <option key={mod._id} value={mod._id}>
                                {mod.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

