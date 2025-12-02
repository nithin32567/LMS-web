import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/api/axiosInstance';
import { ModuleSection } from '@/components/course/module-section';
import { LessonSection } from '@/components/course/lesson-section';

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: string[];
}


interface Course {
  _id: string;
  title: string;
}

const CreateModuleLesson = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'module' | 'lesson'>('module');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [showModuleForm, setShowModuleForm] = useState<boolean>(false);
  const [showLessonForm, setShowLessonForm] = useState<boolean>(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order: 0,
  });
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    content: '',
    order: 0,
    duration: '',
    videoUrl: '',
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchModules();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data.course);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch course');
      console.log('Error fetching course:', err);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await api.get(`/modules/course/${courseId}`);
      const sortedModules = (response.data.modules || []).sort((a: Module, b: Module) => a.order - b.order);
      setModules(sortedModules);
    } catch (err: any) {
      console.log('Error fetching modules:', err);
    }
  };

  const fetchLessonDetails = async (lessonId: string, moduleId: string) => {
    try {
      const response = await api.get(`/lessons/module/${moduleId}`);
      const lesson = response.data.lessons.find((l: any) => l._id === lessonId);
      return lesson || null;
    } catch (err: any) {
      console.log('Error fetching lesson:', err);
      return null;
    }
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!moduleForm.title.trim() || !moduleForm.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    try {
      if (editingModuleId) {
        await api.put(`/modules/${editingModuleId}`, {
          title: moduleForm.title,
          description: moduleForm.description,
        });
      } else {
        await api.post('/modules', {
          title: moduleForm.title,
          description: moduleForm.description,
          course: courseId,
          order: moduleForm.order,
        });
      }
      setModuleForm({ title: '', description: '', order: 0 });
      setShowModuleForm(false);
      setEditingModuleId(null);
      await fetchModules();
    } catch (err: any) {
      setError(err.response?.data?.message || (editingModuleId ? 'Failed to update module' : 'Failed to create module'));
      console.log('Error saving module:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleFormChange = (field: string, value: string | number) => {
    setModuleForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleModuleToggleForm = () => {
    setShowModuleForm(!showModuleForm);
    setError(null);
  };

  const handleModuleCancel = () => {
    setShowModuleForm(false);
    setModuleForm({ title: '', description: '', order: 0 });
    setEditingModuleId(null);
  };

  const handleEditModule = (moduleId: string) => {
    const module = modules.find((m) => m._id === moduleId);
    if (module) {
      setModuleForm({
        title: module.title,
        description: module.description,
        order: module.order,
      });
      setEditingModuleId(moduleId);
      setShowModuleForm(true);
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!lessonForm.title.trim() || !lessonForm.description.trim() || !lessonForm.content.trim() || !selectedModule) {
      setError('Title, description, content, and module are required');
      return;
    }

    setLoading(true);
    try {
      if (editingLessonId) {
        await api.put(`/lessons/${editingLessonId}`, {
          title: lessonForm.title,
          description: lessonForm.description,
          content: lessonForm.content,
          duration: lessonForm.duration ? Number(lessonForm.duration) : undefined,
          videoUrl: lessonForm.videoUrl || undefined,
        });
      } else {
        await api.post('/lessons', {
          title: lessonForm.title,
          description: lessonForm.description,
          content: lessonForm.content,
          module: selectedModule,
          course: courseId,
          order: lessonForm.order,
          duration: lessonForm.duration ? Number(lessonForm.duration) : undefined,
          videoUrl: lessonForm.videoUrl || undefined,
        });
      }
      setLessonForm({ title: '', description: '', content: '', order: 0, duration: '', videoUrl: '' });
      setSelectedModule('');
      setShowLessonForm(false);
      setEditingLessonId(null);
      await fetchModules();
    } catch (err: any) {
      setError(err.response?.data?.message || (editingLessonId ? 'Failed to update lesson' : 'Failed to create lesson'));
      console.log('Error saving lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonFormChange = (field: string, value: string | number) => {
    setLessonForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLessonToggleForm = () => {
    setShowLessonForm(!showLessonForm);
    setError(null);
  };

  const handleLessonCancel = () => {
    setShowLessonForm(false);
    setLessonForm({ title: '', description: '', content: '', order: 0, duration: '', videoUrl: '' });
    setSelectedModule('');
    setEditingLessonId(null);
  };

  const handleEditLesson = async (lessonId: string, moduleId: string) => {
    const lesson = await fetchLessonDetails(lessonId, moduleId);
    if (lesson) {
      setLessonForm({
        title: lesson.title || '',
        description: lesson.description || '',
        content: lesson.content || '',
        order: lesson.order || 0,
        duration: lesson.duration ? String(lesson.duration) : '',
        videoUrl: lesson.videoUrl || '',
      });
      setSelectedModule(moduleId);
      setEditingLessonId(lessonId);
      setShowLessonForm(true);
    }
  };

  const handleReassignLesson = async (lessonId: string, newModuleId: string) => {
    setError(null);
    setLoading(true);
    try {
      await api.put(`/lessons/${lessonId}/assign/${newModuleId}`);
      await fetchModules();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reassign lesson');
      console.log('Error reassigning lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorderLessons = async (_moduleId: string, lessonOrders: { lessonId: string; order: number }[]) => {
    setError(null);
    setLoading(true);
    try {
      await api.put('/lessons/order/bulk', { lessonOrders });
      await fetchModules();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reorder lessons');
      console.log('Error reordering lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Manage Modules & Lessons
          </h1>
          {course && (
            <p className="text-sm text-muted-foreground">
              Course: {course.title}
            </p>
          )}
        </div>

        <div className="flex gap-2 mb-6 border-b border-border">
          <Button
            type="button"
            variant={activeTab === 'module' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('module')}
            className="rounded-b-none"
          >
            <BookOpen className="size-4 mr-2" />
            Modules
          </Button>
          <Button
            type="button"
            variant={activeTab === 'lesson' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('lesson')}
            className="rounded-b-none"
          >
            <FileText className="size-4 mr-2" />
            Lessons
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {activeTab === 'module' && (
          <ModuleSection
            modules={modules}
            loading={loading}
            showModuleForm={showModuleForm}
            editingModuleId={editingModuleId}
            moduleForm={moduleForm}
            onToggleForm={handleModuleToggleForm}
            onFormChange={handleModuleFormChange}
            onSubmit={handleModuleSubmit}
            onCancel={handleModuleCancel}
            onEdit={handleEditModule}
          />
        )}

        {activeTab === 'lesson' && (
          <LessonSection
            modules={modules}
            loading={loading}
            showLessonForm={showLessonForm}
            editingLessonId={editingLessonId}
            selectedModule={selectedModule}
            lessonForm={lessonForm}
            onToggleForm={handleLessonToggleForm}
            onModuleChange={setSelectedModule}
            onFormChange={handleLessonFormChange}
            onSubmit={handleLessonSubmit}
            onCancel={handleLessonCancel}
            onEdit={handleEditLesson}
            onReassignLesson={handleReassignLesson}
            onReorderLessons={handleReorderLessons}
          />
        )}

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/instructor/my-courses')}
          >
            Back to Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateModuleLesson;

