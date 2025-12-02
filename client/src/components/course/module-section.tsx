import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Module {
    _id: string;
    title: string;
    description: string;
    order: number;
    lessons: string[];
}

interface ModuleSectionProps {
    modules: Module[];
    loading: boolean;
    showModuleForm: boolean;
    editingModuleId: string | null;
    moduleForm: {
        title: string;
        description: string;
        order: number;
    };
    onToggleForm: () => void;
    onFormChange: (field: string, value: string | number) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onEdit: (moduleId: string) => void;
}

export const ModuleSection = ({
    modules,
    loading,
    showModuleForm,
    editingModuleId,
    moduleForm,
    onToggleForm,
    onFormChange,
    onSubmit,
    onCancel,
    onEdit,
}: ModuleSectionProps) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Modules</h2>
                <Button
                    type="button"
                    onClick={onToggleForm}
                    className="flex items-center gap-2"
                >
                    <Plus className="size-4" />
                    {showModuleForm ? 'Cancel' : 'Add Module'}
                </Button>
            </div>

            {showModuleForm && (
                <div className="bg-background border border-border rounded-lg p-6">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="moduleTitle" className="block text-sm font-medium mb-2 text-foreground">
                                Module Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                id="moduleTitle"
                                value={moduleForm.title}
                                onChange={(e) => onFormChange('title', e.target.value)}
                                required
                                placeholder="Enter module title"
                            />
                        </div>

                        <div>
                            <label htmlFor="moduleDescription" className="block text-sm font-medium mb-2 text-foreground">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="moduleDescription"
                                value={moduleForm.description}
                                onChange={(e) => onFormChange('description', e.target.value)}
                                required
                                rows={4}
                                placeholder="Enter module description"
                            />
                        </div>

                        <div>
                            <label htmlFor="moduleOrder" className="block text-sm font-medium mb-2 text-foreground">
                                Order
                            </label>
                            <Input
                                type="number"
                                id="moduleOrder"
                                value={moduleForm.order}
                                onChange={(e) => onFormChange('order', Number(e.target.value))}
                                min="0"
                                placeholder="0"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={loading}>
                                {loading ? (editingModuleId ? 'Updating...' : 'Creating...') : (editingModuleId ? 'Update Module' : 'Create Module')}
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
                {modules.length === 0 ? (
                    <p className="text-foreground/60 text-center py-8">No modules yet. Create your first module!</p>
                ) : (
                    modules.map((module) => (
                        <div key={module._id} className="bg-background border border-border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground">{module.title}</h3>
                                    <p className="text-sm text-foreground/70 mt-1">{module.description}</p>
                                    <p className="text-xs text-foreground/60 mt-2">
                                        Order: {module.order} · Lessons: {module.lessons?.length || 0}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(module._id)}
                                        disabled={loading || showModuleForm}
                                        className="flex items-center gap-2"
                                    >
                                        <Pencil className="size-3" />
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

